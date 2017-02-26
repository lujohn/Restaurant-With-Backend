
// Enable user to register, log in/out
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

// Support user registration. Endpoint is /Users/register
router.post('/register', function(req, res) {
	var newUser = new User({ username: req.body.username });
	var pass = req.body.password;
	User.register(newUser, pass, function (err, user) {
		if (err) {
			console.log("There was an error registering user!");
			return res.status(500).json({err: err});
		}

    if (req.body.firstname) {
      user.firstname = req.body.firstname;
    }

    if (req.body.lastname) {
      user.lastname = req.body.lastname;
    }

		// Authenticate the user
		passport.authenticate('local')(req, res, function() {
			return res.status(200).json({status: 'Registration Sucessful!'});
		});
	});
});

// User login
// Remember: Must have configured strategy already. In this case
// LocalStrategy
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      
      // See the verify.js file  
        var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
        res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);  // arguments
});

// User Logout
router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});


router.route('/')
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  // Request is valid. Return all user information
  User.find({}, function (err, users) {
    if (err) throw err;
    res.json(users);
  });
});

module.exports = router;
