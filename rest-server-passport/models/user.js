
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose plugin for passport
// Provides a suite of methods that passport-local requires
var passportLocalMongoose = require('passport-local-mongoose');

// Note: username and password fields are optional. Passport local
// will put them in automatically
var User = new Schema({
	username: String,
	password: String,
	firstname: {
		type: String,
		default: ''
	},
	lastname: {
		type: String,
		default: ''
	},
	admin: {
		type: Boolean,  // admins have more priveleges
		default: false
	} 
});

User.methods.getName = function() {
	return (this.firstname + ' ' + this.lastname);
};

// use the mongoose plugin
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);