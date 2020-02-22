const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.user.admin) {
        return User.find();
    } else {
        const err = new Error('You are not an admin!');
        err.status = 403;
        return next(err);
    }
});

router.post('/signup', (req, res) => {
    User.register(new User({username: req.body.username}),  //create user from name provided by client
    req.body.password, (err, user) => { //password passed in from client
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        } else {
            if (req.body.firstname) {
                user.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                user.lastname = req.body.lastname;
            }
            user.save(err => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                }
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            });
        }
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});   //getToken contains payload object
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
    if (req.session) {  //is user is logged in, then kill the session
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    } else {  //if user is not logged in, reply with...
      const err = new Error('You are not logged in!');
      err.status = 403;
      return next(err);
    }
});

module.exports = router;