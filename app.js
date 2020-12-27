const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSannitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const route = require('./routes/route');
const globalErrorhandler = require('./controller/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//-----global middleware--------

// set security HTTP headers
app.use(helmet({contentSecurityPolicy: false}));

//development logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());

//data sanitization against NoSQL query injection
app.use(mongoSannitize());

//data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'difficulty',
        'price'
        ]
}));

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);

    next();
});

//ROUTES
route(app);

// handeler errors middleware
app.use(globalErrorhandler);

//create server
module.exports = app;