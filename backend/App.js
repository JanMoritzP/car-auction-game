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
const Misc = require('./Schema/Misc')
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
            case 'breaks':
                newCar.status.breaks = newParts[i]                
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

app.post('/registerBid', (req, res) => {
    User.findOne({token: req.body.token}).populate({path: 'activeBids', model: 'bid'}).exec((err, user) => {
        if(!user) return res.status(400).send({message: "Bad token :/"})
        Bid.findById(req.body.id).populate({path: 'bidders', model: 'user'}).exec((err, bid) => {
            if(!bid) return res.status(400).send({message: "Invalid bid id"})
            if(bid.bidders.includes(user)) return res.status(200).send({message: "You are already registered for this auction"})
            if(bid.bidders.length < bid.maxBidders) {
                bid.bidders.push(user)
                user.activeBids.push(bid)
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
    User.findOne({token: req.body.token}).populate({path: 'activeBids', model: 'bid'}).exec((err, user) => {
        if(!user) return res.status(400).send({message: "Bad token"})
        Bid.findById(req.body.id).populate({path: 'bidders', model: 'user'}).exec((err, bid) => {
            if(!bid) return res.status(400).send({message: "Bid not found"})
            if(!bid.bidders.includes(user)) return res.status(200).send({message: "You are not registered in this auction, so you do not need to unregister"})
            else {
                for(let i = 0; i < bid.bidders.length; i++) {
                    if(bid.bidders[i].token === user.token) bid.bidders.splice(i, 1)
                }
                for(let i = 0; i < user.activeBids.length; i++) {
                    if(user.activeBids._id.equals(bid._id)) user.activeBids.splice(i, 1)
                }
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

app.post('/placeBid', (req, res) => {
    Bid.findById(req.body.roomId).populate({path: 'bidders', model: 'user'}).exec((err, bid) => {
        if(err) console.log(err)
        else if(!bid) console.log("No bid found, this should not happen")
        else {
            if(bid.bidPrice >= req.body.amount) return res.status(400).send({message: "Someone already bid a higher or the same price as you"})
            else {
                User.findOne({token: req.body.token}, (err, user) => {
                    if(err) return res.status(400).send({message: err})
                    else if(!user) return res.status(400).send({message: "No user found, this should not happen"})
                    else {
                        for(let i = 0; i < bid.bidders.length; i++) {
                            if(bid.bidders[i].token === req.body.token) {
                                bid.bidPrice = req.body.amount
                                bid.currentBidder = user
                                if(bid.timeLeft < bid.incrementBound) bid.timeLeft += bid.timeIncrement
                                bid.save((err, bid) => {
                                    if(err) console.log(err)
                                    else {
                                        return res.status(200).send({message: "You are now the highest Bidder"})
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
    })
})

app.post('/claimAuction', (req, res) => {
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

app.post('/getInventory', (req, res) => {
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
    Bid.findById(req.body.id).exec((err, bid) => {
        if(!bid) return res.status(400).send({message: "Not a valid auction id"})
        User.findOne({token: req.body.token}, (err, user) => {
            if(bid.bidders.includes(user._id)) return res.status(200).send({message: "You're good to go to bid"})
            else return res.status(400).send({message: "You are not registered for this auction"})
        })
        
    })
}) 

var statusInterval
var serveBidsInterval
var serveUserAuctions
var serveUserClaims

var auctionIntervals = []
var auctionIds = []

io.on("connection", (socket) => {

    //STATUS RELATED SUBS
    socket.on("subToStatus", (socket) => {
        statusInterval = setInterval(() => serveStatusBar(socket), 1000)
    })
    socket.on("subToBids", (socket) => {
        serveBidsInterval = setInterval(() => serveBids(socket), 1000);
    })
    socket.on("subToUserAuctions", (socket) => {
        serveUserAuctions = setInterval(() => serveAuctionsToUser(socket), 1000)
    })
    socket.on("subToUserClaims", (socket) => {
        serveUserClaims = setInterval(() => serveClaimsToUser(socket), 1000)
    })

    //STATUS RELATED UNSUBS
    socket.on("unsubFromStatus", () => {
        clearInterval(statusInterval)
    })
    socket.on("unsubFromBids", () => {
        clearInterval(serveBidsInterval)
    })
    socket.on("unsubFromUserAuctions", () => {
        clearInterval(serveUserAuctions)
    })
    socket.on("unsubFromUserClaims", () => {
        clearInterval(serveUserClaims)
    })

    
    socket.on("joinAuctionRoom", (data) => {
        socket.join(data.id)
        auctionIntervals.push(setInterval(() => getAuctionData(data.id), 1000))
        auctionIds.push(data.id)
        Bid.findById(data.id, (err, bid) => {
            if(err) console.log(err)
            else {
                io.emit(data.token, bid.bidders.indexOf(data.token))
            }
        })
    })


    socket.on("leaveAuctionRoom", (roomId) => {
        socket.leave(roomId)
        clearInterval(auctionIntervals[auctionIds.indexOf(roomId)])
        auctionIntervals.splice(auctionIds.indexOf(roomId), 1)
        auctionIds.splice(auctionIds.indexOf(roomId), 1)
    })

})

const getAuctionData = async (roomId) => {
    Bid.findById(roomId, (err, bid) => {
        if(err) console.log(err)
        else if(!bid) console.log("No bid found, this should not happen")
        else {
            Car.findById(bid.car, 'name', (err, car) => {
                if(err) console.log(err)
                else if(!car) console.log("No car found, this should not happen")
                else {
                    io.to(roomId).emit("auctionRoom".concat(roomId), {
                        price: bid.bidPrice,
                        timeLeft: bid.timeLeft,
                        currentBidder: bid.bidders.indexOf(bid.currentBidder) + 1,
                        active: bid.active,
                        car: car.name
                    })
                }
            })
        }
    })
}

const serveClaimsToUser = async (socket) => {
    User.findOne({token: socket.query.token}, 'claims', (err, user) => {
        if(err) console.log(err)
        else if(!user) console.log("No user found, this should not happen")
        else {
            if(user.claims.length !== 0) {
                Bid.find({_id: {$in: user.claims}}, 'bidPrice car', (err, bids) => {
                    if(err) console.log(err)
                    else if(!bids) console.log("No bids found, this should not happen")
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
                                        price: bids[i].bidPrice,
                                        id: bids[i]._id
                                    })
                                }
                                io.emit("getClaims".concat(socket.query.token), info)
                            }
                        })
                    }
                })
            }
        }
    })
}

const serveAuctionsToUser = async (socket) => {
    User.findOne({token: socket.query.token}, 'activeBids', (err, user) => {
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
                                        price: bids[i].bidPrice,
                                        id: bids[i]._id
                                    })
                                }
                                io.emit("getAuctions".concat(socket.query.token), info)
                            }
                        })
                    }
                })
            }
        
        }
    })
}


const serveStatusBar = async (socket) => {
    User.findOne({token: socket.query.token}, 'token money activeBids claims', (err, user) => {
        if(err) console.log(err)
        else if(user) {
            io.emit("getStatus".concat(socket.query.token), {
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
        Bid.find({"priority": priority, "active": true}, '_id car bidPrice', (err, bids) => {
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
                    io.emit("getBids".concat(priority), info)
                }
            })
        })
    }
}

async function getCarName(id) {
    return await Car.findById(id, 'name').exec().then((data) => {return data})
}

const mainAuctionInterval = setInterval(() => {
    Bid.find({active: true}).populate({path: 'bidders', model: 'user', populate: {path: 'activeBids', model: 'bid'}}).populate({path: 'bidders.activeBids', model: 'bid'}).populate({path: 'currentBidder', model: 'user'}).exec((err, bids) => {
        if(err) console.log("error")
        else {
            for(let i = 0; i < bids.length; i++) {
                if(bids[i].timeLeft > 0) {
                    bids[i].timeLeft--
                    bids[i].save((err) => {
                        if(err) console.log(err)
                    })
                }
                else {
                    bids[i].active = false;
                    bids[i].save((err) => {
                        if(err) console.log(err)
                    })
                    for(let k = 0; k < bids[i].bidders.length; k++) {
                        for(let j = 0; j < bids[i].bidders[k].activeBids.length; j++) {
                            if(bids[i].bidders[k].activeBids[j]._id.equals(bids[i]._id)) bids[i].bidders[k].activeBids.splice(j, 1)
                        }
                        bids[i].bidders[k].bidHistory.push(bids[i])
                        if(bids[i].bidders[k].token === bids[i].currentBidder.token) bids[i].bidders[k].claims.push(bids[i])
                        bids[i].bidders[k].save((err) => {
                            if(err) console.log(err)
                        })
                    }
                    
                }
            }
        }
    })
}, 1000)

const port = 3080

http.listen(port, () => console.log("Listening on port 3080"))
