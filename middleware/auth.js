const jwt = require('jsonwebtoken')
const config = require('config')


// a middleware function is a function that has access to the request and response cycle/objects. 
// 'next' is a callback that recognises when req,res is done and moves on to the next piece of middleware 
module.exports = function (req, res, next) {
    // Get the token from the header
    const token = req.header('x-auth-token')

    // Check if no token. If no token then send a 401 status - user not authorized
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    // Verify token if there is one. uses jwt package built in functions such as verify
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))

        // take request object and asign value to user (from paylaod)
        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' })
    }
}