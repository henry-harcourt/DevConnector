const express = require('express')
const router = express.Router()

// @route GET   api/profile
// @description Test route
// @access      Public (no auth token required)
router.get('/', (req, res) => res.send('Profile route'))

module.exports = router