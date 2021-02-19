const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')

const app = express(),
    const bodyParser = require('body-parser')
    port = 3080


app.use(bodyParser.json())

app.get('/test', (req, res) => {
    console.log("Api called")
    data = {"id": "1", "name": "Test"}
    res.json(data)
})


app.listen(port, () => {
    console.log("App listening on port ${port}")
})