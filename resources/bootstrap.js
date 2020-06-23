module.exports = {
    application: {
        name: "warehouse-service"
    },
    cloud: {
        config: {
            uri: "http://config-server:8888",
            username: "app-blesk-config-server",
            password: "b8199f18ee07292f39f5d9213cf493e8"
        }
    },
    profiles: {
        active: "prod"
    },
    server: {
        port: process.env.PORT
    }
};