const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

router.get('/', async(req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 })

    if (!orderList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(orderList)
})

router.get('/:id', async(req, res) => {
    const orderList = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })

    if (!orderList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(orderList)
})

router.post('/', async(req, res) => {
    const orderItemIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save()

        return newOrderItem._id
    }))

    const orderItemIdsResolve = await orderItemIds;

    const totalPrices = await Promise.all(orderItemIdsResolve.map(async(productId) => {
        const item = await OrderItem.findById(productId).populate('product', 'price');
        const totalPrice = item.product.price * item.quantity;

        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

    let order = new Order({
        orderItems: orderItemIdsResolve,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    order = await order.save();

    if (!order) {
        return res.status(400).send("The Category not Created")
    }

    res.status(200).send(order);
})

router.put('/:id', async(req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status
    }, { new: true })

    if (!order) {
        return res.status(404).send("The Order not Created")
    }

    res.status(200).send(order);
})

router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id)
        .then(async order => {
            if (order) {
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findByIdAndRemove(orderItem)
                })

                return res.status(200).json({
                    success: true,
                    message: "Order is deleted"
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Order not found"
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

router.get('/get/totalsales', async(req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])

    if (!totalSales) {
        return res.status(400).send('The Order sales cannot be generated')
    }

    res.send({ totalsales: totalSales.pop().totalsales })
})

router.get('/get/count', async(req, res) => {
    const orderCount = await Order.countDocuments((count) => count);

    if (!orderCount) {
        res.status(500).json({
            success: false
        })
    }
    res.send({
        orderCount: orderCount
    })
})

module.exports = router