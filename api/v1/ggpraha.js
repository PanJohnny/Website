const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const id = req.header("id")
    const secret = req.header("secret")
    if (!id) {
        res.status(400).json({ reason: "missing id" })
        return
    } else if (!secret) {
        res.status(400).json({ reason: "missing secret" })
        return
    }
    const json = JSON.parse(fs.readFileSync("./data/ggpraha.json", "utf8"))

    const field = json.find(item => item.lampa == id && item.secret == secret)
    if (!field) {
        res.status(400).json({ reason: "invalid id or secret" })
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
})

module.exports = router;