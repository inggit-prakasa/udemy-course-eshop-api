const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const { Product } = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_NAME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const isValid = FILE_NAME_TYPE[file.mimetype]
        let uploadError = new Error('Invalid Type');

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function(req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        console.log(fileName);
        const extension = FILE_NAME_TYPE[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

var upload = multer({ storage: storage })

router.get('/', async(req, res) => {
    let filter = {}
    if (req.query.categories) {
        filter = { category: req.query.categories.split(",") }
    }
    const productList = await Product.find(filter).populate('category');

    if (!productList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
})

router.get('/:id', async(req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({
            success: false
        })
    }
    res.send(product)
})

router.post('/', upload.single('image'), async(req, res) => {
    let category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid Category')

    const file = req.file;
    if (!file) return res.status(400).send('No Image in request')

    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}/${fileName}`,
        images: req.body.images,
        brand: req.body.brand,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeature: req.body.isFeature,
        price: req.body.price,
        countInStock: req.body.countInStock
    })

    product = await product.save();

    if (!product) return res.status(500).send('The Product Cannot be Created')

    return res.send(product)
})

router.put('/:id', async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Id')
    }

    let category
    Category.findById(req.body.category)
        .then((result) => {
            category = result
        }).catch((err) => {
            return res.status(400).send('Invalid Category')
        });

    const product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeature: req.body.isFeature,
        price: req.body.price,
        countInStock: req.body.countInStock
    }, { new: true })

    if (!product) {
        return res.status(500).send("The Product not Created")
    }

    res.send(product);
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: "product is deleted"
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "product not found"
                })
            }
        })
        .catch(err => {
            return res.status(400).json({
                success: false,
                error: err
            })
        })
})

router.get('/get/count', async(req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({
            success: false
        })
    }
    res.send({
        productCount: productCount
    })
})

router.get('/get/featured/:count', async(req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const product = await Product.find({ isFeature: true }).limit(+count);

    if (!product) {
        res.status(500).json({
            success: false
        })
    }
    res.send(product)
})

module.exports = router