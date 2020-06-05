const strings = require('../../resources/strings');

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

exports.create = {
    authorize: (req, res, next) => {
        next()
    },
    checkBody: (req, res, next) => {
        next()
    },
    validate: [
    ],
    inDatabase: (req, res, next) => {
    }
};

exports.delete = {
    authorize: (req, res, next) => {
        next()
    },
    validate: [
    ],
    inDatabase: (req, res, next) => {
    }
};

exports.update = {
    authorize: (req, res, next) => {
        next()
    },
    checkBody: (req, res, next) => {
        next()
    },
    validate: [
    ],
    inDatabase: (req, res, next) => {
    }
};

exports.get = {
    authorize: (req, res, next) => {
        next()
    },
    validate: [
            next()
    ],
    inDatabase: (req, res, next) => {
    }
};

exports.getAll = {
    authorize: (req, res, next) => {
        next()
    },
    validate: [
    ],
    inDatabase: (req, res, next) => {
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
    }
};