const express = require('express');
var bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const Foods = require('./model/Food');
const Users = require('./model/User');
const upload = require('./imageUploader/imageUploader');

const url = 'mongodb://localhost:27017/dbJelajahRasa';

let gfs;
const app = express.Router();
const conn = mongoose.createConnection(url);

conn.once('open', () => {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('itemphotos');
	console.log('Connected to the Photos');
});

app.post('/users/register', (req, res) => {
	const data = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		likedFoodId: [],
	};
	if (data.name && data.email && data.password) {
		Users.findOne({ email: data.email })
			.then((usera) => {
				if (!usera) {
					bcrypt.hash(data.password, 10, (err, hash) => {
						data.password = hash;
						Users.create(data)
							.then((userp) => res.json({ msg: null, status: 'ok', response: userp }))
							.catch((e) => {
								res.json({ msg: e, status: 'error', response: null });
							});
					});
				} else {
					res.json({ msg: 'Email Already Exists', status: 'error', response: null });
				}
			})
			.catch((e) => res.json({ msg: e, status: 'error', response: null }));
	} else {
		res.json({ error: 'Required field is empty' });
	}
}); // DONE, ANDROID
app.post('/users/login', (req, res) => {
	var email = req.body.email;
	var password = req.body.password;
	if (email && password) {
		Users.findOne({ email: req.body.email }).then((usera) => {
			if (usera) {
				if (bcrypt.compareSync(password, usera.password)) res.json({ msg: null, status: 'ok', response: usera });
				else res.json({ msg: 'Email or password wrong.', status: 'error', response: null });
			} else res.json({ msg: 'Email or password wrong.', status: 'error', response: null });
		});
	} else {
		res.json({ error: 'Required field is empty' });
	}
}); // DONE, ANDROID

// ITEM
app.post('/foods/imgUploader', upload.single('photos'), (req, res) => {
	res.send(req.file);
	return res.status(200).end();
}); // UPLOADER, ANDROID

app.post('/foods/addList', (req, res) => {
	const data = {
		id: null,
		name: req.body.name,
		imgUrl: req.body.imgUrl,
		time: req.body.time,
		likes: 0,
		ingredients: req.body.ingredients,
		fact: req.body.fact,
		steps: req.body.steps,
	};
	if ((data.name, data.imgUrl, data.time, data.likes, data.ingredients, data.fact, data.steps)) {
		Foods.create(data)
			.then((foods) => {
				if (foods) res.json({ msg: null, status: 'ok', response: foods });
				else res.json({ msg: 'Unknown Error', status: 'error', response: null });
			})
			.catch((e) => res.json({ msg: e, status: 'error', response: null }));
	} else {
		res.json({ msg: 'Required Field is Empty', status: 'error', response: null });
		console.error(data);
	}
}); // DONE
// app.get('/foods/list/', (req, res) => {
// 	Foods.find({})
// 		.then((food) => {
// 			if (food) res.json({ msg: null, status: 'ok', response: food });
// 			else res.json({ msg: 'No One Data', status: 'error', response: null });
// 		})
// 		.catch((e) => res.json({ msg: e, status: 'error', response: null }));
// }); // DONE, ANDROID
app.get('/foods/list/', async (req, res) => {
	// setup default value of page and pageSize
	const { page = 1, pageSize = 10 } = req.query;
	try {
		// get total documents in the Posts collection
		const count = await Foods.countDocuments();
		if (Math.ceil(count / pageSize) < page) {
			res.json({ msg: 'Maximum page is ' + Math.ceil(count / pageSize), status: 'max', response: null });
		} else {
			// execute query with page and pageSize values
			Foods.find()
				.limit(pageSize * 1)
				.skip((page - 1) * pageSize)
				.exec()
				.then((foods) => {
					if (foods)
						res.json({
							msg: null,
							status: 'ok',
							response: {
								totalPages: Math.ceil(count / pageSize),
								currentPage: page,
								foods,
							},
						});
					else res.json({ msg: 'No One Data', status: 'error', response: null });
				})
				.catch((e) => {
					res.json({ msg: e, status: 'error', response: null });
					console.error(e.message);
				});
		}
	} catch (err) {
		console.error(err.message);
	}
}); // PAGINATION FOODS DONE

app.put('/foods/listUpdate/:id', (req, res) => {
	const data = {
		name: req.body.name,
		imgUrl: req.body.imgUrl,
		time: req.body.time,
		likes: 0,
		ingredients: req.body.ingredients,
		fact: req.body.fact,
		steps: req.body.steps,
	};
	if ((data.name, data.imgUrl, data.time, data.likes, data.ingredients, data.fact, data.steps)) {
		Foods.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$set: data,
			}
		)
			.then((food) => {
				if (food)
					res.json({
						msg: null,
						status: 'ok',
						response: {
							fact: data.fact,
							id: food.id,
							ingredients: data.ingredients,
							steps: data.steps,
							_id: food._id,
							name: data.name,
							imgUrl: data.imgUrl,
							time: data.time,
							likes: data.likes,
							__v: food.__v,
						},
					});
			})
			.catch((e) => res.json({ msg: e, status: 'error', response: null }));
	}
}); // DONE

app.put('/foods/listAddLikes/:userID', (req, res) => {
	const data = {
		id: req.body.id,
	};
	Users.findOne({ _id: req.params.userID }).then((user) => {
		if (user) {
			if (data.id) {
				Foods.findOneAndUpdate({ id: data.id }, { $inc: { likes: 1 } })
					.then((foods) => {
						if (foods) {
							Users.findOneAndUpdate({ _id: user._id }, { $push: { likedFoodId: foods.id } })
								.then((doc) => {
									if (doc) res.json({ msg: null, status: 'ok', response: foods });
									else res.json({ msg: 'Failed to update', status: 'error', response: null });
								})
								.catch((e) => res.json({ msg: e, status: 'error', response: null }));
						} else res.json({ msg: 'Unknown Error', status: 'error', response: null });
					})
					.catch((e) => res.json({ msg: e, status: 'error', response: null }));
			} else {
				res.json({ msg: 'Food Not Found', status: 'error', response: null });
			}
		} else res.json({ msg: 'Register First', status: 'reg', response: null });
	});
}); // DONE

app.put('/foods/listRemoveLikes/:userID', (req, res) => {
	const data = {
		id: req.body.id,
	};
	Users.findOne({ _id: req.params.userID }).then((user) => {
		if (user) {
			if (data.id) {
				Foods.findOneAndUpdate({ id: data.id, likes: { $gt: 0 } }, { $inc: { likes: -1 } })
					.then((foods) => {
						if (foods) {
							Users.findOneAndUpdate({ _id: user._id }, { $pullAll: { likedFoodId: [foods.id] } })
								.then((doc) => {
									if (doc) res.json({ msg: null, status: 'ok', response: foods });
									else res.json({ msg: 'Failed To Update', status: 'error', response: null });
								})
								.catch((e) => res.json({ msg: e, status: 'error', response: null }));
						} else {
							console.log(data.id);
							res.json({ msg: 'Likes Is ZERO', status: 'error', response: null });
						}
					})
					.catch((e) => res.json({ msg: e, status: 'error', response: null }));
			} else {
				res.json({ msg: 'Food Not Found', status: 'error', response: null });
			}
		} else {
			res.json({ msg: 'Register First', status: 'reg', response: null });
		}
	});
}); // DONE

app.delete('/foods/listDelete/:id', (req, res) => {
	Foods.deleteOne({ _id: req.params.id })
		.then((data) => {
			if (data.ok) res.send(data);
			else {
				res.json({ msg: 'Id Not Found', status: 'error', response: null });
			}
		})
		.catch((e) => res.json({ msg: e, status: 'error', response: null }));
});

module.exports = app;
