const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSannitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const compression = require('compression');
const cors = require('cors');

const route = require('./routes/route');
const globalErrorhandler = require('./controller/errorController');
const bookingController = require('./controller/bookingController');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//-----global middleware--------

// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());


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

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
// app.post(
//     '/webhook-checkout',
//     bodyParser.raw({ type: 'application/json' }),
//     bookingController.webhookCheckout
//   );

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

app.use(compression());

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