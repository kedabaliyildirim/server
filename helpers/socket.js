const io = require('socket.io')()
const socketApi = {
    io: io
};
io.emit('what', 'da')
io.on('hello', (data) => {
    console.log(data);
})
io.on('connection', (socket) => {
    socket.on('rockAndRoll', (data) => {
        console.log(data);
    })
    socket.on('hello', (data) => {
        console.log(`this is data ${data}`);
    })
    socket.on('what', (data) => {
        console.log(data);
    })
    socket.emit('hell', 'is')
    socket.on('hell', (data) => {
        console.log('going');
        console.log(data);
    })
})
module.exports = socketApi