const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');

router.get('/', async(req, res) => {
    const categoryList = await Category.find()

    if (!categoryList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(categoryList)
})

router.post('/', async(req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })

    category = await category.save();

    if (!category) {
        return res.status(404).send("The Category not Created")
    }

    res.status(200).send(category);
})

router.get('/:id', async(req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        res.status(500).json({
            message: "The Category with the given ID was not found"
        })
    }
    res.status(200).send(category);
})

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: "Category is deleted"
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
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

module.exports = router