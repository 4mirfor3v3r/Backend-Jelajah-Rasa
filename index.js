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

// ITEM
app.post('/foods/imgUploader', upload.single('photos'), (req, res) => {
	res.send(req.file);
	return res.status(200).end();
}); // UPLOADER

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
			.then(foods => {
				if (foods) res.json({ msg: null, status: 'ok', food: foods });
				else res.json({ msg: 'Unknown Error', status: 'error', food: null });
			})
			.catch(e => res.json({ msg: e, status: 'error', food: null }));
	} else {
		res.json({ msg: 'Required Field is Empty', status: 'error', food: null });
		console.error(data)
	}
});
app.get('/foods/list',(req,res)=>{
	Foods.find({}).then(foods=>{
		if(foods) res.json({ msg: null, status: 'ok', food: foods });
		else res.json({ msg: "No One Data", status: 'error', food: null });
	}).catch(e=>res.json({ msg: e, status: 'error', food: null }))
})
app.put('/foods/listUpdate/:id',(req,res)=>{
	const data = {
		name: req.body.name,
		imgUrl: req.body.imgUrl,
		time: req.body.time,
		likes: 0,
		ingredients: req.body.ingredients,
		fact: req.body.fact,
		steps: req.body.steps,
	}
	if ((data.name, data.imgUrl, data.time, data.likes, data.ingredients, data.fact, data.steps)){
		Foods.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$set: data,
			}
		)
			.then(food => {
				if (food) res.send(food);
			})
			.catch(e => res.json({ msg: e, status: 'error', food: null }));
	}
})
app.put('/foods/listUpdateLikes/:userID',(req,res)=>{
	const data = {
		name: req.body.name,
		imgUrl: req.body.imgUrl,
		time: req.body.time,
		likes: 0,
		ingredients: req.body.ingredients,
		fact: req.body.fact,
		steps: req.body.steps,
	}
	Users.findOne({_id:req.params.userId})
	.then(user =>{
		if(user){
			if(req.body.id){
				
			}
		}
	})
})
app.delete('/foods/listelete/:id',(req,res)=>{
	Foods.deleteOne({_id:req.params.id}).then(data =>{
		if(data.ok) res.send(data)
		else{
			res.json({ msg: "Id Not Found", status: 'error', food: null })
		}
	}).catch(e=> res.json({ msg: e, status: 'error', food: null }))
})

module.exports = app;
