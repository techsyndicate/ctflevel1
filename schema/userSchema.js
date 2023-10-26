// Import Modules
const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqString = { type: String, required: true },
    reqStringFalseDefEmpty = { type: String, required: false, default: "" },
    reqStringFalse = { type: String, required: false },
    reqBool = { type: Boolean, required: true, default: false },
    reqBoolFalse = { type: Boolean, required: false, default: false },
    dateStringWithTime = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');

// Schema
const userSchema = new mongoose.Schema({
    email: reqString,
    previousChallenges: [],
    currentChallenge: reqStringFalseDefEmpty,
    currentLevel: reqStringFalseDefEmpty,
})

// Export Schema
module.exports = mongoose.model("User", userSchema)