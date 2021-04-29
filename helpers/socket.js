const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on('connection', client => {
    console.log('@connection');
    client.on('event', () => {
        /* … */ });
    client.on('disconnect', () => {
        /* … */ });
});
io.on('connect', (client) => {
    console.log(`this is connect ${client}`);
})
io.on('hello', (data) => {
    console.log(data);
})
server.listen(3004);
module.exports = io