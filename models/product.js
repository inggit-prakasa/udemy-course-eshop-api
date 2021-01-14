const mongoose = require('mongoose');

const productScheme = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

exports.Product = mongoose.model('Product', productScheme)