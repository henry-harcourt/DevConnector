const express = require('express')
const router = express.Router()

// @route GET   api/posts
// @description Test route
// @access      Public (no auth token required)
router.get('/', (req, res) => res.send('Posts route'))

module.exports = router