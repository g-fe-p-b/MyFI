const logger = require('../config/logger');

const errorHanlder = (err,req, res, next) => {
    logger.error(err.message, {stack: err.stack});

    const statusCode = err.statusCode || 500;
    const message = err.isOperational? err.message : 'Ocorreu um erro inesperado no servidor';

    res.status(statusCode).json({
        error: {
            message: message
        }
    });
};

module.exports = errorHanlder;