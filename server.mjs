const express = require('express')
const app = express()
const fetch = require("node-fetch")
const cors = require('cors')

app.use(cors())

app.get("/" async (req, res) => {
    const response = await fetch("https://uptime-mercury-api.azurewebsites.net/webparser")
    res.json(await response.json())
})