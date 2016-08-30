chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "copyInfo":
      copy(sendResponse);
      return true;
      break;
  }
});

function copy(callback) {
  var status = {
    completed: true,
    message: 'Information Copied'
  }
  var practiceInfo = {
    "practiceName": document.getElementById('practice_name').getAttribute(
      "value"),
    "fullName": document.getElementById('full_name').getAttribute("value"),
    "lastName": document.getElementById('last_name').getAttribute("value"),
    "address": document.getElementById('address').getAttribute("value"),
    "city": document.getElementById('city').getAttribute("value"),
    "state": document.getElementById('state').getAttribute("value"),
    "zip": document.getElementsByName('zip')[0].getAttribute("value"),
    "phone": document.getElementsByName('phone')[0].getAttribute("value"),
    "fax": document.getElementById('fax').getAttribute("value"),
    "email": document.getElementsByName('email')[0].getAttribute("value"),
    "specialty": document.getElementsByName('specialty')[0].getAttribute(
      "value"),
    "nearby_locations": document.getElementsByName('nearby_locations')[0].getAttribute(
      "value")
  };
  chrome.storage.local.set({
    'practiceInfo': practiceInfo
  }, function() {
    callback(status);
  });
}
