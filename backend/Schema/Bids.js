const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BidSchema = mongoose.Schema({
    priority: Number,
    bidders: {type: [Schema.Types.ObjectId], ref: 'user'},
    maxBidders: Number,
    watchers: {type: [Schema.Types.ObjectId], ref: 'user'},
    maxWatchers: Number,
    bidPrice: Number,
    smallestBid: Number,
    currentBidder: {type: Schema.Types.ObjectId, ref: 'user'},
    timeLeft: Number,
    timeIncrement: Number,
    incrementBound: Number,
    active: {type: Boolean, default: true},
    car: {type: Schema.Types.ObjectId, ref: 'car'}
})

const Bid = module.exports = mongoose.model('bid', BidSchema, 'cagDB')