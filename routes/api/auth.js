const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')

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

module.exports = router