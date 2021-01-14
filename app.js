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

const productRouter = require('./routers/product');
const categoryRouter = require('./routers/categories');
const orderRouter = require('./routers/orders');
const userRouter = require('./routers/users');

//ROUTERS
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/users`, userRouter);

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