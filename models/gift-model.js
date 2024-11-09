const { Schema, model } = require('mongoose');

const GiftSchema = new Schema ({
    link: {type: String, unique: true, require:true},
    points:{type:Number, require:true},
    name:{type:String, require:true},
})

module.exports = model('Gift', GiftSchema)