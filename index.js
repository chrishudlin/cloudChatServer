'use strict';
//Created by Elliott Hill [Student ID: 307661]
//and Chris Hudlin [Student ID: 307555]

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

let port = process.env.PORT || process.env.VCAP_APP_PORT || 8080;
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var u = "";
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('user connected', function(userGiven){
    u = userGiven;
    users.push(u);
    io.emit('connection message', u + " has connected to the chat");
    console.log(u + ' connected');
  });
  socket.on('get users', function(callback){
    callback(users);
  });
  socket.on('get user for private chat', function(userGiven, callback){
    if(users.indexOf(userGiven) > -1){
      callback(true);
    }else{
      callback(false);
    }
  });
  socket.on('private chat message', function(userGiven, msg){
    io.emit('private chat message', userGiven, msg);
  });
  socket.on('disconnect', function(){
    if(u != ""){
      users.pop(u);
      io.emit('disconnection message', u + " has disconnected to the chat");
      console.log(u + ' disconnected');
    }
  });
});

http.listen(port, function(){
   console.log('listening on *:'+port);
});
