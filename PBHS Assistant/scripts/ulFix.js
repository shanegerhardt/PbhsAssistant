chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "ulFix":
      fixUL(sendResponse);
      return true;
      break;
  }
});

function fixUL(callback) {
  var status = {
    completed: false,
    message: "Something went wrong."
  }
  var field = "content";
  originalText = document.getElementById(field).value;
  replacedText = originalText.replace(/&#13;/g, "");
  document.getElementById(field).value = replacedText;
  if (replacedText.indexOf("&#13;") == -1) {
    status.completed = true;
    status.message = "List Fixed"
  }
  callback(status);
}
