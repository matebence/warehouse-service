const strings = require('../../resources/strings');
const database = require("../models");

const Warehouses = database.warehouses;

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

exports.create = {
    authorize: (req, res, next) => {
        next()
    },
    checkBody: (req, res, next) => {
        next()
    },
    validate: [],
    inDatabase: (req, res, next) => {
        return Promise.all([Warehouses.startSession(), Warehouses(req.body).save()]).then(([session, data]) => {
            session.startTransaction();
            if (data) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(201).json(data, [{rel: "warehouse", method: "GET", href: `${req.protocol}://${req.get('host')}/api/warehouses/${data._id}`}]);
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                });
                throw strings.CREATE_WAREHOUSE_ERR;
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.CREATE_WAREHOUSE_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.delete = {
    authorize: (req, res, next) => {
        next()
    },
    validate: [],
    inDatabase: (req, res, next) => {
        return Promise.all([Warehouses.startSession(), Warehouses.delete({_id: database.mongoose.Types.ObjectId(req.params.id), deleted: false})]).then(([session, data]) => {
            session.startTransaction();
            if (data.n === 1) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json({});
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(400).json({
                        timestamp: new Date().toISOString(),
                        message: strings.GET_WAREHOUSE_ERR,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.DELETE_WAREHOUSE_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.update = {
    authorize: (req, res, next) => {
        next()
    },
    checkBody: (req, res, next) => {
        next()
    },
    validate: [],
    inDatabase: (req, res, next) => {
        return Promise.all([Warehouses.startSession(), Warehouses.findByIdAndUpdate(req.params.id, req.body)]).then(([session, data]) => {
            session.startTransaction();
            if (data) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json({});
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(500).json({
                        timestamp: new Date().toISOString(),
                        message: strings.UPDATE_WAREHOUSE_ERR,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.GET_WAREHOUSE_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.get = {
    authorize: (req, res, next) => {
        next()
    },
    validate: [],
    inDatabase: (req, res, next) => {
        return Promise.all([Warehouses.startSession(), Warehouses.findOne({_id: req.params.id, deleted: false})]).then(([session, data]) => {
            session.startTransaction();
            if (data) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json(data, [
                        {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                        {rel: "all-warehouses", method: "GET", href: `${req.protocol}://${req.get('host')}/api/warehouses/page/${DEFAULT_PAGE_NUMBER}/${DEFAULT_PAGE_SIZE}`}]);
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(400).json({
                        timestamp: new Date().toISOString(),
                        message: strings.GET_WAREHOUSE_ERR,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.WAREHOUSE_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.getAll = {
    authorize: (req, res, next) => {
        next()
    },
    validate: [],
    inDatabase: (req, res, next) => {
        return Promise.all([Warehouses.startSession(), Warehouses.find({deleted: false}).sort('createdAt').skip((Number(req.params.pageNumber) - 1) * Number(req.params.pageSize)).limit(Number(req.params.pageSize))]).then(([session, data]) => {
            session.startTransaction();
            if (data.length > 0 || data !== undefined) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(206).json({data}, [
                        {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                        {rel: "next-range", method: "GET", href: `${req.protocol}://${req.get('host')}/api/warehouses/page/${1 + Number(req.params.pageNumber)}/${req.params.pageSize}`}]);
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(400).json({
                        timestamp: new Date().toISOString(),
                        message: strings.WAREHOUSE_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.WAREHOUSE_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.search = {
    authorize: (req, res, next) => {
        next()
    },
    checkBody: (req, res, next) => {
        next()
    },
    inDatabase: (req, res, next) => {
        const pagination = req.body.pagination;
        const order = req.body.orderBy;
        const search = req.body.search;

        if (order) {
            Object.keys(order).map(function (key, index) {
                if (order[key].toLowerCase() === 'asc') {
                    order[key] = 1;
                } else if (order[key].toLowerCase() === 'desc') {
                    order[key] = -1;
                }
            });
        }
        if (search) {
            Object.keys(search).map(function (key, index) {
                search[key] = {$regex: new RegExp("^.*" + search[key] + '.*', "i")}
            });
        }
        return Promise.all([Warehouses.startSession(), Warehouses.find({deleted: false, ...search}).sort(order).skip((Number(pagination.pageNumber) - 1) * Number(pagination.pageSize)).limit(Number(pagination.pageSize))]).then(([session, data]) => {
            session.startTransaction();
            if (data.length > 0 || data !== undefined) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json({data}, [
                        {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                        {rel: "next-range", method: "GET", href: `${req.protocol}://${req.get('host')}/api/warehouses/page/${1 + Number(req.params.pageNumber)}/${req.params.pageSize}`}]);
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                    return res.status(400).json({
                        timestamp: new Date().toISOString(),
                        message: strings.WAREHOUSE_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.WAREHOUSE_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};