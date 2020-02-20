const express = require('express');
const User = require('../models/user');
const passport = require('passport');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
    User.register(
        new User({username: req.body.username}),    //create user from name that is provided by the client
        req.body.password,  //password passed from client
        err => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            }
        }
    );
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
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