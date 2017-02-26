
var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

var promoSchema = new mongoose.Schema( {
	name: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	label: {
		type: String,
		default: ""
	},
	price: {
		type: mongoose.Types.Currency,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	featured: {
		type: Boolean,
		default: false
	}
});

var promos = mongoose.model('promo', promoSchema);

module.exports = promos;