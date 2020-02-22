const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;  //provides several helper methods
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));   //passport.use adds specific Strategy plugin, LocalStrategy takes 
                                                                        //callback function to verify username and password against locally stored credentials
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}); //sign method takes user object that was passed in as first arg, second arg is secret key string from config.js
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //specifies how JSON web token should be extracted from incoming request message
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});    //verify incoming request is coming from verified user

exports.verifyAdmin = function(req, res, next){
    if (req.user.admin === true){
        return next();
    } else {
        const err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};