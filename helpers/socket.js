const io = require('socket.io')()
const socketApi = {
    io: io
};
io.emit('what', 'da')
io.on('hello', (data) => {
})
io.on('connection', (socket) => {
    socket.on('rockAndRoll', (data) => {
    })
    socket.on('hello', (data) => {
    })
    socket.on('what', (data) => {
    })
    socket.emit('hell', 'is')
    socket.on('hell', (data) => {
    })
})
module.exports = socketApi