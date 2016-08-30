chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "seoCheckUp":
      checkSEO(sendResponse);
      return true;
      break;
  }
});

function checkSEO(callback) {
  var status = {
    notification: 0,
    completed: true,
    message: 'SEO check up: pass'
  }
  if (globalIsWordpress()) {
    var pathname = window.location.pathname;
    var contentDiv = document.getElementById("content");
    if (contentDiv != null) var contentImages = contentDiv.getElementsByTagName(
      "img");
    if (pathname.indexOf('crowns') != -1 || pathname.indexOf('bridges') != -1 ||
      pathname.indexOf('implants') != -1) {
      if (pathname.indexOf('dental-') == -1) {
        status.completed = false;
        status.notification += 1;
        status.message = 'SEO check up: fail';
        status.detail +=
          "Procedure slug is not descriptive enough, try adding dental- before the procedure slug.<br><br>";
      }
    }
    if (/.*-(\d+)/g.test(pathname)) {
      status.completed = false;
      status.notification += 1;
      status.message = 'SEO check up: fail';
      status.detail +=
        "Slug contains a -number, might not be correct.<br><br>";
    }
    if (contentImages != null) {
      for (var i = 0; i < contentImages.length; i++) {
        if (contentImages[i].alt == "") {
          status.completed = false;
          status.notification += 1;
          status.message = 'SEO check up: fail';
          status.detail += "Image: " + contentImages[i].src +
            " does not have an alt tag.<br><br>";
        }
        if (contentImages[i].naturalWidth > contentImages[i].width * 3) {
          status.completed = false;
          status.notification += 1;
          status.message = 'SEO check up: fail';
          status.detail += "Image: " + contentImages[i].src +
            " is much wider than it's display width, try a smaller image.<br><br>";
        }
      }
    }
    callback(status);
  }
}
