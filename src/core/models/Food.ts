import { model, Schema, Document } from 'mongoose';

interface ICounter {
	_id: string;
	seq: number;
}
var CountSchema = new Schema({
	_id: { type: String, required: true },
	seq: { type: Number, default: 0 },
});
const MCounter = model<ICounter & Document>('counters', CountSchema);

export interface IFood {
	id?: number;
	name: string;
	imgUrl: string;
	time: number;
	likes: number;
	ingredients: [string];
	fact: {
		calori: number;
		carbohidrat: number;
		protein: number;
		vitamin: number;
	};
	steps: [string];
}
const schema = new Schema({
	id: { type: Number, default: 0, unique: true },
	name: { type: String, required: true },
	imgUrl: { type: String, required: true },
	time: { type: Number, required: true },
	likes: { type: Number, required: true },
	ingredients: { type: [String], required: true },
	fact: {
		calori: { type: Number, default: 0 },
		carbohidrat: { type: Number, default: 0 },
		protein: { type: Number, default: 0 },
		vitamin: { type: Number, default: 0 },
	},
	steps: { type: [String], required: true },
});

schema.pre('save', function (next) {
	var doc = this;
	MCounter.findByIdAndUpdate({ _id: 'countId' }, { $inc: { seq: 1 } }, (err, counter) => {
		if (counter) {
			if (err) {
				return next(err);
			} else {
				doc.id = counter.seq;
				next();
			}
		}
		console.log(counter);
	});
});
export const MFood = model<IFood & Document>('Foods', schema);
