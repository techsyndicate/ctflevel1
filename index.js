const userSchema = require('./schema/userSchema');
const { createHash } = require('node:crypto')

require('dotenv').config()

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    session = require("cookie-session"),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    url = require('url');

const port = process.env.PORT || 9000;

app.use(bodyParser.json({
    parameterLimit: 100000,
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    console.log(req.body)
    const randomLetter = Math.random().toString(36).slice(2)

    if (!req.body.email || req.body.email == "" || req.body.email == null) {
        return res.send({ message: "Email is required" });
    }
    var user = userSchema({
        email: req.body.email,
        previousChallenges: [],
        currentChallenge: sha256(randomLetter),
        currentLevel: "1",
    });
    await user.save()
    res.redirect('/login/' + req.body.email);
});

app.get('/login/:id', async (req, res) => {
    const user = await userSchema.findOne({ email: req.params.id })
    res.render('login', { user });
})

app.post('/login/:email', async (req, res) => {
    const randomLetter = Math.random().toString(36).slice(2)

    const user = await userSchema.findOne({ email: req.params.email })
    const { solution, currentChallenge} = req.body

    if (sha256(solution) == (currentChallenge) && user.previousChallenges.includes(user.currentChallenge) == false) {
        user.previousChallenges.push(currentChallenge)
        user.currentChallenge = sha256(randomLetter)
        user.currentLevel = (parseInt(user.currentLevel) + 1).toString()
        await user.save()
        if (user.currentLevel == "100") {
            res.send({ message: process.env.FLAG });
        } else {
            res.send({ message: "Level" + user.currentLevel + "completed, " + (101 - parseInt(user.currentLevel)) + " To go!" });
        }
    } else {
        res.send({ message: "Incorrect solution" });
    }
});

function sha256(content) {
    return createHash('sha256').update(content).digest('hex')
}

mongoose.set("strictQuery", false)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Mongo DB")
})
app.listen(port, () => {
    console.log(`TS Encryptid listening at http://localhost:${port}`)
});