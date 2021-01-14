const mongoose = require('mongoose');

const categoryScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
    },
    color: { //HashString cth. #000
        type: String,
    },
    image: {
        type: String,
        default: ''
    }
})

exports.Category = mongoose.model('Category', categoryScheme)