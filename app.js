const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
io.on('connection', function (socket) {
    socket.on("send-location", function (data) {
        io.emit("recieve-location", { id: socket.id, ...data });
    });
    console.log('connected');

    socket.on("disconnect", function () { 
        io.emit("user-disconnected", socket.id);    
    });
});
app.get('/', function (req, res) {
    res.render('index');
});
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});