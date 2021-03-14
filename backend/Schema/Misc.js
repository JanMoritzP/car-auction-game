const mongoose = require('mongoose')

const MiscSchema = mongoose.Schema({
    name: {type: String},
    price: Number
})


const Misc = module.exports = mongoose.model('misc', MiscSchema, 'cagDB')