chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "themeInfo":
      getThemeInfo(sendResponse);
      return true;
      break;
  }
});

function getThemeInfo(callback) {
  var status = {
    'completed': true,
    'message': ''
  }
  status.message = "Current Theme: " + globalGetThemeFolderName();
  callback(status);
}
