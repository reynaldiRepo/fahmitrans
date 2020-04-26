const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const perjalanan = new Schema({
    tanggal: Date,
    nopol: String,
    ekspedisi: String,
    customer: String,
    muat: String,
    tujuan: String,
    tonase: Number,
    fee:Number
});

module.exports = mongoose.model('perjalanan', perjalanan);