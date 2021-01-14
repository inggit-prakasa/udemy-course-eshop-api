const express = require('express');
const app = express();

require('dotenv/config');

const api = process.env.API_URL

const port = 3000

app.get(api + '/', (req, res) => {
    res.send('Hello API !!')
})

app.listen(port, () => {
    console.log(`server is running in http://localhost:${port}`)
})