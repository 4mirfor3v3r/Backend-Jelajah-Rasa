const express = require('express')
var bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Users = require('./model/User');

const url = 'mongodb://localhost:27017/dbJelajahRasa';

let gfs;
const app = express.Router();
const conn = mongoose.createConnection(url)

conn.once('open',()=>{
    gfs = Grid(conn.db,mongoose.mongo)
    gfs.collection('itemphotos')
    console.log("Connected to the Photos")
})

app.post('/users/register',(req,res)=>{
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        likedFoodId:[]
    };
    if(data.name && data.email && data.password){
        Users.findOne({email:data.email})
        .then(user =>{
            if(!user){
                bcrypt.hash(data.password,10,(err,hash)=>{
                    data.password = hash
                    Users.create(data)
                    .then(user => res.send(user))
                    .catch(e=>{
                        res.json({error:e})
                    })
                })
            }else{
                res.json({error:"User Already Exists"})
            }
        }).catch(e=> res.json({error:e}))
    }else{
        res.json({error:"Required field is empty"})
    }
})
app.post('/users/login',(req,res)=>{
    var email = req.body.email
    var password = req.body.password
    if(email && password){
    Users.findOne({email:req.body.email})
    .then(user =>{
        if(user){
            if(bcrypt.compareSync(password, user.password)) res.send(user)
            else res.json({error:"Password does not match"})
        }else res.json({error:"User does not found"})
    })
    }else{
        res.json({ error: 'Required field is empty' });
    }
})

module.exports = app