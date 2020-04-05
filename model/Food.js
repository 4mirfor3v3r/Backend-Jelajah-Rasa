const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
	id: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	imgUrl: {
		type: String,
		required: true,
	},
	time: {
		type: Number,
		required: true,
	},
	likes: {
		type: Number,
		required: true,
	},
	ingredients: {
		type: [Object],
		required: true,
	},
	fact: {
		calori: {
			type: Number,
			default:0,
		},
		carbohidrat: {
            type:Number,
            default:0
        },
        protein:{
            type:Number,
            default:0
        },
        vitamin:{
            type:Number,
            default:0
        }
	},
	steps: {
		type: [Object],
		required: true,
	},
});

module.exports = Foods = mongoose.model('foods', foodSchema);
