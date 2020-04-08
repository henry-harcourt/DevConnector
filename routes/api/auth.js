const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')


// @route GET   api/auth
// @description Test route
// @access      Public (no auth token required)
router.get('/', auth, async (req, res) => {
    try { 
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


// @route POST   api/auth
// @description  Authenticate user & get token
// @access      Public (no auth token required)
router.post('/', [

    // check test implemented through express-validator/check npm package
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
    async (req, res) => {

        // here, if the checks above are not met, the server will see if the error message is not empty and will respond with
        // a 404 and an array of the errors. 
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        // try, catch, await method is a simpler/cleaner way of handling asynchronus functions. because they return a promise
        // you would usually put .then - however this can lead to alot of clutter so 'await' is a tidy alternative.

        try {
            let user = await User.findOne({ email })

            // see if user exists
            // if exists, send back an error
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid crerdentials' }] })
            }

            // compare returns a promise so we use 'await'. takes plain text password fom user & encrypted password from user object
            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid crerdentials' }] })
            }

            // return the jsonwebtoken. this talks to mongoDB. user.id accesses _id in mongoDB
            const payload = {
                user: {
                    id: user.id
                }
            }
            
            // sign the token. pass in the payload, pass in the secret from jwt in ./config through config.get(). Then there is an optional expiration timer.
            // then if there are no errors, send the token back to the client 
            jwt.sign(
                payload, 
                config.get('jwtSecret'),
                { expiresIn: 360000000 },
                (err, token) => {
                    if(err) throw err
                    res.json({ token })
                })


            // res.send('User registered')

        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }




    })

module.exports = router