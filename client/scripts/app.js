// YOUR CODE HERE:
var rooms = {};
var currentRoom;
var currentRoomUrl;
var friends = [];

/*
* HELPER FUNCTIONS
*/
var getRoom = function(room){
  currentRoom = room;
  currentRoomUrl ='&where={"roomname":"' + room + '"}';
}

var grabUsername = function(){
  var re = new RegExp(/(&|\?)username=/);
  var string = window.location.search;
  return string.replace(re, "");
}

var sanitize = function(string){
  // var re = new RegExp(/(<([^>]+)>)/ig);
  var re = new RegExp(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/);
  var string = string || "";
  if(string.length > 160){
    string = string.slice(0,159);
  }
  return string.match(re);
}
var sanitizeRoom = function(string){
  var re = new RegExp(/(<([^>]+)>)/ig);
  // var re = new RegExp(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/);
  var string = string || "";
  if(string.length > 160){
    string = string.slice(0,159);
  }
  return string.replace(re, "");
}


/*
* CRUD FUNCTIONS
*/
var Chat = function(){

};

Chat.prototype.post = function(options){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: options.data,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

Chat.prototype.get = function(options){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt&limit=20' + (currentRoomUrl || ""),
    type: 'GET',
    contentType: 'application/json',
    success: options.success,
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

var renderMessage = function(message){
  var userText;
  var messageText;
  if(friends.indexOf(message.username) !== -1){
    userText = "<strong>" + sanitize(message.username) + "</strong>";
    messageText = "<strong>" + sanitize(message.text) + "</strong>";
  }
  return "<div class='message'>" + "<span class='username'>" + (userText || sanitize(message.username)) + "</span>" + ": " + "<span class='text'>" + (messageText || sanitize(message.text)) + "</span>" + "</div>";
};


/*
* VIEWS
*/
var NewChatView = function(options){
  // user message submit
  this.chat = options.chat;
  var addMessage = $.proxy(this.addMessage, this);
  var getMessages = $.proxy(this.getMessages, this);
  $('.submit').on('click', addMessage);
  setInterval(getMessages, 1000);
}

NewChatView.prototype.addMessage = function(){
  var message = $('.userMessage').val();
  var username = grabUsername();
  var messageObject = {
    'username': username,
    'text': message,
    'roomname': (currentRoom || '')
  };
  this.chat.post({
    data: JSON.stringify(messageObject)
  });
  $('.userMessage').val("");
};

NewChatView.prototype.getMessages = function(){
  this.chat.get({
    success: function (data) {
      $('.chat').empty();
      $.each(data.results, function(i, item){
        $('.chat').append(renderMessage(item));
        // get rooms
        if(item.roomname && sanitizeRoom(item.roomname) === item.roomname){
          rooms[item.roomname] = true;
        }
      });
    }
  });
}

/*
* EVENT LISTENERS
*/
$(document).ready(function() {
  // new message retrieval
  var chat = new Chat();
  new NewChatView({chat: chat});

  // render rooms
  setInterval(function(){
    $('ul').empty();
    $.each(Object.keys(rooms), function(i, room){
      var link = '<li><a class="roomname">' + room + "</a></li>";
      $(".rooms").append(link);
    });
  }, 1000);

  // room entry
  $('ul').on('click', 'a', function(){
    $('.roomTitle').text(" - " + $(this).text());
    getRoom($(this).text());
  })

  // create room
  $('.newRoom').on('click', function(){
    var room = prompt("What do you want to call this room?");
    rooms[room] = true;
  })

  //reset rooms
  $('h1').on('click', function(){
    $('.roomTitle').text('');
    currentRoomUrl = undefined;
  });

  $('.chat').on('click', '.username', function(){
    friends.push($(this).text());
  });
  
});