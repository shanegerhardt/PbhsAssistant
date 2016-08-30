chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "liveWidgetView":
      liveWidgetView(sendResponse);
      break;
  }
});

function liveWidgetView(callback) {
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
      message: "Loading Live Widgets"
    }
    window.location = globalGetBaseUrl() + '/wp-admin/customize.php?autofocus%5Bpanel%5D=widgets&return=%2Fwp-admin%2Fwidgets.php';
  }

  callback(status);
}
