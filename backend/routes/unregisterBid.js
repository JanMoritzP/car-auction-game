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

router.post('/unregisterBid', (req, res) => {
    User.findOne({token: req.body.token}).populate({path: 'activeBids', model: 'bid'}).exec((err, user) => {
        if(!user) return res.status(400).send({message: "Bad token"})
        Bid.findById(req.body.id).populate({path: 'bidders', model: 'user'}).exec((err, bid) => {
            if(!bid) return res.status(400).send({message: "Bid not found"})
            var found = false
            for(let i = 0; i < bid.bidders.length; i++) {
                if(bid.bidders[i]._id.equals(user._id)) found = true
            }
            if(!found) return res.status(200).send({message: "You are not registered in this auction, so you do not need to unregister"})
            else {
                for(let i = 0; i < bid.bidders.length; i++) {
                    if(bid.bidders[i]._id.equals(user._id)) bid.bidders.splice(i, 1)
                }
                for(let i = 0; i < user.activeBids.length; i++) {
                    if(user.activeBids[i]._id.equals(bid._id)) user.activeBids.splice(i, 1)
                }
                bid.save((err) => {
                    if(err) return res.status(400).send({message: "Something went wrong updating the DB"})
                    user.save((err) => {
                        if(err) return res.status(400).send({message: "Something went wrong updating the DB"})
                        return res.status(200).send({message: "You were removed to this auction"})                    
                    })
                })
            }
        })
    })
})

module.exports = router