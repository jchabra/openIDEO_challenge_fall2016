var bot = false;
var typing = false;
var timeout = undefined;

var socket = io();
$('form').submit(function(){
  clearTimeout(timeout);
  timeout = setTimeout(timeoutFunction, 0);

  if ( $('#m').val().toLowerCase() == 'bot' ) {
    socket.emit("typing", { isTyping: false, isBot: bot  } );
    bot = true;
    $('#userTypingMessage').remove() ;
    console.log('typing as bot...');
  }
  else if ( $('#m').val().toLowerCase() == 'notbot' ) {
    socket.emit("typing", { isTyping: false, isBot: bot  } );
    bot = false;
    $('#botTypingMessage').remove() ;
    console.log('typing as user...');
  }
  else if ( $('#m').val().length !== 0 ) {
    socket.emit('client message', { whatsMessage: $('#m').val(), isBot: bot } );
  }
  else {
    console.log('no message or somethings wrong...');
  }

  // console.log(bot); // make sure 'bot' && 'notbot' changes
  $('#m').val(''); // clear for next msg
  return false;
});

socket.on('server message', function(msgInfo){
  clearTimeout(timeout);
  timeout = setTimeout(timeoutFunction, 0);

  if ( msgInfo.isBot ) {
    $('#messages').append($('<li class="grid-70 mobile-grid-70 prefix-30 mobile-prefix-30 botMessage">').text(msgInfo.whatsMessage));
  }
  else {
    $('#messages').append($('<li class="grid-70 mobile-grid-70 prefix-30 mobile-prefix-30 userMessage">').text(msgInfo.whatsMessage));
  }
});

socket.on("isTyping", function(data) {
  if (data.isTyping) {
    if ( data.isBot ) {
      $('#messages').append($('<li id="botTypingMessage">bot typing</li>'));
    }
    else {
      $('#messages').append($('<li id="userTypingMessage">user typing</li>'));
    }
  }
  else {
    if ( data.isBot ) {
      $('#botTypingMessage').remove() ;
      // $('#botTypingMessage').fadeOut(300, function(){
      //     $(this).remove(); // works but breaks when pressing enter... kinda.
      // });
    }
    else {
      $('#userTypingMessage').remove() ;
    }
  }
});


function timeoutFunction() {
  typing = false;
  socket.emit("typing", { isTyping: typing, isBot: bot  } );
}

$("#m").keypress(function(e){
  if (e.which !== 13) {
    if (typing === false && $("#m").is(":focus")) {
      typing = true;
      socket.emit("typing", { isTyping: typing, isBot: bot } );
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(timeoutFunction, 5000);
    }
  }
});
