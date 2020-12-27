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

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
          status: err.status,
          error: err,
          message: err.message,
          stack: err.stack
        });
      };
    console.error('ERROR 💥', err);
    if (err.statusCode !== 500) {
        console.log(err);
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
         });
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};

const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
      // A) Operational, trusted error: send message to client
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });
      }
      // B) Programming or other unknown error: don't leak error details
      // 1) Log error
      console.error('ERROR 💥', err);
      // 2) Send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }

    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        console.log(err);
        return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
         let error = { ...err};
        //  error.message = err.message;
        
         if(error.kind === 'ObjectId') {
            error = handleCastErrorDB(error);
            sendErrorDev(err, req, res);
         }
         if(error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
            sendErrorDev(err, req, res);
         }
         if(error.name === 'ValidationError') {
             error = handleValidationError(error);
             sendErrorDev(err, req, res);
         }
         if(error.name === 'JsonWebTokenError') {
             error = handleJWTError(error);
             sendErrorDev(err, req, res);
         }
         if(error.name === 'TokenExpiredError') {
             error = handleJWTExpriedError(error);
             sendErrorDev(err, req, res);
         }
       sendErrorDev(err, req, res);

    } else if( process.env.NODE_ENV === 'production' ) {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
         let error = { ...err};

        if(error.kind === 'ObjectId') {
            error = handleCastErrorDB(error);
            sendErrorProd(error, req, res);
        }
        sendErrorProd(err, req, res);
    }
};
