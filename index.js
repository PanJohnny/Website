const express = require("express");
const app = express()
const redoc = require("redoc-express")
const fs = require("fs");

app.get('/swagger', (req, res) => {
    res.sendFile('swagger.yml', { root: '.' });
});

// define title and specUrl location
// serve redoc
app.get(
    '/docs',
    redoc({
        title: 'API Docs',
        specUrl: '/swagger'
    })
);

app.get("/", (req, res) => {
    res.redirect("/docs");
})

app.get('/api/v1/ggpraha', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const id = req.header("id")
    const secret = req.header("secret")
    if(!id) {
        res.status(400).json({reason: "missing id"})
        return
    } else if(!secret) {
        res.status(400).json({reason: "missing secret"})
        return
    }
    const json = JSON.parse(fs.readFileSync("./data/ggpraha.json", "utf8"))

    const field = json.find(item => item.lampa == id && item.secret == secret)
        if(!field) {
            res.status(400).json({reason: "invalid id or secret"})
            return
        }
        res.json(
            {
                "id": field.lampa,
                "name": field.lokace,
                "description": field.popis,
                "point": field.map_link
            }
        )
    }
)

app.listen(process.env.PORT || 8080, () => console.log(`Loaded!`))