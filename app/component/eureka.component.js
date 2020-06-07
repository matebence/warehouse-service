module.exports = (app, config) => {
    const strings = require('../../resources/strings');
    const Eureka = require('eureka-js-client').Eureka;
    const eureka = {
        instance: {
            hostName: require('os').hostname(),
            app: config.bootstrap.application.name.toUpperCase(),
            vipAddress: config.bootstrap.application.name,
            instanceId: `${require('os').hostname()}:${config.bootstrap.application.name}:${config.bootstrap.server.port}`,
            ipAddr: require('ip').address(),
            status: "UP",
            port: {
                $: config.bootstrap.server.port,
                '@enabled': 'true',
            },
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
            registerWithEureka: true,
            fetchRegistry: true,
        },
        eureka: {
            host: config.get('node.eureka.host'),
            port: config.get('node.eureka.port'),
            servicePath: config.get('node.eureka.service-path'),
        }
    };

    new Eureka({instance: eureka.instance, eureka: eureka.eureka}).start(result => {
        console.log(strings.EUREKA_ERR)
    });
};