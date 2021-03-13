const mongoose = require('mongoose')
const crypto = require('crypto')


const UserSchema = mongoose.Schema({
    username: String,
    hash: String,
    salt: String, 
    token: String,
    priority: Number,
    carInventory: {type: [String], default: []},
    partsInventory: {type: [String], default: []},
    miscInventory: {type: [String], default: []},
    bidHistory: {type: [String], default: []},
    activeBids: {type: [String], default: []},
    money: {type: Number, default: 100},
    claims: {type: [String], default: []}
})

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(32)
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
}

UserSchema.methods.validatePassword = function(password) {
    tmpHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash == tmpHash
}

UserSchema.methods.createToken = function() {
    this.token = crypto.randomBytes(128).toString('hex')
    return this.token
}

UserSchema.methods.validateToken = function(incToken) {
    return this.token == incToken
}


const User = module.exports = mongoose.model('User', UserSchema, 'cagDB'); 