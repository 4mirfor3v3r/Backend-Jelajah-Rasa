const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CounterSchema = new Schema({
	_id:{type:String,required:true},
	seq:{type:Number,default:0}
})

var counter = mongoose.model('counters',CounterSchema)

const foodSchema = new Schema({
	id: {
		type: Number,
		default:0,
		unique:true
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
		type: [String],
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
		type: [String],
		required: true,
	},
});
foodSchema.pre('save',function(next){
	var doc = this
	counter.findByIdAndUpdate({_id:'countId'},{$inc:{seq:1}},(err,counter)=>{
		if(counter){
		if (err) {
			return next(err)
		}else{
		doc.id = counter.seq
		next()
		}
	}
		console.log(counter)
	})
})

module.exports = Foods = mongoose.model('foods', foodSchema);
