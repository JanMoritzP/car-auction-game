const app = require('express')()
const http = require('http').Server(app)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
})



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.options('*', cors())
const User = require('./Schema/Users')
const Bid = require('./Schema/Bids')
const { clear } = require('console')

mongoose.connect('mongodb://localhost:27017/cagDB', {useNewUrlParser:true, useUnifiedTopology:true})

app.post('/login', (req, res) => {
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
                return res.status(200).send({
                    message: "Logged in successfully",
                    token: user.createToken()
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

app.post('/signup', (req, res) => {
    let newUser = new User()

    newUser.username = req.body.username
    newUser.priority = 1
    newUser.setPassword(req.body.password)

    newUser.save((err, user) => {
        if(err) {
            return res.status(400).send({
                message: "Something went wrong :("
            })
        }
        else {
            return res.status(200).send({
                message: "New user created",
                token: user.createToken()
            })
        }
    })
})

app.post('/createBid', (req, res) => {
    let newBid = new Bid()
    newBid.priority = req.body.priority;
    newBid.maxBidders = req.body.maxBidders;
    newBid.maxWatchers = req.body.maxWatchers;
    newBid.bidPrice = 0;
    newBid.currentBidder = null;
    newBid.object = req.body.object;

    newBid.save((err, bid) => {
        if(err) {
            return res.status(400).send({
                message: "Something went wrong trying to create a new bid"
            })
        }
        else {
            return res.status(200).send({
                message: "New Bid created"
            })
        }
    })
})

app.post('/bid', (req, res) => {
    if(req.header.query.equals("registerBid")) {
        
    }



    if(req.header.query.equals("bid")) {

    }
})

let interval;

io.on("connection", (socket) => {
    if(interval) {
        clearInterval(interval)
    }
    interval = setInterval(() => serveBids(socket), 1000);
    socket.on("disconnect", () => {
        clearInterval(interval)
    })
})

const serveBids = socket => {
    Bid.find({"object.name": {$exists: true}}, (err, bids) => {
        socket.emit("getBids", bids)
    })
}


const port = 3080

http.listen(port, () => console.log("Listening on port 3080"))
