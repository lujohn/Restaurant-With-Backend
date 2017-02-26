var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Dishes = require('../models/dishes');
var Verify = require('./verify');

var dishRouter = express.Router();
// Turn bodies into json format
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get(function(req,res,next){
    Dishes.find(req.query).populate('comments.postedBy').exec(function(err, dish) {
        if (err) next(err);
        res.json(dish); 
        // Note: the .json method will automatically write header.
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Dishes.create(req.body, function (err, dish) {
        if (err) next(err);
        // ._id field exists after dish is added to database.
        console.log("Dish Created!");
        var id = dish._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end("Added dish! It's id is: " + id );
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Dishes.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

dishRouter.route('/:dishId')
.get(function(req,res,next) {
    Dishes.findById(req.params.dishId).populate('comments.postedBy').exec(function (err, dish) {
        if (err) next(err);
        res.json(dish);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Dishes.findByIdAndUpdate(req.params.dishId, { 
        $set: req.body  // Assumes req.body in JSON format
    }, {
        new: true
    }, function (err, dish) {
        if (err) next(err);
        res.json(dish);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
        if (err) next(err); 
        res.json(resp);
    });
});

// Handle comments ...
dishRouter.route('/:dishId/comments')
.get(function (req, res, next) {
    Dishes.findById(req.params.dishId).populate('comments.postedBy').exec(function (err, dish) {
        if (err) next(err);
        res.json(dish.comments);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) next(err);

        req.body.postedBy = req.decoded._id;

        // Assume body is the comment
        dish.comments.push(req.body);
        dish.save(function (err, resp) {
            if (err) next(err);
            console.log("updated comments");
            res.json(resp);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    // Delete ALL comments
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) next(err);

        for (var i = dish.comments.length - 1; i >= 0; i--) {
            dish.comments[i].remove();
        }
        dish.save(function (err, result) {
            if (err) next(err);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments');
        });
    });
})

dishRouter.route('/:dishId/comments/:commentId')
.get(function (req, res, next) {
    Dishes.findById(req.params.dishId).populate('comments.postedBy').exec(function (err, dish) {
        if (err) next(err);
        res.json(dish.comments.id(req.params.commentId));
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) next(err);
        dish.comments.id(req.params.commentId).remove();

        req.body.postedBy = req.decoded._id;

        dish.comments.push(req.body);
        dish.save(function (err, resp) {
            if (err) next(err);
            console.log("Updated Comments!");
            res.json(resp);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) next(err);

        if (dish.comments.id(req.params.commentId).postedBy != req.decoded._doc_id) {
            var err = new Error("You are not authorized to modify this comment!");
            err.status = 403;
            return next(err);
        }

        dish.comments.id(req.params.commentId).remove();
        dish.save(function (err, resp) {  // don't have duplicate "resp"
            if (err) next(err);
            res.json(resp);
        });
    });
});

module.exports = dishRouter;

