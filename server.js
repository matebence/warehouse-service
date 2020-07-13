const hateoasLinker = require('express-hateoas-links');
const expressValidator = require('express-validator');
const node = require('./resources/bootstrap');
const client = require("cloud-config-client");
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(expressValidator());
app.use(bodyParser.json());
app.use(hateoasLinker);
app.use(helmet());

client.load({
    endpoint: node.cloud.config.uri,
    name: node.application.name,
    profiles: node.profiles.active,
    auth: {user: node.cloud.config.username, pass: node.cloud.config.password}
}).then(config => {
    config.bootstrap = node;

    require("./app/component/eureka.component")(app, config);
    require("./app/component/zipkin.component")(app, config);
    require("./app/component/resilient.component")(app, config, () => {

        require("./app/models")(app, config);
        require("./app/routes/auth.routes")(app, config);
        require("./app/routes/warehouses.routes")(app);
        require("./app/routes/errors.routes")(app);
    });

    return app.listen(node.server.port);
}).then(() => {
    console.log(`Server beží na porte ${node.server.port}`)
}).catch(console.error);