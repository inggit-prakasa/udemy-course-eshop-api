const expressJwt = require('express-jwt');
require('dotenv/config');

function authJwt() {
    const secretJwt = process.env.JWT_SECRET;
    return expressJwt({
        secret: secretJwt,
        algorithms: ['HS256'],
    })
}

module.exports = authJwt;