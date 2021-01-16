function errorHandler(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        return res.status(401).json({ message: "The User is not Authorized" })
    }

    return res.status(500).json(err)
}

module.exports = errorHandler;