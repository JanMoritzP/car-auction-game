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

router.post('/auctionValidation', (req, res) => {
    Bid.findById(req.body.id).exec((err, bid) => {
        if(!bid) return res.status(400).send({message: "Not a valid auction id"})
        User.findOne({token: req.body.token}, (err, user) => {
            if(bid.bidders.includes(user._id)) return res.status(200).send({message: "You're good to go to bid"})
            else return res.status(400).send({message: "You are not registered for this auction"})
        })
        
    })
}) 

module.exports = router