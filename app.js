var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
 
serv.listen(2000);
console.log("Server started.");
 
var SOCKET_LIST = {};
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.floor(Math.random() * 2000);

    SOCKET_LIST[socket.id] = socket;
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
    });
});
 
setInterval(function(){
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('nigaHere', i);
    }
},1000/25);