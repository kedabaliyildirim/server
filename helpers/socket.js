const server = require('http').createServer((req, res) => {
    res.end('hello')
});
server.listen(3002);
const socketIO = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:8080",
            "https://vue-serve-test.herokuapp.com",
        "https://vue-test-47cc0.web.app"]
    },
    Headers: "Access-Control-Allow-Origin"
});
const io =socketIO.listen(server)
io.on('connection', client => {
    client.on('event', () => {
        console.log('connected somehow');
    });
    client.on('disconnect', () => {
        /* … */ });
});
console.log(process.env.SOCKET_PORT);
module.exports = io