const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
//const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/eso', { 
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
});

require('./security/passport.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/auth.js'));
app.use('/', require('./routes/registration.js'));

const apiPrefix = '/api/v1';
app.use(apiPrefix, passport.authenticate('jwt', { session: false }));
app.use(apiPrefix, require('./routes' + apiPrefix + '/settings.js'));
app.use(apiPrefix, require('./routes' + apiPrefix + '/transactions.js'));
app.use(apiPrefix, require('./routes' + apiPrefix + '/products.js'));
app.use(apiPrefix, require('./routes' + apiPrefix + '/groups.js'));
app.use(apiPrefix, require('./routes' + apiPrefix + '/aggregates.js'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
