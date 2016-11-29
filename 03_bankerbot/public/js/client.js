var socket = io();
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li class="grid-70 mobile-grid-70 prefix-30 mobile-prefix-30 userMessage">').text(msg));
});
socket.on('bot message', function(msg){
  $('#messages').append($('<li class="grid-70 mobile-grid-70 suffix-30 mobile-suffix-30 botMessage">').text(msg));
});
