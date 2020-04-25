const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
    "_id": {
        type: String
    },
    "password": {
        type: String
    }
});

module.exports = mongoose.model('user', user);