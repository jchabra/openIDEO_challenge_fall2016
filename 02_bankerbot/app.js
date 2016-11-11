/*** Initialize ***/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var players = [];
var botIP ;


/** fire up the HTML ***/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');

});


/*** SocketIO MAGIC ***/
io.on('connection', function(socket){

  /*** Handle PLAYERS ***/
  var ip = socket.handshake.address.slice(7);
  players.push(ip);
  console.log(toUnique(players));


  /*** Handle MESSAGES ***/
  socket.on('chat message', function(msg){

    /* who's the bot? */
    var messIP = socket.handshake.address.slice(7);
    if ( messIP == botIP ) {
      io.emit('bot message', msg);
    }
    else {
      io.emit('chat message', msg);
    }

    /* set the bankerbot */
    if (msg.toLowerCase() == 'bankerbot') {
      botIP = messIP ;
      console.log(botIP + ' is now the bot');
    }

  });

});



/*** SETUP PORT ***/
var port = process.env.PORT || 8080;
http.listen(port, function(){
  console.log('listening on *' + port);
});


/*** FUNCTIONS ***/
function toUnique(a,b,c){
  // makes an array with duplicates ( array,placeholder,placeholder )
  b=a.length;
  while(c=--b)while(c--)a[b]!==a[c]||a.splice(c,1);
  return a;
}
