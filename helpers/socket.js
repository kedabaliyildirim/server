const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.SOCKET_PORT || 3003;
const INDEX = '/index.html';

const server = express()
    .use((req, res) => res.sendFile({
        root: __dirname
    }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);