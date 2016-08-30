chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "themeView":
      viewTheme(message.number);
      break;
  }
});

function viewTheme(themeNumber) {
  globalFullPageNotification("Navigating to Template #" + themeNumber);
  if(themeNumber.indexOf("212") !== -1) {
    window.location = "//www.freewaysites.com/dental/?theme=2120-template&theme_version=" + themeNumber +
      "-template";
  }
  else {
    window.location = "//www.freewaysites.com/oms/?theme=" + themeNumber +
      "-template&preset=Default";
  }

  void(0);
}
