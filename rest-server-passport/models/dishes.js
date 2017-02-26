
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Add Currency type to Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, 
{
	timestamps: true
});

var dishSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	image: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true
	},
	label: {
		type: String,
		default: "",
	},
	price: {
		type: Currency,  // or mongoose.Types.Currency
		required: true
	},
	description: {
		type: String,
		required: true
	},
	featured: {
		type: Boolean,
		default: false
	},
	comments: [commentSchema]
},
{
	timestamps: true
});


// Create a model that uses the Schema
var Dishes = mongoose.model("Dish", dishSchema);

// Make this node module available to Node applications
module.exports = Dishes;