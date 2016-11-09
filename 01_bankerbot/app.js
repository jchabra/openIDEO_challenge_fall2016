var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var players = [];

//Create a static file server
// app.configure(function() {
//   app.use(express.static(__dirname + '/public'));
// });

// app.get('/', function(req, res) {
//      res.sendFile('public/index.html');
//  });

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');

  // res.sendFile(path.join(__dirname+'/index.html'));
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  // Handle PLAYERS
  var address = socket.handshake.address;
  var ip = address.slice(7);
  //console.log(ip);
  players.push(ip);
  //console.log(players);
  console.log(toUnique(players));


});

//Get the dummy data
// require('./server/ddata.js');
var port = process.env.PORT || 8080;

http.listen(port, function(){
  console.log('listening on *' + port);
});
//
// var port = 3000;
// app.listen(port);
// console.log('Express server started on port %s', port);


// make a unique array (no duplicate IPs)
function toUnique(a,b,c){//array,placeholder,placeholder
 b=a.length;
 while(c=--b)while(c--)a[b]!==a[c]||a.splice(c,1);
 return a;
}
