var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var promos = require('../models/promotions');
var Verify = require('./verify');

var promoRouter = express.Router();
// Turn bodies into json format
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get(function(req,res,next){
    promos.find(res.query, function(err, promo) {
        if (err) next(err);
        res.json(promo);  // Return all promos
        // Note: the .json method will automatically write header.
        // And also automatically end
    });
})

.post(function(req, res, next) {
    promos.create(req.body, function (err, promo) {
        if (err) throw err;
        // ._id field exists after promo is added to database.
        console.log("promo Created!");
        var id = promo._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end("Added promo! It's id is: " + id );
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    promos.remove({}, function (err, promosRemoved) {
        if (err) throw err;
        res.json(promosRemoved);
    });
});


promoRouter.route('/:promoId')
.get(function(req,res,next) {
    promos.findById(req.params.promoId, function (err, promo) {
        if (err) throw err;
        res.json(promo);
    });
})

.put(function(req, res, next) {
    promos.findByIdAndUpdate(req.params.promoId, { 
        $set: req.body  // Assumes req.body in JSON format
    }, {
        new: true
    }, function (err, promo) {
        if (err) throw err;
        res.json(promo);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    promos.findByIdAndRemove(req.params.promoId, function (err, resp) {
        if (err) throw err; 
        res.json(resp);
    });
});


module.exports = promoRouter;

