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

router.post('/getCarInfo').populate({path: 'carInventory', model: 'car'}).exec((req, res) => {
    User.findOne({token: req.body.token}, (err, user) => {
        if(err) return res.status(400).send({message: err})
        else if(!user) return res.status(400).send({message: "Token not recognized"})
        else {
            for(let i = 0; i < user.carInventory.length; i++) {
                if(user.carInventory[i]._id.equals(req.body.id)) {
                    return res.status(200).send({
                        car: user.carInventory[i],
                        parts: partsToArray(user.carInventory[i].status)
                    })
                }
            }
            return res.status(400).send({message: "Car with this _id not found, should not happen"})
        }
    })
})

function partsToArray(status) {
    return [status.motor, status.suspension, status.transmission, status.breaks, status.paint, status.exhaust, status.wheels]
}

module.exports = router