const app = require('../app')
const server = require('http').createServer(app);
const localUrl = 'http://localhost:8080'
const localUrl2 = 'http://localhost:3000'
const localUrl3 = 'http://localhost:3002'
const url = 'https://vue-test-47cc0.web.app'
const corsUrl = 'https://stormy-mountain-28848.herokuapp.com'
const io = require('socket.io')(server, {
    cors: {
        origin: {
            localUrl,
            localUrl2,
            localUrl3,
            url,
            corsUrl
        }
    },
    secure: true,
    sameSite: 'none'
});
io.on('updatePost', () => {
    console.log('updatePost Detected');
});
server.listen(3002)
module.exports = io