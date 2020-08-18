const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT= process.env.PORT || 5000;
const {MONGOURI} = require('./config/keys');
const bodyParser = require('body-parser');

mongoose.connect(MONGOURI,{
    useUnifiedTopology:true,
    useNewUrlParser: true
})

mongoose.connection.on('connected',()=>{
    console.log("Connected to DB");
})

mongoose.connection.on('error',(err)=>{
    console.log("Connection error",err);
})

require('./models/user');
require('./models/post');

app.use(bodyParser.json());
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("server started at" +PORT);
})