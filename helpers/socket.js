const express = require('express');
const PORT = 3002;
const server = express().use((req, res) => res.sendFile(INDEX, {
        root: __dirname
    }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const socketIO = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:8080",
            "https://vue-serve-test.herokuapp.com",
        "https://vue-test-47cc0.web.app"]
    },
    Headers: "Access-Control-Allow-Origin"
});
const io =socketIO.listen(server)
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});
setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
module.exports = io