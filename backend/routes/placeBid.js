const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept')
    res.header('Access-Control-Allow-Origin', '*')
    next();
})

const User = require('./../Schema/Users')
const Bid = require('./../Schema/Bids')
mongoose.connect('mongodb://localhost:27017/cagDB', {useNewUrlParser:true, useUnifiedTopology:true})

router.post('/placeBid', (req, res) => {
    Bid.findById(req.body.roomId).populate({path: 'bidders', model: 'user'}).exec((err, bid) => {
        if(err) console.log(err)
        else if(!bid) console.log("No bid found, this should not happen")
        else {
            if(bid.bidPrice >= req.body.amount) return res.status(400).send({message: "Someone already bid a higher or the same price as you"})
            else if(bid.bidPrice + bid.smallestBid > req.body.amount) return res.status(400).send({message: "You have to at least bid the smallest increment"})
            else {
                User.findOne({token: req.body.token}, (err, user) => {
                    if(err) return res.status(400).send({message: err})
                    else if(!user) return res.status(400).send({message: "No user found, this should not happen"})
                    else {
                        for(let i = 0; i < bid.bidders.length; i++) {
                            if(bid.bidders[i].token === req.body.token) {
                                bid.bidPrice = req.body.amount
                                bid.currentBidder = user
                                if(bid.timeLeft < bid.incrementBound) bid.timeLeft += bid.timeIncrement
                                bid.save((err, bid) => {
                                    if(err) console.log(err)
                                    else {
                                        return res.status(200).send({message: "You are now the highest Bidder"})
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
    })
})

module.exports = router