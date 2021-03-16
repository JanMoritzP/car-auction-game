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

router.post('/login', (req, res) => {
    User.findOne({username: req.body.username}, function(err, user) {
        if(err) {
            return res.status(400).send({
                message: "Error encountered"
            })
        }
        else if(user === null) {
            return res.status(400).send({
                message: "User not found"
            })
        }
        else {
            if(user.validatePassword(req.body.password)) {
                user.createToken()
                const checkToken = () => {
                    User.findOne({token: user.token}, (err, user) => {
                        if(err) console.log(err)
                        else if(user) {
                            user.createToken()
                            checkToken()
                        }
                    })
                }
                checkToken()
                user.save((err, user) => {
                    if(err) return res.status(400).send({message: err})
                })
                return res.status(200).send({
                    message: "Logged in successfully",
                    token: user.token
                })
            }
            else {
                return res.status(400).send({
                    message: "Wrong password you dingus"
                })
            }
        }
    })
})

module.exports = router;
