const mongoose = require('mongoose')

const CarSchema = mongoose.Schema({
    name: String,
    rarity: Number,
    price: Number,
    status: {
        motor: String,
        suspension: String,
        transmission: String,
        breaks: String,
        paint: String,
        exhaust: String,
        wheels: String
    }
})


const Car = module.exports = mongoose.model('car', CarSchema, 'cagDB')