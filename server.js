const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyparser = require('body-parser');
const url = 'mongodb://localhost:27017/dbJelajahRasa';
const Index = require('./index')
const Sentry = require('@sentry/node')

app.use(Sentry.Handlers.requestHandler());
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
Sentry.init({ dsn: 'https://5bfa1787fdcb4c3eb06d9d9dca96583f@o422126.ingest.sentry.io/5378074' });

app.use('/api.jelajahrasa.com/v1',Index)
app.use(Sentry.Handlers.errorHandler());
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
 