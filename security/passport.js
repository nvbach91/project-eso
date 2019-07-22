const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const passportLocal = require('passport-local');
const Users = require('../models/Users');
const config = require('../config');
const bcrypt = require('bcryptjs');

const localStrategyOptions = {
  usernameField: 'username',
  passwordField: 'password',
  session: false,
};

const localStrategy = new passportLocal.Strategy(localStrategyOptions, (username, password, cb) => {
  return Users.findOne({ username }).select('_id password').then((user) => {
    if (!user) {
      return cb(null, false, { msg: 'srv_user_not_found' });
    }
    return bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return cb(null, false, { msg: 'srv_incorrect_password' });
      }
      const { _id } = user;
      return cb(null, { _id, username });
    });
  }).catch(err => {
    console.error(err);
    return cb(err);
  });
});

const jwtStrategyOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
  passReqToCallback: true,
};

const jwtStrategy = new passportJWT.Strategy(jwtStrategyOptions, (req, jwtPayload, cb) => {
  return Users.findOne({ _id: jwtPayload._id }).select('username token regId companyId').then((user) => {
    if (!user) {
      return cb(null, false);
    }
    // const jwtAuthorizationToken = req.headers.authorization;
    // if (jwtAuthorizationToken !== 'Bearer ' + user.token) {
    //   return cb(null, false);
    // }
    
    // this user object is attached to every request in every route
    return cb(null, user);
  }).catch(err => {
    return cb(err, false);
  });
});

passport.use(localStrategy);
passport.use(jwtStrategy);
