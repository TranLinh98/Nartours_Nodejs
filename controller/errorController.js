const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const message = `Duplicate field value: ${err.keyValue.name} . Please use another value`;
    return new AppError(message, 400);
}

const handleValidationError = err => {
    const error = Object.values(err.error).map(el => el.message);
    const message = `Invalid input data. ${error.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = err => {
    const message = `Invalid token. Please login again!`;
    return new AppError(message, 400);
}

const handleJWTExpriedError = err => {
    const message = `Your token has expired. Please login again!`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    //Operational send message to client
     if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

    //programing error
    } else {
        console.log('ERROR ', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
         let error = { ...err};
         if(error.kind === 'ObjectId') {
            error = handleCastErrorDB(error);
            sendErrorDev(error,res);
         }
         if(error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
            sendErrorDev(error,res);
         }
         if(error.name === 'ValidationError') {
             error = handleValidationError(error);
             sendErrorDev(error,res);
         }
         if(error.name === 'JsonWebTokenError') {
             error = handleJWTError(error);
             sendErrorDev(error,res);
         }
         if(error.name === 'TokenExpiredError') {
             error = handleJWTExpriedError(error);
             sendErrorDev(error,res);
         }
       sendErrorDev(err,res);

    } else if( process.env.NODE_ENV === 'production' ) {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
         let error = { ...err};

        if(error.kind === 'ObjectId') {
            error = handleCastErrorDB(error);
            sendErrorProd(error, res);
        }
        sendErrorProd(err, res);
    }
}