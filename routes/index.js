const express = require('express');
const router = express.Router();
const socketApi = require('../helpers/socket')
router.get('/', async (req, res) => {
    socketApi.io.on('connection', (socket) => {
        socket.broadcast.emit('hello','a message')
    })
    socketApi.io.emit('Dello','Deldel')
    res.render('index')
})
module.exports = router