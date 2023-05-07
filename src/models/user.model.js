const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    phoneNumber: {
        type: Number,
        required: true,
        index : true
    },
    name: { type : String},
    email: {String},
    dateOfBirth: {
        type: Date,
        required: true,
        index : true
    }
})

module.exports = mongoose.model('User', UserSchema);