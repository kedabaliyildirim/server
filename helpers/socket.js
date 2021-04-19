const httpServer = require('http')
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "https://localhost:8080",
        methods: ["GET", "POST"],
        allowedHeaders: ["getMeMenager"],
        credentials: true
    }
});
module.exports = io