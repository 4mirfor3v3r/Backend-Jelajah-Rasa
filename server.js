const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyparser = require('body-parser');
const url = 'mongodb://localhost:27017/dbJelajahRasa';
const Index = require('./index')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended:false
}))
mongoose.Promise = global.Promise
mongoose
    .connect(url,{useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=>{
        console.log("DB Connected")
    })
    .catch(e =>{
        console.log(e)
    })
app.use('/api.jelajahrasa.com/v1',Index)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
