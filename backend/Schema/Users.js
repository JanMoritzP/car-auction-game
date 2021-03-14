const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const UserSchema = mongoose.Schema({
    username: String,
    hash: String,
    salt: String, 
    token: String,
    priority: Number,
    carInventory: {type: [Schema.Types.ObjectId], ref: 'car', default: []},
    partsInventory: {type: [Schema.Types.ObjectId], ref: 'part', default: []},
    miscInventory: {type: [Schema.Types.ObjectId], ref: 'misc', default: []},
    bidHistory: {type: [Schema.Types.ObjectId], ref: 'bid', default: []},
    activeBids: {type: [Schema.Types.ObjectId], ref: 'bid', default: []},
    money: {type: Number, default: 100},
    claims: {type: [Schema.Types.ObjectId], ref: 'bid', default: []}
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


const User = module.exports = mongoose.model('user', UserSchema, 'cagDB'); 