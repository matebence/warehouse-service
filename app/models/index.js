module.exports = (config) => {
    const strings = require('../../resources/strings');
    const data = require('../../resources/data.json');
    const mongoose = require("mongoose");

    mongoose.connect(`${config.driver}://${config.host}:${config.port}/${config.database}?retryWrites=false`,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            auth: {
                authSource: "admin"
            },
            user: config.user,
            pass: config.password
        }
    );

    mongoose.connection.on("connected", function () {
        console.log(`${strings.DATABASE_CONNECTED} ${config.host}:${config.port}`);
    });
    mongoose.connection.on("error", function (error) {
        console.log(`${strings.DATABASE_CONNECTION_ERROR} ${config.host}:${config.port} - ${error}`);
    });
    mongoose.connection.on("disconnected", function () {
        console.log(`${strings.DATABASE_DISCONNECTED} ${config.host}:${config.port}`);
    });

    const database = {};
    database.mongoose = mongoose;
    if (config.createDrop) mongoose.connection.dropDatabase(config.database);
    database.warehouses = require("./warehouses.model")(mongoose, mongoose.Schema, mongoose.model);
    database.warehouses.insertMany(data, (err) => {
        err ? console.log(strings.DATABASE_SEED_ERR) : console.log(strings.DATABASE_SEED)
    });

    module.exports = database;
};