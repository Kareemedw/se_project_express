const mongoose = require("mongoose");

const clothingItemShema = new mongoose.Schema({});

module.exports = mongoose.model("item", clothingItemShema);
