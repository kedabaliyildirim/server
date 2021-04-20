const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    req.app.io.emit('hello')
    req.app.io.on('hello', () => {
        console.log('someone Says Hello');
    })
    res.send({
        status: 1
    })
})
module.exports = router