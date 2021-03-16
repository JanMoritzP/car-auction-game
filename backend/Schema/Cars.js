const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CarSchema = mongoose.Schema({
    name: String,
    rarity: Number,
    price: Number,
    brand: {type: String, default: null},
    status: {
        motor: {type: Schema.Types.ObjectId, ref: 'part', default: null},
        suspension: {type: Schema.Types.ObjectId, ref: 'part', default: null},
        transmission: {type: Schema.Types.ObjectId, ref: 'part', default: null},
        brakes: {type: Schema.Types.ObjectId, ref: 'part', default: null},
        paint: {type: Schema.Types.ObjectId, ref: 'part', default: null},
        exhaust: {type: Schema.Types.ObjectId, ref: 'part', default: null},
        wheels: {type: Schema.Types.ObjectId, ref: 'part', default: null}
    }
})


const Car = module.exports = mongoose.model('car', CarSchema, 'cagDB')