module.exports = (app, config) => {
    const strings = require('../../resources/strings');
    const data = require('../../resources/data.json');
    const mongoose = require("mongoose");
    const redis = require("redis");

    const mongooseClient = mongoose.connect(`${config.get('node.datasource.driver')}://${config.get('node.datasource.host')}:${config.get('node.datasource.port')}/${config.get('node.datasource.database')}?retryWrites=false`,
        {
            useUnifiedTopology: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useCreateIndex: true,
            auth: {
                authSource: "admin"
            },
            user: config.get('node.datasource.username'),
            pass: config.get('node.datasource.password')
        }
    );

    const redisClient = redis.createClient({
        host: config.get('node.datasource.redis.host'),
        port: config.get('node.datasource.redis.port'),
        password: config.get('node.datasource.redis.password')
    }).on("error", (error) => {
        console.log(`${strings.REDIS_DATABASE_CONNECTION_ERROR} ${config.get('node.datasource.redis.host')}:${config.get('node.datasource.redis.port')}`);
    });

    mongoose.connection.on("connected", function () {
        console.log(`${strings.DATABASE_CONNECTED} ${config.get('node.datasource.host')}:${config.get('node.datasource.port')}`);
    });
    mongoose.connection.on("error", function (error) {
        console.log(`${strings.DATABASE_CONNECTION_ERROR} ${config.get('node.datasource.port')}:${config.port} - ${error}`);
    });
    mongoose.connection.on("disconnected", function () {
        console.log(`${strings.DATABASE_DISCONNECTED} ${config.get('node.datasource.host')}:${config.get('node.datasource.port')}`);
    });

    const database = {};
    database.mongoose = mongoose;
    database.redis = redisClient;

    if (config.get('node.mongoose.create-drop')) mongoose.connection.dropDatabase(config.get('node.datasource.database'));
    database.warehouses = require("./warehouses.model")(mongoose, mongoose.Schema, mongoose.model);

    database.warehouses.insertMany(data, (err) => {
        err ? console.log(strings.DATABASE_SEED_ERR) : console.log(strings.DATABASE_SEED)
    });

    module.exports = database;
};