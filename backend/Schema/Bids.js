const mongoose = require('mongoose')

const BidSchema = mongoose.Schema({
    priority: Number,
    bidders: [String],
    maxBidders: Number,
    watchers: [String],
    maxWatchers: Number,
    bidPrice: Number,
    currentBidder: String,
    timeLeft: Number,
    runningTimeIncrement: Number,
    incrementBound: Number,
    car: String
})

BidSchema.methods.bid = function(price, bidder) {
    if(price > this.bidPrice && this.bidders.indexOf(bidder) != -1) {
        this.bidPrice = price;
        this.currentBidder = bidder;
    }
    else {
        return "You cannot bid on this as you are either not an allowed bidder or you tried to bid less or equal to the current price"
    }
}

BidSchema.methods.getCurrentPrice = function() {
    return this.bidPrice;
}

BidSchema.methods.getCurrentBidder = function() {
    return this.currentBidder;
}

BidSchema.methods.addBidder = function(bidder) {
    if(this.bidders.length + 1 <= this.maxBidders) {
        this.bidders.push(bidder)
    }
    else {
        return console.log("No more bidders allowed")
    }
}

BidSchema.methods.addWatcher = function(watcher) {
    if(this.watchers.length + 1 <= this.maxWatchers) {
        this.watchers.push(watcher)
    }
    else {
        return console.log("No more watchers allowed")
    }
}


BidSchema.methods.getBidders = function() {
    return this.bidders;
}

BidSchema.methods.getWatchers = function() {
    return this.watchers;
}

BidSchema.methods.getPriority = function() {
    return this.priority;
}

BidSchema.methods.getObject = function() {
    return this.object;
}


const Bid = module.exports = mongoose.model('bid', BidSchema, 'cagDB')