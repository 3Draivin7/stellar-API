const { Schema, model } = require('mongoose');

const WorkerSchema = new Schema ({
    number: {type: Number, unique: true, require:true},
    points:{type:Number, default:0, require:true},
    name:{type:String, require:true},
    secondName:{type:String, require:true},
    history:[{ points: { type: Number, require: true },
        who: { type: String, require: true }}]
})

module.exports = model('Worker', WorkerSchema)