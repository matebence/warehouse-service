module.exports = app => {
    const warehouses = require("../controllers/warehouses.controller");
    const router = require("express").Router();

    router.post("/", warehouses.create.authorize, warehouses.create.checkBody, warehouses.create.validate, warehouses.create.inDatabase);

    router.delete("/:id", warehouses.delete.authorize, warehouses.delete.validate, warehouses.delete.inDatabase);

    router.put("/:id", warehouses.update.authorize, warehouses.update.checkBody, warehouses.update.validate, warehouses.update.inDatabase);

    router.get("/:id", warehouses.get.authorize, warehouses.get.validate, warehouses.get.inDatabase);

    router.get("/page/:pageNumber/limit/:pageSize", warehouses.getAll.authorize, warehouses.getAll.validate, warehouses.getAll.inDatabase);

    router.post("/search", warehouses.search.authorize, warehouses.search.checkBody, warehouses.search.inDatabase);

    app.use('/api/warehouses', router);
};