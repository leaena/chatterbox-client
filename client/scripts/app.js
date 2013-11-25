// YOUR CODE HERE:
var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

$.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});

var retrievePost = function(){
  $.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'GET',
  contentType: 'application/json',
  success: function (data) {
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



setInterval(retrievePost, 1000);