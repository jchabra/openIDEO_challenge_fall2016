var socket = io();
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li class="userMessage grid-70 mobile-grid-70 prefix-30">').text(msg));
});
socket.on('bot message', function(msg){
  $('#messages').append($('<li class="botMessage">').text(msg));
});
