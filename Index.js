var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var u;
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('user given', function(userGiven){
    if(users.indexOf(userGiven) > -1) {
      socket.emit('user taken');
    }else{
      u = userGiven;
      users.push(u);
      console.log(u + ' connected');
      socket.emit('connection success');
      io.emit('new user connected', u);
    }
  });
  socket.on('disconnect', function(){
    if(u != null){
      users.pop(u);
      io.emit('user disconnected', u);
      console.log(u + ' disconnected');
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
