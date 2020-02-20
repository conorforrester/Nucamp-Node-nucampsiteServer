const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));   //passport.use adds specific Strategy plugin, LocalStrategy takes 
                                                                        //callback function to verify username and password against locally stored credentials
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());