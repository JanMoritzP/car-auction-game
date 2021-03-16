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

router.post('/claimAuction', (req, res) => {
    User.findOne({token: req.body.token}).populate({path: 'claims', model: 'bid'}).populate({path: 'carInventory', model: 'car'}).populate({path: 'partsInventory', model: 'part'}).exec((err, user) => {
        if(err) return res.status(400).send({message: err})
        else if(!user) return res.status(400).send({message: "Token not recognized"})
        else {
            const populationParams = {
                path: 'car',
                model: 'car',
                populate: {
                    path: 'status.motor status.suspension status.transmission status.breaks status.paint status.exhaust status.wheels',
                    model: 'part'
                }
            }
            Bid.findById(req.body.id).populate(populationParams).populate({path: 'currentBidder', model: 'user'}).exec((err, bid) => {
                if(err) return res.status(400).send({message: err})
                else if(!bid) return res.status(400).send({message: "No bid found, this should not happen"})
                else {
                    if(bid.active) return res.status(400).send({message: "You cannot claim an ongoing auction"})
                    else if(bid.currentBidder.token !== user.token) return res.status(400).send({message: "You cannot claim a bid that you have not won"})
                    else {
                        user.carInventory.push(bid.car)
                        if(bid.car.status.motor !== null) user.partsInventory.push(bid.car.status.motor)
                        if(bid.car.status.suspension !== null) user.partsInventory.push(bid.car.status.suspension)
                        if(bid.car.status.transmission !== null) user.partsInventory.push(bid.car.status.transmission)
                        if(bid.car.status.breaks !== null) user.partsInventory.push(bid.car.status.breaks)
                        if(bid.car.status.paint !== null) user.partsInventory.push(bid.car.status.paint)
                        if(bid.car.status.exhaust !== null) user.partsInventory.push(bid.car.status.exhaust)
                        if(bid.car.status.wheels !== null) user.partsInventory.push(bid.car.status.wheels)
                        for(let i = 0; i < user.claims.length; i++) {
                            if(user.claims[i]._id.equals(bid._id)) {
                                user.claims.splice(i, 1)
                            }
                        }
                        user.save((err) => {
                            if(err) return res.status(400).send({message: err})
                        })
                        return res.status(200).send({message: "Auction was claimed"})
                    
                    }
                }
            })
        }
    } )
})

module.exports = router