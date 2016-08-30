chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "mapFix":
      upgradeMap(sendResponse);
      return true;
      break;
  }
});

function upgradeMap(callback) {
  var status = {
    completed: true,
    message: "Map Replaced"
  }
  var field = "content";
  var shortCode = "";
  var originalText;
  var replacedText;
  if (window.location.pathname.indexOf("wp-admin") == -1) {
    field = "mce_58";
  }
  originalText = document.getElementById(field).value;
  replacedText = originalText.replace(
    /<div id="highlight">.*?<div id="mapContainer">.*?<\/div>.*?<\/div>/,
    "\n[MAP]");
  document.getElementById(field).value = replacedText;
  callback(status);
}
