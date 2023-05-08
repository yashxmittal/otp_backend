const mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
    token: {
        type: String
    },
    key: {
        type: Number
    }
});

module.exports = mongoose.model('token', tokenSchema);