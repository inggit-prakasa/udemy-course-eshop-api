const expressJwt = require('express-jwt');
require('dotenv/config');

function authJwt() {
    const secretJwt = process.env.JWT_SECRET;
    return expressJwt({
        secret: secretJwt,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    })
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true)
    }
    done()
}

module.exports = authJwt;