const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const { Product } = require('../models/product');

router.get('/', async(req, res) => {
    const productList = await Product.find().select('name image -_id');

    if (!productList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
})

router.get('/:id', async(req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(500).json({
            success: false
        })
    }
    res.send(product)
})

router.post('/', async(req, res) => {
    let category = await Category.findById(req.body.category)

    console.log(category)

    if (!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        price: req.body.price,
        countInStock: req.body.countInStock
    })

    product = await product.save();

    if (!product) return res.status(500).send('The Product Cannot be Created')

    return res.send(product)
})

module.exports = router