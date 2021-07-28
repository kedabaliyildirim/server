const io = require('socket.io')()
const socketApi = {
    io: io
};
io.emit('what', 'da')
io.on('hello', (data) => {
})
io.on('connection', (socket) => {
    socket.on('hello', (data) => {
    })
})
module.exports = socketApi