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

router.post('/token', (req, res) => {
    User.findOne({token: req.body.token}, (err, user) => {
        if(err) console.log(err) 
        else if(!user) return res.status(400).send({
            message: "This token is not recognized",
            valid: false
        })
        else {
            return res.status(200).send({
                message: "This token is recognized",
                valid: true
            })
        }
    })
})

module.exports = router