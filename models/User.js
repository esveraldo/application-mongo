const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('users', User);