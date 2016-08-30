chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "purgeCodeCache":
      purgeCodeCache(sendResponse);
      break;
  }
});

function purgeCodeCache(callback) {

  if(!globalIsWordpress()) {
    var status = {
      completed: false,
      message: "Not a wordpress site"
    }
  }
  else if(!globalIsLoggedIn()) {
    var status = {
      completed: false,
      message: "Login to use this function"
    }
  }
  else {
    var status = {
      completed: true,
      message: "Code cache purged"
    }
    window.location = window.location.protocol + '//' + window.location.hostname +
      window.location.pathname + '?purge_code_cache=you_cannot_step_in_the_same_river_twice';
  }
  callback(status);
}
