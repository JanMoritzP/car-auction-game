const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const bodyParser = require('body-parser')
const port = 3080


app.use(bodyParser.json())

app.use(cors())

app.get('/test', (req, res) => {
    console.log("Api called")
    data = {"id": "1", "name": "Test"}
    res.json(data)
})

app.post('/login', (req, res) => {
    data = {token: "123"}
    res.send(data)
})


app.listen(port, () => {
    console.log("App listening on port " + port)
})