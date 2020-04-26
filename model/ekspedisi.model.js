const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ekspedisi = new Schema({
    "name": {
        type: String
    },
});

module.exports = mongoose.model('ekspedisi', ekspedisi);