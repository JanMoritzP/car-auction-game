const mongoose = require('mongoose')

const PartSchema = mongoose.Schema({
    name: {type: String, enum: ['motor', 'suspension', 'transmission', 'breaks', 'paint', 'exhaust', 'wheels']},
    rarity: {type: Number, enum: [range(1,5)]},
    price: Number
})


const Part = module.exports = mongoose.model('part', PartSchema, 'cagDB')