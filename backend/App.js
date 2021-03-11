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
//app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
//app.options('*', cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept')
    res.header('Access-Control-Allow-Origin', '*')
    next();
})


const User = require('./Schema/Users')
const Bid = require('./Schema/Bids')
const Part = require('./Schema/Parts')
const Car = require('./Schema/Cars')
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
                user.createToken()
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

app.post('/signup', (req, res) => {
    
    User.findOne({username: req.body.username}, (err, user) => {
        if(user) {
            return res.status(400).send({
                message: "This username is already taken"
            })
        }
    })

    let newUser = new User()    

    newUser.username = req.body.username
    newUser.priority = 1
    newUser.setPassword(req.body.password)
    newUser.createToken()    
    newUser.save((err, user) => {
        if(err) {
            return res.status(400).send({
                message: "Something went wrong :("
            })
        }
        else {
            return res.status(200).send({
                message: "New user created",
                token: user.token
            })
        }
    })
})

app.post('/createBid', (req, res) => {
    // Create new Parts ; Remember to incorparate a default value in frontend
    let newParts = []
    
    for(let i = 0; i < req.body.parts.name.length; i++) {
        newParts[i] = new Part();
        newParts[i].name = req.body.parts.name[i]
        newParts[i].rarity = req.body.parts.rarity[i]
        newParts[i].price = req.body.parts.price[i]
    }
    
    // Create new Car
    let newCar = new Car()
    newCar.name = req.body.car.name
    newCar.rarity = req.body.car.rarity
    newCar.price = 100;
    for(let i = 0; i < newParts.length; i++) {
        switch (newParts[i].name) {
            case 'motor':
                newCar.status.motor = newParts[i]._id
                break;
            case 'suspension':
                newCar.status.suspension = newParts[i]._id                
                break;
            case 'transmission':
                newCar.status.transmission = newParts[i]._id                
                break;
            case 'exhaust':
                newCar.status.exhaust = newParts[i]._id                
                break;
            case 'breaks':
                newCar.status.breaks = newParts[i]._id                
                break;
            case 'paint':
                newCar.status.paint = newParts[i]._id                
                break;
            case 'wheels':
                newCar.status.wheels = newParts[i]._id                
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
    newBid.car = newCar._id;

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

app.post('/registerBid', (req, res) => {
    User.findOne({token: req.body.token}, (err, user) => {
        if(!user) return res.status(400).send({message: "Bad token :/"})
        Bid.findById(req.body.id, (err, bid) => {
            if(!bid) return res.status(400).send({message: "Invalid bid id"})
            if(bid.bidders.includes(req.body.token)) return res.status(200).send({message: "You are already registered for this auction"})
            if(bid.bidders.length < bid.maxBidders) {
                bid.bidders.push(req.body.token)
                user.activeBids.push(req.body.id)
                bid.save((err) => {
                    if(err) return res.status(400).send({message: "Something went wrong updating the DB"})
                    user.save((err) => {
                        if(err) return res.status(400).send({message: "Something went wrong updating the DB"})
                        return res.status(200).send({message: "You were added to this auction"})
                    })
                })
            }
            else return res.status(400).send({message: "This auction is already full :/"})
            
        })
    })
})

app.post('/unregisterBid', (req, res) => {
    User.findOne({token: req.body.token}, (err, user) => {
        if(!user) return res.status(400).send({message: "Bad token"})
        Bid.findById(req.body.id, (err, bid) => {
            if(!bid) return res.status(400).send({message: "Bid not found"})
            if(!bid.bidders.includes(req.body.token)) return res.status(200).send({message: "You are not registered in this auction, so you do not need to unregister"})
            else {
                bid.bidders.splice(bid.bidders.indexOf(req.body.token), 1)
                user.activeBids.splice(user.activeBids.indexOf(req.body.id), 1)
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

app.post('/bid', (req, res) => {
    
})

app.post('/priority', (req, res) => {
    User.findOne({token: req.body.token}, (err, user) => {
        if(err) return res.status(400).send({
            message: err
        })
        if(user !== null) {
            return res.status(200).send({
                priority: user.priority
            })
        }
        else {
            return res.status(404).send({
                message: "This token is not recognized"
            }) 
        }
    })
})

app.post('/token', (req, res) => {
    if(!User.findOne({token: req.body.token})) {
        return res.status(404).send({
            message: "This token is not recognized",
            valid: false
        })
    }
    else {
        return res.status(200).send({
            message: "This token is recognized",
            valid: true
        })
    }
})

app.post('/auctionValidation', (req, res) => {
    Bid.findById(req.body.id, (err, bid) => {
        if(!bid) return res.status(400).send({message: "Not a valid auction id"})
        if(!bid.bidders.includes(req.body.token))return res.status(400).send({message: "You are not registered for this auction"})
        else {
            return res.status(200).send({message: "You're good to go to bid"})
        }
    })
}) 

var activeUsers = []
var getAuctionUsers = []

io.on("connection", (socket) => {
    if(socket.handshake.query.info === "statusBar") {
        if(!activeUsers.includes(socket.handshake.query.token)) activeUsers.push(socket.handshake.query.token)        
    }
    else if(socket.handshake.query.info === "getAuction"){
        if(!getAuctionUsers.includes(socket.handshake.query.token)) getAuctionUsers.push(socket.handshake.query.token)        
    }

    io.on("auctionUserDisconnects", (socket) => {
        if(getAuctionUsers.includes(socket.handshake.query.token)) {
            getAuctionUsers.splice(socket.handshake.query.token, 1)
        }
        else {
            console.log("Some issue arose with socketio and token disconnection")
        }
    })

    io.on("userDisconnects", (socket) => {
        if(activeUsers.includes(socket.handshake.query.token)) {
            activeUsers.splice(socket.handshake.query.token, 1)
        }
        else {
            console.log("Some issue arose with socketio and token disconnection")
        }
    })

    const statusInterval = setInterval(() => serveStatusBar(socket), 1000)
    const serveBidsInterval = setInterval(() => serveBids(socket), 1000);
    const serverUserAuctions = setInterval(() => serveAuctionsToUser(socket), 1000)


})

const serveAuctionsToUser = async (socket) => {
    User.findOne({token: socket.handshake.query.token}, 'activeBids', (err, user) => {
        if(err) console.log(err)
        else if(!user) console.log("No users found :( or no users connected")
        else {
            if(user.activeBids.length !== 0) {
                Bid.find({_id: {$in: user.activeBids}}, 'car bidPrice', (err, bids) => {
                    if(err) console.log(err)
                    else if(bids.length === 0) console.log("No bids found, should not happen")
                    else {
                        const cars = bids.map(bid => bid.car)
                        Car.find({_id: {$in: cars}}, 'name', (err, cars) => {
                            if(err) console.log(err)
                            else if(cars.length === 0) console.log("No cars found, this should not happen")
                            else {
                                var info = []
                                for(let i = 0; i < cars.length; i++) {
                                    info.push({
                                        name: cars[i].name,
                                        price: bids[i].bidPrice
                                    })
                                }
                                socket.emit("getAuctions", info)
                            }
                        })
                    }
                })
            }
        
        }
    })
}


const serveStatusBar = async (socket) => {
    User.findOne({token: socket.handshake.query.token}, 'token money activeBids claims', (err, user) => {
        if(err) console.log(err)
        //else if(users.length === 0) console.log("No users found :( or no users connected")
        else {
            socket.emit("getStatus".concat(socket.handshake.query.token), {
                money: user.money,
                auctions: user.activeBids.length,
                claims: user.claims.length
            })
        
        }
    })
}


const serveBids = async (socket) => {
    for(let priority = 1; priority < 6; priority++) {        
        var cars = []
        var info = []
        Bid.find({"priority": priority, "bidders": {$exists: true}}, '_id car bidPrice', (err, bids) => {
            var bidIds = []
            var bidPrices = []
            for(let i = 0; i < bids.length; i++) {
                bidIds.push(bids[i]._id)
                bidPrices.push(bids[i].bidPrice)
                cars.push(getCarName(bids[i].car).then( (carName) => {return carName}))
            }
            Promise.all(cars).then(values => {
                let names = []
                for(let i = 0; i < values.length; i++) {
                    names.push(values[i].name)
                    info.push({
                        bid: bidIds[i],
                        bidPrice: bidPrices[i],
                        car: values[i].name
                    })
                }
                if(names.length === bidIds.length) {
                    socket.emit("getBids".concat(priority), info)
                }
            })
        })
    }
}

async function getCarName(id) {
    return await Car.findById(id, 'name').exec().then((data) => {return data})
    
}

const port = 3080

http.listen(port, () => console.log("Listening on port 3080"))
