// YOUR CODE HERE:
// var message = {
//   'username': grabUsername(),
//   'text': '<script>console.log("Lindsey was here")</script>',
//   'roomname': '4chan'
// };

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
  url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt&limit=20',
  type: 'GET',
  contentType: 'application/json',
  success: function (data) {
    console.log(data);
    $('.chat').empty();
    $.each(data.results, function(i, item){
      $('.chat').append(renderMessage(item));
    });
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});
}

var sanitize = function(string){
  var re = new RegExp(/</gi);
  var string = string || "";
  return string.replace(re, "");
}

var renderMessage = function(message){
  return "<div class='message'>" + "<span class='username'>" +message.username + "</span>" + ": " + "<span class='text'>" +sanitize(message.text) + "</span>" + "</div>";
};
$( document ).ready(function() {
  $('button').on('click', function(){
    var message = $('.userMessage').val();

    var username = grabUsername();
    var messageObject = {
      'username': username,
      'text': message,
      'room': '4chan'
    };
    postMessage(messageObject);
    $('.userMessage').val("");
  });

  setInterval(retrievePost, 1000);
});
// postMessage(message);