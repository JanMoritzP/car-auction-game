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

app.post('/bid', (req, res) => {
    if(req.headers.query.equals("registerBid")) {
        
    }



    if(req.headers.query.equals("bid")) {

    }
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

const serveBids = async (socket) => {
    for(let priority = 1; priority < 6; priority++) {        
        var cars = []
        var info = []
        Bid.find({"priority": priority, "bidders": {$exists: true}}, '_id car', (err, bids) => {
            var bidIds = []
            for(let i = 0; i < bids.length; i++) {
                bidIds.push(bids[i]._id)
                cars.push(getCarName(bids[i].car).then( (carName) => {return carName}))
            }
            Promise.all(cars).then(values => {
                let names = []
                for(let i = 0; i < values.length; i++) {
                    names.push(values[i].name)
                    info.push({
                        bid: bidIds[i],
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
