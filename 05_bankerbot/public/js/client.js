var bot = false;
var typing = false;
var timeout = undefined;
var msgsHeight = 0;

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

// Show User and Bot Messages
socket.on('server message', function(msgInfo){
  clearTimeout(timeout);
  timeout = setTimeout(timeoutFunction, 0);

  if ( msgInfo.isBot ) {
    // handle special linked messages 
    if ( msgInfo.whatsMessage.includes("Fulton") ) {
      console.log('fulton bank question');
      $('#messages').append($('<li class="suffix-30 mobile-suffix-30 botMessage">Hey there, Jasmine! Looks like the nearest Bank of America ATM is at <a href="https://goo.gl/maps/ViqDm3z5aU92">350 Fulton St.</a> Need any banking safety tips?</li>') );
    }
    else if ( msgInfo.whatsMessage.includes("Jay") ) {
      console.log('jay bank mobile question');
      $('#messages').append($('<li class="suffix-30 mobile-suffix-30 botMessage">There’s also a branch on wheels arriving nearby at <a href="https://goo.gl/maps/9e6EMSHgdGx">323 Jay St.</a> in 15 minutes.</li>') );
    }
    else if ( msgInfo.whatsMessage.includes("fraud") ) {
      console.log('fraud question');
      $('#messages').append($('<li class="suffix-30 mobile-suffix-30 botMessage">To protect you from financial fraud I found a checklist which you can follow to keep yourself safe and protected. Visit the checklist at <a href="http://bit.ly/zerofraud">http://bit.ly/zerofraud</a> or come visit one of our coincerges who would love to go over our fraud satefy guide with you</li>') );
    }
    else if ( msgInfo.whatsMessage.includes("QR") ) {
      console.log('QR question');
      $('#messages').append($('<li class="suffix-30 mobile-suffix-30 botMessage">Sure, tap <a href="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Wikipedia_mobile_en.svg/296px-Wikipedia_mobile_en.svg.png">this link</a> to view a QR code you can scan at the ATM for an easier transaction.</li>') );
    }
    else {
      $('#messages').append($('<li class="suffix-30 mobile-suffix-30 botMessage">').text(msgInfo.whatsMessage));
    }
  }
  else {
    $('#messages').append($('<li class="prefix-30 mobile-prefix-30 userMessage">').text(msgInfo.whatsMessage));
  }

  // scrolling on new message trick
  msgsHeight += ( $("#messages li").last().innerHeight() + 10 ) ;
  if ( msgsHeight >= $("#messages").outerHeight() ) {
    scrollMagic();
  }

});

// Show Bot is Typing
socket.on("isTyping", function(data) {
  if (data.isTyping) {
    if ( data.isBot ) {
      $('#messages').append($('<li id="botTypingMessage" class="suffix-30 mobile-suffix-30 botMessage">...</li>'));
    }
    else {
      // $('#messages').append($('<li id="userTypingMessage">user typing</li>'));
    }

    // scrolling trick for user/bot typing too
    if ( msgsHeight >= $("#messages").outerHeight() ) {
      scrollMagic();
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

function scrollMagic() {
  $("#messages").animate( {
    scrollTop: $("#messages")[0].scrollHeight - $("#messages").outerHeight()
  }, 300 );
}

$(document).ready(function(){
  $("#messages").height( $(window).height() -  130 ) ; // total height - header height (60)- footer height (50) - 20px for padding
});



// handle extra pages + button clicks
$(".pageContainer").click(function(){
    $("#pageVideoID").removeClass('pageVideo') ;
    $("#pagePhoneID").removeClass('pagePhone') ;
    $("#pageFAQID").removeClass('pageFAQ') ;
    $("#pageBankAppID").removeClass('pageBankApp') ;
});

$(".video").click(function(){
    $("#pageVideoID").addClass('pageVideo') ;
});

$(".call").click(function(){
    $("#pagePhoneID").addClass('pagePhone') ;
});

$(".faq").click(function(){
    $("#pageFAQID").addClass('pageFAQ') ;
});

$(".back").click(function(){
    $("#pageBankAppID").addClass('pageBankApp') ;
});
