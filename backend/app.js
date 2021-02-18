const express = require('express')
const app = express()

app.use(express.static(__dirname))

const bodyParser = require('body-parser')
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSession)

const passport = require('passport')
app.use(passport.initialize())
app.use(passport.session())

const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

mongoose.connect('mongodb://localhost/users',
    {useNewUrlParser: true, useUnifiedTopology: true}
)

const Schema = mongoose.Schema
const UserDetail = new Schema({
    username: String,
    password: String
})

UserDetail.plugin(passportLocalMongoose)
const UserDetails = mongoose.model('users', UserDetail, 'users')

passport.use(UserDetails.createStrategy())
passport.serializeUser(UserDetails.serializeUser())
passport.deserializeUser(UserDetails.deserializeUser())

const connectEnsureLogin = require('connect-ensure-login')

app.post('/login', (req, res, next) => {
    passport.authenticate('local', 
    (err, user, info) => {
        if(err) return next(err)
        if(!user) return res.redirect('login?info=' + info)
        req.logIn(user, function(err) {
            if(err) return next(err)
    
            return res.redirect('/')
        })
    })(req, res, next)

})

app.get('/login', (req, res) => {
    res.sendFile('/home/jan/prog/node-app/frontend/login.html')
})

app.get('/', (req, res) => {
    res.sendFile('/home/jan/prog/node-app/frontend/index.html')
})


app.get('/private',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('/home/jan/prog/node-app/frontend/private.html')
);

app.get('/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send({user: req.user})
);

const port = 3000
app.listen(port, () => console.log("Listening on port 3000"))


UserDetails.register({username:'test', password:'test', active: false}, 'test')