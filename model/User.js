const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6
    },
    lastName: {
        type: String,
        required: true,
        min: 6
    },
    phone: {
        type: Number,
        required: true,
        min: 6
    },

    email: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 12
    },
    bio: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }


})
module.exports = mongoose.model('User', userSchema)