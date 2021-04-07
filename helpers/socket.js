const app = require('../app')
const server = require('http').createServer(app);
const localUrl = 'http://localhost:8080'
const url = 'https://vue-test-47cc0.web.app'
const corsUrl = 'https://stormy-mountain-28848.herokuapp.com'
const io = require('socket.io')(server, {
    cors: {
        origin: {
            localUrl,
            url,
            corsUrl
        }
    }
});
io.on('connection', () => {});
server.listen(3002)
const message = 'aaaaa'
io.emit('update', message)
module.exports = io