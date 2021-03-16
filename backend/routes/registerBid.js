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

router.post('/registerBid', (req, res) => {
    User.findOne({token: req.body.token}).populate({path: 'activeBids', model: 'bid'}).exec((err, user) => {
        if(!user) return res.status(400).send({message: "Bad token :/"})
        Bid.findById(req.body.id).populate({path: 'bidders', model: 'user'}).exec((err, bid) => {
            if(!bid) return res.status(400).send({message: "Invalid bid id"})
            if(bid.bidders.includes(user)) return res.status(200).send({message: "You are already registered for this auction"})
            if(bid.bidders.length < bid.maxBidders) {
                bid.bidders.push(user)
                user.activeBids.push(bid)
                bid.save((err) => {
                    if(err) return res.status(400).send({message: "Something went wrong updating the DB"})
                    user.save((err) => {
                        if(err) return res.status(400).send({message: "Something went wrong updating the DB"})
                        return res.status(200).send({message: "You were added to this auction"})
                    })
                })
            }
            else return res.status(400).send({message: "This auction is already full :/"})
            
        })
    })
})

module.exports = router