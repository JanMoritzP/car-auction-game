const mongoose = require('mongoose')

const CarSchema = mongoose.Schema({
    name: String,
    rarity: Number,
    price: Number,
    status: {
        motor: {type: String, default: null},
        suspension: {type: String, default: null},
        transmission: {type: String, default: null},
        breaks: {type: String, default: null},
        paint: {type: String, default: null},
        exhaust: {type: String, default: null},
        wheels: {type: String, default: null}
    }
})


const Car = module.exports = mongoose.model('car', CarSchema, 'cagDB')