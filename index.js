const express = require("express");
const app = express()
const redoc = require("redoc-express")
const ggpraha = require(__dirname + "/api/v1/ggpraha.js")
const cors = require("cors")
const fetch = require("node-fetch")


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
    const discordWebhook = 'https://discord.com/api/webhooks/941982810368004158/h-lW0ro4xLH4eYC9kM3q0i2sW_BUYKZTIAMPZYCJQ0hS4tubvgn3jwVWrmMY-YgjPQfz'
    fetch(
        discordWebhook,
        {
            method: 'post',
            headers: {'Content-Type': 'application/json',"Access-Control-Allow-Origin": "*", "Origin": "https://panjohnny.vercel.app", "Access-Control-Allow-Credentials": "true"},
            body: JSON.stringify({
                // the username to be displayed
                username: name,
                // the avatar to be displayed
                avatar_url: "",
                // send email and messagw
                content: `__New Feedback__\n\n**Email:** ${email}\n**Message:** ${message}` 
            }),
        }
    ).catch(arr => console.error(arr))

    res.status(200).send("Feedback received")
})

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname + "/script.js")
})

app.listen(process.env.PORT || 8080, () => console.log(`Loaded!`))