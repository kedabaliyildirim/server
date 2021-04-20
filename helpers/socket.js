const server = require('http').createServer((req, res) => {
    console.log(hello);
});
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
server.listen(3004);
module.exports = io