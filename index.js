const express = require("express");
const app = express()
const redoc = require("redoc-express")
const ggpraha = require(__dirname + "/api/v1/ggpraha.js")

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

app.get("/", (req, res) => {
    res.redirect("/docs");
})

app.listen(process.env.PORT || 8080, () => console.log(`Loaded!`))