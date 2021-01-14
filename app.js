const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

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

app.listen(port, () => {
    console.log(`server is running in http://localhost:${port}`)
})