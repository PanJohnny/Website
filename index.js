const express = require("express");
const app = express()
const redoc = require("redoc-express")
const ggpraha = require(__dirname + "/api/v1/ggpraha.js")
const projects = require(__dirname + "/projects/projects.js")
const cors = require("cors")
const fetch = require("node-fetch")
// add discord js webhook client
const discordjs = require("discord.js")
require("dotenv").config()


app.use(cors())
app.use(express.json({ extended: false }))
app.use("/api/v1/ggpraha", ggpraha)
app.use("/projects", projects)

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
    const client = new discordjs.WebhookClient({ id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN })
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
    await client.send({ embeds: [embed] })

    res.status(200).send("Feedback received")
})

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname + "/script.js")
})

app.get("/socials", (req, res) => {
    res.sendFile(__dirname + "/html/socials.html")
})

app.get("/about", (req, res) => {
    res.send(`<link rel="icon" href="/favicon.png" type="image/png">

    <!-- Primary Meta Tags -->
    <title>PanJohnny</title>
    <meta name="title" content="PanJohnny">
    <meta name="description" content="Programmer that likes cats and dogs.">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://panjohnny.vercel.app/">
    <meta property="og:title" content="PanJohnny">
    <meta property="og:description" content="Programmer that likes cats and dogs.">
    <meta property="og:image" content="/favicon.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://panjohnny.vercel.app/">
    <meta property="twitter:title" content="PanJohnny">
    <meta property="twitter:description" content="Programmer that likes cats and dogs.">
    <meta property="twitter:image" content="/favicon.png">
    <script>
    function botCheck(){
        var botPattern = "(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
                  var re = new RegExp(botPattern, 'i');
                  var userAgent = navigator.userAgent;
                  if (re.test(userAgent)) {
                      return true;
                  }else{
                    return false;
                  }
        }

        if(!botCheck()) {setTimeout(() => {window.location.href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, 500)}</script> <body><h1>About me</h1></body>`)
})
app.listen(process.env.PORT || 8080, () => console.log(`Loaded!`))