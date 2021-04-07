const express = require('express');
const router = express.Router();
const io = require('../helpers/socket')
router.get('/', (req, res) => {
    const message = 'something'
    io.emit('update', message)
    res.send({
        status: 1
    })
})
module.exports = router