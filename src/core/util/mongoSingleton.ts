import mongoose from 'mongoose';
export class MongoSingleton {
    _dbUrl:string
	constructor() {
      this._dbUrl =
				'mongodb://jelajah-rasa:Z7qYFMa6NqMweiTq@kotlin-rest-api-shard-00-00.7khep.mongodb.net:27017,kotlin-rest-api-shard-00-01.7khep.mongodb.net:27017,kotlin-rest-api-shard-00-02.7khep.mongodb.net:27017/dbJelajahRasa?ssl=true&replicaSet=Kotlin-rest-api-shard-0&authSource=admin&retryWrites=true&w=majority';
    }

	connect() {
		mongoose.set('debug', true);
		mongoose
			.connect(this._dbUrl, {
				useNewUrlParser: true,
			})
			.then(() => console.log(`Connected to Database. Use ${process.env.NODE_ENV || `Default`} Environment`))
			.catch((err) => {
				console.log(`something wrong ${err}`);
			});
	}
}
