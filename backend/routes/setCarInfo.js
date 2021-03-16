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
const Car = require('./../Schema/Cars')

router.post('/setCarInfo', (req, res) => {
    User.findOne({token: req.body.token}, (err, user) => {
        if(err) return res.status(400).send({message: err})
        else if(!user) return res.status(400).send({message: "Token not recognized"})
        else {
            for(let i = 0; i < user.carInventory; i++) {
                if(user.carInventory._id.equals(req.body.car._id)) {
                    Car.findById(req.body.car._id, (err, car) => {
                        if(err) return res.status(400).send({message: err})
                        else if(!car) return res.status(400).send({message: "Car id not valid, should not happen"})
                        else {
                            car.status = partsToJson(req.body.parts)
                            car.save((err) => {
                                if(err) return res.status(400).send({message: err})
                            })
                        }
                    })
                }
            }
            return res.status(400).send({message: "You do not own this car"})
        }
    })
})

module.exports = router