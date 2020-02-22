const express = require('express');
const bodyParser = require('body-parser');
const Partner = require('../models/partner');
const authenticate = require('../authenticate');

const partnerRouter = express.Router();

partnerRouter.use(bodyParser.json());

partnerRouter.route('/')
.get((req, res, next) => {
    Partner.find() //queries database for all docs that were instantiated using the Partner model
    .then(partners => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);    //send json data to the client to the response stream, also automatically closes the stream afterwards, so no need for a res.end() method
    })
    .catch(err => next(err));
})
.post(authenticate.verifyAdmin, (req, res, next) => {
    Partner.create(req.body)   //create new Partner doc and save to server
    .then(partner => {
        console.log('Partner Created ', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete(authenticate.verifyAdmin, (req, res, next) => {
    Partner.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

partnerRouter.route('/:partnerId')
.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})
.put(authenticate.verifyAdmin, (req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body
    }, { new: true })
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyAdmin, (req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = partnerRouter;