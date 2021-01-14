const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

require('dotenv/config');

const api = process.env.API_URL

const port = 3000

app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'Hair',
        image: 'some_url',
    }
    res.send(product)
})

app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body
    res.send(newProduct)
})

mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Database Connection is Ready')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log(`server is running in http://localhost:${port}`)
})