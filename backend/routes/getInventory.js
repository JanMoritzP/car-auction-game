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
mongoose.connect('mongodb://localhost:27017/cagDB', {useNewUrlParser:true, useUnifiedTopology:true})

router.post('/getInventory', (req, res) => {
    User.findOne({token: req.body.token}).populate({path: 'carInventory', model: 'car'}).populate({path: 'partsInventory', model: 'part'}).populate({path: 'miscInventory', model: 'misc'}).exec((err, user) => {
        if(err) return res.status(400).send({message: err})
        else if(!user) return res.status(400).send({message: "Token not recognized"})
        else {
            if(req.body.option === "cars") {
                return res.status(200).send({data: user.carInventory})
            }
            else if(req.body.option === "parts") {
                return res.status(200).send({data: user.partsInventory})
            }
            else if(req.body.option === "misc") {
                return res.status(200).send({data: user.miscInventory})
            }
            else return res.status(400).send({message: "Option not recognized"})
        }
    })
})

module.exports = router