const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PartSchema = mongoose.Schema({
    name: {type: String, enum: ['motor', 'suspension', 'transmission', 'brakes', 'paint', 'exhaust', 'wheels']},
    rarity: {type: Number, enum: [0, 1, 2, 3, 4, 5]},
    usedIn: {type: Schema.Types.ObjectId, ref: 'car', default: null},
    brand: {type: String, default: null},
    price: Number
})


const Part = module.exports = mongoose.model('part', PartSchema, 'cagDB')