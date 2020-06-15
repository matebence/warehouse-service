const {validationResult, check} = require('express-validator/check');

const strings = require('../../resources/strings');
const database = require("../models");

const Warehouses = database.warehouses;

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

exports.create = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next();
    },
    validate: [
        check('regions')
            .isInt().withMessage(strings.WAREHOUSE_REGIONS_INT),
        check('name')
            .isLength({min: 3, max: 64}).withMessage(strings.WAREHOUSE_NAME_LENGHT)
            .isAscii(['sk-SK']).withMessage(strings.WAREHOUSE_NAME_ASCII),
        check('country')
            .isLength({min: 3, max: 64}).withMessage(strings.WAREHOUSE_COUNTRY_LENGHT)
            .isAlpha(['sk-SK']).withMessage(strings.WAREHOUSE_COUNTRY_ALPHA),
        check('address')
            .isLength({min: 3, max: 64}).withMessage(strings.WAREHOUSE_ADDRESS_LENGHT)
            .matches(/^([^\x00-\x7F]|\w)+, ([^\x00-\x7F]|\w)+ \d*$/).withMessage(strings.WAREHOUSE_ADDRESS_MATCHES),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return Promise.all([Warehouses.startSession(), Warehouses(req.body).save()]).then(([session, data]) => {
            session.startTransaction();
            if (data) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(201).json(data, [
                        {rel: "warehouse", method: "GET", href: `${req.protocol}://${req.get('host')}/api/warehouses/${data._id}`}]);
                });
            } else {
                session.abortTransaction().then(() => {
                    session.endSession();
                });
                throw strings.CREATE_WAREHOUSE_ERR;
            }
        }).catch(err => {
            const response = {
                timestamp: new Date().toISOString(),
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            };
            if (err.code === 11000) {
                response.message = strings.WAREHOUSE_UNIQUE;
                return res.status(500).json(response);
            }
            response.message = strings.CREATE_WAREHOUSE_ERR;
            return res.status(500).json(response);
        });
    }
};

exports.delete = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('id')
            .isMongoId().withMessage(strings.WAREHOUSE_MONGO_ID),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
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
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next();
    },
    validate: [
        check('id')
            .isMongoId().withMessage(strings.WAREHOUSE_MONGO_ID),
        check('regions')
            .isInt().withMessage(strings.WAREHOUSE_REGIONS_INT),
        check('name')
            .isLength({min: 3, max: 64}).withMessage(strings.WAREHOUSE_NAME_LENGHT)
            .isAscii(['sk-SK']).withMessage(strings.WAREHOUSE_NAME_ASCII),
        check('country')
            .isLength({min: 3, max: 64}).withMessage(strings.WAREHOUSE_COUNTRY_LENGHT)
            .isAlpha(['sk-SK']).withMessage(strings.WAREHOUSE_COUNTRY_ALPHA),
        check('address')
            .isLength({min: 3, max: 64}).withMessage(strings.WAREHOUSE_ADDRESS_LENGHT)
            .matches(/^([^\x00-\x7F]|\w)+, ([^\x00-\x7F]|\w)+ \d*$/).withMessage(strings.WAREHOUSE_ADDRESS_MATCHES),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return Promise.all([Warehouses.startSession(), Warehouses.findOneAndUpdate({_id: req.params.id}, req.body)]).then(([session, data]) => {
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
            const response = {
                timestamp: new Date().toISOString(),
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            };
            if (err.code === 11000) {
                response.message = strings.WAREHOUSE_UNIQUE;
                return res.status(500).json(response);
            }
            response.message = strings.GET_WAREHOUSE_ERR;
            return res.status(400).json(response);
        });
    }
};

exports.get = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_CLIENT'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('id')
            .isMongoId().withMessage(strings.WAREHOUSE_MONGO_ID),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return Promise.all([Warehouses.startSession(), Warehouses.findOne({_id: req.params.id, deleted: false })]).then(([session, data]) => {
            session.startTransaction();
            if (data) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json(data, [
                        {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                        {rel: "all-warehouses", method: "GET", href: `${req.protocol}://${req.get('host')}/api/warehouses/page/${DEFAULT_PAGE_NUMBER}/limit/${DEFAULT_PAGE_SIZE}`}]);
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
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_CLIENT'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('pageNumber')
            .isInt({min: 1}).withMessage(strings.WAREHOUSE_PAGE_NUMBER_INT),
        check('pageSize')
            .isInt({min: 1}).withMessage(strings.WAREHOUSE_PAGE_SIZE_INT),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return Promise.all([Warehouses.startSession(), Warehouses.find({deleted: false}).sort('createdAt').skip((Number(req.params.pageNumber) - 1) * Number(req.params.pageSize)).limit(Number(req.params.pageSize))]).then(([session, data]) => {
            session.startTransaction();
            if (data.length > 0 || data !== undefined) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(206).json({data}, [
                        {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                        {rel: "next-range", method: "GET", href: `${req.protocol}://${req.get('host')}/api/warehouses/page/${1 + Number(req.params.pageNumber)}/limit/${req.params.pageSize}`}]);
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
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_CLIENT'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next();
    },
    inDatabase: (req, res, next) => {
        const pagination = req.body.pagination;
        let order = req.body.orderBy;
        let search = req.body.search;
        let hateosLinks = [];

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
        Warehouses.countDocuments({deleted: false, ...search}, (err, count) => {
            hateosLinks.push({rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl});
            if (Number(pagination.pageNumber) > 1) hateosLinks.push({rel: "has-prev", method: "POST", href: `${req.protocol}://${req.get('host')}/api/warehouses/search`});
            if ((Number(pagination.pageNumber) * Number(pagination.pageSize)) < count) hateosLinks.push({rel: "has-next", method: "POST", href: `${req.protocol}://${req.get('host')}/api/warehouses/search`});
        });

        return Promise.all([Warehouses.startSession(), Warehouses.find({deleted: false, ...search}).sort(order).skip((Number(pagination.pageNumber) - 1) * Number(pagination.pageSize)).limit(Number(pagination.pageSize))]).then(([session, data]) => {
            session.startTransaction();
            if (data.length > 0 || data !== undefined) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json({data}, hateosLinks);
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

exports.join = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('columnName')
            .matches(/^_|[a-zA-Z]+$/).withMessage(strings.WAREHOUSE_COLUMN_NAME_MATCHES),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        let ids = {[`${req.params.columnName}`]: {$in: []}};
        if (req.body) {
            for (const element of req.body) {
                req.params.columnName === "_id"?ids[`${req.params.columnName}`].$in.push(database.mongoose.Types.ObjectId(element)):ids[`${req.params.columnName}`].$in.push(element)
            }
        }

        return Promise.all([Warehouses.startSession(), Warehouses.find({deleted: false, ...ids})]).then(([session, data]) => {
            session.startTransaction();
            if (data.length > 0 || data !== undefined) {
                session.commitTransaction().then(() => {
                    session.endSession();
                    return res.status(200).json(data);
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