// YOUR CODE HERE:
// var message = {
//   'username': grabUsername(),
//   'text': '<script>console.log("Lindsey was here")</script>',
//   'roomname': '4chan'
// };
var rooms = {};
var currentRoom;
var currentRoomUrl;

var grabUsername = function(){
  var re = new RegExp(/(&|\?)username=/);
  var string = window.location.search;
  return string.replace(re, "");
}

var postMessage = function(message){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.log(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

var retrievePost = function(){
  $.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt&limit=20' + (currentRoomUrl || ""),
  type: 'GET',
  contentType: 'application/json',
  success: function (data) {
    console.log(data);
    $('.chat').empty();
    $.each(data.results, function(i, item){
      $('.chat').append(renderMessage(item));
      // get rooms
      rooms[item.roomname] = true;
    });
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});
}

var getRoom = function(room){

  currentRoom = room;
  currentRoomUrl ='&where={"roomname":"' + room + '"}';
}

var sanitize = function(string){
  var re = new RegExp(/</gi);
  var string = string || "";
  string = string.replace(re, "");
  return string.replace(/$/gi, "");
}

var renderMessage = function(message){
  return "<div class='message'>" + "<span class='username'>" +sanitize(message.username) + "</span>" + ": " + "<span class='text'>" + sanitize(message.text) + "</span>" + "</div>";
};
$( document ).ready(function() {

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
    getRoom($(this).text());
  })

  // create room
  $('.newRoom').on('click', function(){
    var room = prompt("What do you want to call this room?");
    rooms[room] = true;
  })

  // user message submit
  $('.submit').on('click', function(){
    var message = $('.userMessage').val();
    var username = grabUsername();
    var messageObject = {
      'username': username,
      'text': message,
      'roomname': (currentRoom || '')
    };
    postMessage(messageObject);
    $('.userMessage').val("");
  });

  // new message retrieval
  setInterval(retrievePost, 1000);
});
// postMessage(message);