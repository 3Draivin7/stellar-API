const { Schema, model } = require('mongoose');

const UserSchema = new Schema ({
    email: {type: Number, unique: true, require:true},
    password: {type: String, require:true},
    isActivated: {type: Boolean, default:false},
    activationLink: {type: String},
    lvl:{type:Number, default:1},
    name:{type:String, require:true},
    secondName:{type:String, require:true}
})

module.exports = model('User', UserSchema)