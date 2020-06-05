const node = require('./resources/bootstrap');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

const config = {
    createDrop: true,
    driver: 'mongodb',
    database: 'warehouse_service',
    user: 'wrh_user',
    password: '9271d726a612749267d1926c8c4c7fc8',
    host: '192.168.99.100',
    port: 27017
};

require("./app/models")(config);
require("./app/routes/warehouses.routes")(app);
require("./app/routes/errors.routes")(app);

app.listen(node.server.port, () => {
    console.log(`Server beží na porte ${node.server.port}`)
});