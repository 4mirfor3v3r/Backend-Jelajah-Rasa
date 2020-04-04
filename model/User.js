const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	likedFoodId: {
		type: [Number],
	},
	_likedFoodSignature:{
		type:String,
		unique:true
	}
});
userSchema.pre('save', function(next){
	this._likedFoodSignature = this.likedFoodId.join('.')
	next()
})


module.exports = Users = mongoose.model('users', userSchema);