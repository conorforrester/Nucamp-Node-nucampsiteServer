const express = require('express');
const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {  //POST route allows new user to register on website
    User.findOne({username: req.body.username}) //check if username already exists
    .then(user => { //use a promise to deal with the response
        if (user) { //username exists already
            const err = new Error(`User ${req.body.username} already exists!`);
            err.status = 403;
            return next(err);
        } else {  //user variable is null, undefined or something other than user document, and user is allowed to create the username
            User.create({
                username: req.body.username,
                password: req.body.password})
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
});

router.post('/login', (req, res, next) => {
    if(!req.session.user) { //user is not logged in
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
      
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];
      
        User.findOne({username: username})  //check if username exists so we can match it in the document
        .then(user => {
            if (!user) {
                const err = new Error(`User ${username} does not exist!`);
                err.status = 403;
                return next(err);
            } else if (user.password !== password) {  //password does not match what is in the document
                const err = new Error('Your password is incorrect!');
                err.status = 403;
                return next(err);
            } else if (user.username === username && user.password === password) {  //confirm both username and password match
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }
        })
        .catch(err => next(err));
    } else {  //user is already logged in
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
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