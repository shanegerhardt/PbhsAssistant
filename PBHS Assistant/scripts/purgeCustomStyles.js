chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "purgeCustomStyles":
      purgeCustomeStyles(sendResponse);
      break;
  }
});

function purgeCustomeStyles(callback) {
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
      message: "Custom styles purged"
    }
    window.location = window.location.protocol + '//' + window.location.hostname +
      window.location.pathname + '?purge-custom-styles';
  }

  callback(status);
}
