const express = require('express');
const router = express.Router();
const socketApi = require('../helpers/socket')
router.get('/', async (req, res) => {
    await socketApi.io.emit('hello', 'whatisLove')
    socketApi.io.on('connection', (socket) => {
        socket.emit('hello','a message')
    })
    res.render('index')
})
module.exports = router