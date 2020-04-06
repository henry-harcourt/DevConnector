const express = require('express')
const router = express.Router()

// @route GET   api/auth
// @description Test route
// @access      Public (no auth token required)
router.get('/', (req, res) => res.send('Auth route'))

module.exports = router