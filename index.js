const express = require("express");
const app = express()
const redoc = require("redoc-express")
const ggpraha = require(__dirname + "/api/v1/ggpraha.js")
const cors = require("cors")


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

app.listen(process.env.PORT || 8080, () => console.log(`Loaded!`))