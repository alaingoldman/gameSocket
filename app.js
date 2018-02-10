var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/game/:id',function(req, res) {
    res.sendFile(__dirname + '/client/room.html');
});

app.use('/client',express.static(__dirname + '/client'));
 
serv.listen(3000);
console.log("Server started.");

var Player = function(id){
    var self = {
        x:250,
        y:250
    }
    return self;
}


var SOCKET_LIST = {};
var PLAYER_LIST = {};
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.floor(Math.random() * 2000);
    SOCKET_LIST[socket.id] = socket;

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

    socket.on('create', function(room) {
        console.log("attemping to connect to room: " + room);
        socket.join(room);
    });

    socket.on('web3Address', function(result) {
        socket.id = result.address;
        SOCKET_LIST[socket.id] = socket;
        var player = Player(socket.id);
        PLAYER_LIST[socket.id] = player;
    });
});
 
setInterval(function(){
    var pack = [];

    for(var i in PLAYER_LIST){
        pack.push(i);
    }

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('dudeHere', pack);
    }
},250);