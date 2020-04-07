const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

// @route POST   api/users
// @description register user
// @access      Public (no auth token required)
router.post('/', [
    
    // check test implemented through express-validator/check npm package
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
    (req, res) => {

        // here, if the checks above are not met, the server will see if the error message is not empty and will respond with
        // a 404 and an array of the errors. 
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        res.send('User route')
    })

module.exports = router