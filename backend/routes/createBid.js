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


const Car = require('./../Schema/Cars')
const Part = require('./../Schema/Parts')
const Bid = require('./../Schema/Bids')
mongoose.connect('mongodb://localhost:27017/cagDB', {useNewUrlParser:true, useUnifiedTopology:true})

router.post('/createBid', (req, res) => {
    // Create new Parts ; Remember to incorparate a default value in frontend
    let newParts = []
    let newCar = new Car() //Car has to be created here to get the connection to the parts
    
    for(let i = 0; i < req.body.parts.name.length; i++) {
        newParts[i] = new Part();
        newParts[i].name = req.body.parts.name[i]
        newParts[i].rarity = req.body.parts.rarity[i]
        newParts[i].usedIn = newCar
        newParts[i].price = req.body.parts.price[i]
    }
    
    // Create new Car
    newCar.name = req.body.car.name
    newCar.rarity = req.body.car.rarity
    newCar.price = 100;
    for(let i = 0; i < newParts.length; i++) {
        switch (newParts[i].name) {
            case 'motor':
                newCar.status.motor = newParts[i]
                break;
            case 'suspension':
                newCar.status.suspension = newParts[i]                
                break;
            case 'transmission':
                newCar.status.transmission = newParts[i]                
                break;
            case 'exhaust':
                newCar.status.exhaust = newParts[i]                
                break;
            case 'brakes':
                newCar.status.brakes = newParts[i]                
                break;
            case 'paint':
                newCar.status.paint = newParts[i]                
                break;
            case 'wheels':
                newCar.status.wheels = newParts[i]                
                break;        
            default:
                console.log("This should not have happened")
                console.log(newParts[i])
                return
        }
    }
    
    
    // Create new Bid
    let newBid = new Bid()

    newBid.priority = req.body.bid.priority;
    newBid.maxBidders = req.body.bid.maxBidders;
    newBid.maxWatchers = req.body.bid.maxWatchers;
    newBid.bidPrice = req.body.bid.price;
    newBid.currentBidder = null;
    newBid.timeLeft = req.body.bid.timeLeft;
    newBid.timeIncrement = req.body.bid.timeIncrement;
    newBid.incrementBound = req.body.bid.incrementBound;
    newBid.car = newCar;

    for(let i = 0; i < newParts.length; i++) {
        newParts[i].save((err, part) => {
            if(err) {
                return res.status(400).send({
                    message: err
                })
            }
        })
    }

    newCar.save((err, car) => {
        if(err) {
            return res.status(400).send({
                message: err
            })
        }
    })

    newBid.save((err, bid) => {
        if(err) {
            return res.status(400).send({
                message: err
            })
        }
        else {
            return res.status(200).send({
                message: "New Bid created"
            })
        }
    })
})

module.exports = router