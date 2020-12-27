const tourRouter = require('./tourRoutes');
const userRouter = require('./userRoutes');
const reviewRouter = require('./reviewRoutes');
const viewRouter = require('./viewRoutes');
const bookingRouter = require('./bookingRoutes');

const AppError = require('../utils/appError');

function route(app) {
    
    app.use('/', viewRouter);

    app.use('/api/v1/tours', tourRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/reviews', reviewRouter);
    app.use('/api/v1/bookings', bookingRouter);

    app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });
}

module.exports = route;