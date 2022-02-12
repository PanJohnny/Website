const express = require("express");
const app = express()
const redoc = require("redoc-express")
const ggpraha = require(__dirname + "/api/v1/ggpraha.js")
const cors = require("cors")
const fetch = require("node-fetch")
// add discord js webhook client
const discordjs = require("discord.js")
require("dotenv").config()


app.use(cors())
app.use(express.json({ extended: false }))
app.use("/api/v1/ggpraha", ggpraha)

app.get('/docs/swagger.yml', (req, res) => {
    res.sendFile(__dirname + '/swagger.yml')
});

// define title and specUrl location
// serve redoc
app.get(
    '/docs',
    redoc({
        title: 'API Docs',
        specUrl: '/docs/swagger.yml'
    })
);

app.get("/favicon.png", (req, res) => {
    res.sendFile(__dirname + "/favicon.png")
})

app.get("/assets/flower.svg", (req, res) => {
    res.sendFile(__dirname + "/assets/flower.svg")
})

app.get("/assets/kilohard.png", (req, res) => {
    res.sendFile(__dirname + "/assets/kilohard.png")
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/index.html")
})

app.get("/style.css", (req, res) => {
    res.sendFile(__dirname + "/style.css")
})

app.post("/feedback", async (req, res) => {
    // get json in body and send it to discord webhook
    const { name, email, message } = req.body
    // create webhook client
    const client = new discordjs.WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN})
    // create embed
    const embed = new discordjs.MessageEmbed()
        .setTitle("Feedback")
        .setColor(0x00AE86)
        .setDescription(`New feedback arrived!`)
        .addField("Name", name)
        .addField("Email", email)
        .addField("Message", message)
        .addField("Time", new Date().toLocaleString("cs-CZ"))
        .setTimestamp(new Date())
    // send message and embed to discord
    await client.send({embeds: [embed]})

    res.status(200).send("Feedback received")
})

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname + "/script.js")
})

app.listen(process.env.PORT || 8080, () => console.log(`Loaded!`))