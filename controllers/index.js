const express = require('express') 
const router = express.Router()
const render = require('../models/render.js')

router.get('/', render)

module.exports = router
