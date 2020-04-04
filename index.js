const express = require('express');
var bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Users = require('./model/User');

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
		likedFoodId: [0],
	};
	if (data.name && data.email && data.password) {
		Users.findOne({ email: data.email })
			.then(usera => {
				if (!usera) {
					bcrypt.hash(data.password, 10, (err, hash) => {
						data.password = hash;
						Users.create(data)
							.then(userp => res.json({ msg: null, status: 'ok', user: userp }))
							.catch(e => {
								res.json({ msg: e, status: 'error', user: null });
							});
					});
				} else {
					res.json({ msg: 'Email Already Exists', status: 'error', user: null });
				}
			})
			.catch(e => res.json({ msg: e, status: 'error', user: null }));
	} else {
		res.json({ error: 'Required field is empty' });
	}
});
app.post('/users/login', (req, res) => {
	var email = req.body.email;
	var password = req.body.password;
	if (email && password) {
		Users.findOne({ email: req.body.email }).then(usera => {
			if (usera) {
				if (bcrypt.compareSync(password, usera.password)) res.json({ msg: null, status: 'ok', user: usera });
				else res.json({ msg: 'Email or password wrong.', status: 'error', user: null });
			} else res.json({ msg: 'Email or password wrong.', status: 'error', user: null });
		});
	} else {
		res.json({ error: 'Required field is empty' });
	}
});

module.exports = app;
