var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
 
serv.listen(2000);
console.log("Server started.");

var Player = function(id){
    var self = {
        x:250,
        y:250,
        id:id,
        pressingRight:false,
        pressingLeft:false,
        pressingUp:false,
        pressingDown:false,
        maxSpd:10,
    }
    // self.updatePosition = function(){
    //     if(self.pressingRight)
    //         self.x += self.maxSpd;
    //     if(self.pressingLeft)
    //         self.x -= self.maxSpd;
    //     if(self.pressingUp)
    //         self.y -= self.maxSpd;
    //     if(self.pressingDown)
    //         self.y += self.maxSpd;
    // }
    return self;
}


var SOCKET_LIST = {};
var PLAYER_LIST = {};
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.floor(Math.random() * 2000);
    SOCKET_LIST[socket.id] = socket;

    var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
});
 
setInterval(function(){
    var pack = [];

    for(var i in PLAYER_LIST){
        console.log(i);
        pack.push(i);
    }

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('nigaHere', pack);
    }
},2000);