const node = require('./resources/bootstrap');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

require("./app/routes/warehouses.routes")(app);

require("./app/routes/errors.routes")(app);

app.listen(node.server.port, () => {
    console.log(`Server beží na porte ${node.server.port}`)
});