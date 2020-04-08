const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')


const User = require('../../models/User')

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
    async (req, res) => {

        // here, if the checks above are not met, the server will see if the error message is not empty and will respond with
        // a 404 and an array of the errors. 
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body

        // try, catch, await method is a simpler/cleaner way of handling asynchronus functions. because they return a promise
        // you would usually put .then - however this can lead to alot of clutter so 'await' is a tidy alternative.

        try {
            let user = await User.findOne({ email })

            // see if user exists
            // if exists, send back an error
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
            }

            // if not found get users Gravatar
            const avatar = gravatar.url(email, {
                //size 
                s: '200',
                // rating
                r: 'pg',
                //default img
                d: 'mm'
            })

            // cerate instance of new user
            user = new User({
                name,
                email,
                avatar,
                password
            })

            // encrypt password using bcrypt. salt does the hashing. 10 = the number of "rounds", more you have the more secure 
            // but the more you have the slower the load times.
            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(password, salt)

            // here the user is now saved to the database.
            await user.save()

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