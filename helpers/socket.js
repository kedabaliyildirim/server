const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:8080",
            "https://vue-serve-test.herokuapp.com",
        "https://vue-test-47cc0.web.app"]
    }
});
io.on('connection', client => {
    client.on('event', () => {
        /* … */ });
    client.on('disconnect', () => {
        /* … */ });
});
console.log(process.env.SOCKET_PORT);
server.listen(process.env.SOCKET_PORT);
module.exports = io