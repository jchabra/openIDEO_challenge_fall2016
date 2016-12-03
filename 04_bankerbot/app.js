/*** Initialize ***/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var path = require('path');

/* serve up the static assets folder (public) */
app.use(express.static(path.join(__dirname, 'public')));


/*** SocketIO MAGIC ***/
io.on('connection', function(socket){

  /*** Handle MESSAGES ***/
  socket.on('client message', function(msgInfo) {
    io.emit('server message', msgInfo);
  });

  /*** Hnadle TYPING **/
  socket.on('typing', function(data) {
    io.emit("isTyping", data );
  });

});


/*** SETUP PORT ***/
var port = process.env.PORT || 8080;
http.listen(port, function(){
  console.log('go to http://localhost:' + port);
});
