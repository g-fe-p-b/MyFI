const winston = require('winston');
const transports = winston;

if (process.env.NODE_ENV!=='production'){
    transports.push(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
} else {
    transports.push(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }));
    transports.push(new winston.transports.File({filename: 'error.log', level: 'error'}));
    transports.push(new winston.transports.File({filename: 'combined.log'}));
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format:winston.format.combine (
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports
});

module.exports = logger;