const express = require('express');
const router = express.Router();
const socketApi = require('../helpers/socket')
const cors =require('cors')
const localUrl = 'http://localhost:8080'
const url = 'https://vue-test-47cc0.web.app'
const corsUrl = 'https://stormy-mountain-28848.herokuapp.com'
const netifyUrl = 'https://608fd9580b164e5e4d693129--stoic-turing-035110.netlify.app'
router.use(cors({
    credentials: true,
    origin: {
        url,
        localUrl,
        corsUrl,
        netifyUrl
    }
}))
router.get('/', async (req, res) => {
    socketApi.io.on('connection', (socket) => {
        socket.broadcast.emit('hello','a message')
    })
    socketApi.io.emit('Dello','Deldel')
    res.render('index')
})
module.exports = router