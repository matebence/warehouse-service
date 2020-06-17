module.exports = app => {
    const warehouses = require("../controllers/warehouses.controller");
    const router = require("express").Router();

    router.post("/", warehouses.create.authorize, warehouses.create.checkBody, warehouses.create.validate, warehouses.create.inDatabase);

    router.delete("/:id", warehouses.delete.authorize, warehouses.delete.validate, warehouses.delete.inDatabase);

    router.put("/:id", warehouses.update.authorize, warehouses.update.checkBody, warehouses.update.validate, warehouses.update.inDatabase);

    router.get("/:id", warehouses.get.authorize, warehouses.get.validate, warehouses.get.inDatabase, warehouses.get.fetchDataFromService, warehouses.get.fetchDataFromCache);

    router.get("/page/:pageNumber/limit/:pageSize", warehouses.getAll.authorize, warehouses.getAll.validate, warehouses.getAll.inDatabase, warehouses.getAll.fetchDataFromService, warehouses.getAll.fetchDataFromCache);

    router.post("/search", warehouses.search.authorize, warehouses.search.checkBody, warehouses.search.inDatabase, warehouses.search.fetchDataFromService, warehouses.search.fetchDataFromCache);

    router.post("/join/:columnName", warehouses.join.authorize, warehouses.join.checkBody, warehouses.join.validate, warehouses.join.inDatabase);

    app.use('/api/warehouses', router);
};