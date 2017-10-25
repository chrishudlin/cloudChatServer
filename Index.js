var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var u = "";
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('user connected', function(userGiven){
    if(users.indexOf(userGiven) > -1){
      //socket.emit('connection unsuccessful');
    }else{
      u = userGiven;
      //socket.emit('connection successful', u);
      io.emit('connection message', userGiven + " has connected to the chat");
      console.log(userGiven + ' connected');
    }
  });
  socket.on('disconnect', function(){
    if(u != ""){
      io.emit('disconnection message', u + " has disconnected to the chat");
      console.log(u + ' disconnected');
    }
  });
});

http.listen(3000, function(){
   console.log('listening on *:3000');
});
