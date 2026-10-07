const express = require("express")

const app = express()
const PORT = 3000;

app.get("/", (req, res) => {

    res.send("Main")
})

app.get("/contact", (req, res) => {

    res.send("Contact")
})

app.get("/start", (req, res) => {

    res.send("Start")
})

app.get("/stop", (req, res) => {
    res.send("Stop")
})