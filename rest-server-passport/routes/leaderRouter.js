var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var leaders = require('../models/leaders');
var Verify = require('./verify');

var leaderRouter = express.Router();
// Turn bodies into json format
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get(function(req,res,next){
    leaders.find(res.query, function(err, leader) {
        if (err) next(err);
        res.json(leader);  // Return all leaders
        // Note: the .json method will automatically write header.
        // And also automatically end
    });
})

.post(function(req, res, next) {
    leaders.create(req.body, function (err, leader) {
        if (err) throw err;
        // ._id field exists after leader is added to database.
        console.log("leader Created!");
        var id = leader._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end("Added leader! It's id is: " + id );
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    leaders.remove({}, function (err, leadersRemoved) {
        if (err) throw err;
        res.json(leadersRemoved);
    });
});


leaderRouter.route('/:leaderId')
.get(function(req,res,next) {
    leaders.findById(req.params.leaderId, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    leaders.findByIdAndUpdate(req.params.leaderId, { 
        $set: req.body  // Assumes req.body in JSON format
    }, {
        new: true
    }, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    leaders.findByIdAndRemove(req.params.leaderId, function (err, resp) {
        if (err) throw err; 
        res.json(resp);
    });
});


module.exports = leaderRouter;

