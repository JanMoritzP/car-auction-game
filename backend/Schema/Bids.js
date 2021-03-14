const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BidSchema = mongoose.Schema({
    priority: Number,
    bidders: {type: [Schema.Types.ObjectId], ref: 'user'},
    maxBidders: Number,
    watchers: {type: [Schema.Types.ObjectId], ref: 'user'},
    maxWatchers: Number,
    bidPrice: Number,
    currentBidder: {type: Schema.Types.ObjectId, ref: 'user'},
    timeLeft: Number,
    timeIncrement: Number,
    incrementBound: Number,
    active: {type: Boolean, default: true},
    car: {type: Schema.Types.ObjectId, ref: 'car'}
})

BidSchema.methods.bid = function(price, bidder) {
    if(price > this.bidPrice && this.bidders.indexOf(bidder) != -1) {
        this.bidPrice = price;
        this.currentBidder = bidder;
        if(this.timeLeft < this.incrementBound) this.timeLeft += this.timeIncrement
    }
    else {
        return "You cannot bid on this as you are either not an allowed bidder or you tried to bid less or equal to the current price"
    }
}


const Bid = module.exports = mongoose.model('bid', BidSchema, 'cagDB')