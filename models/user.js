const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:'https://static-media-prod-cdn.itsre-sumo.mozilla.net/static/sumo/img/default-FFA-avatar.png'
    }
})

mongoose.model("User",UserSchema)