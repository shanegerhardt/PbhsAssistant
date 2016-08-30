chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "purgeMinified":
      purgeMinified(sendResponse);
      return true; //to let the extension know we'll be responding asynchronously
      break;
  }
});

function purgeMinified(callback) {
  if(!globalIsWordpress()) {
    var status = {
      completed: false,
      message: "Not a wordpress site"
    }
    callback(status);
  }
  else if(!globalIsLoggedIn()) {
    var status = {
      completed: false,
      message: "Login to use this function"
    }
    callback(status);
  }
  else {
    var status = {
      completed: false,
      message: "Something went wrong"
    }
    var url = '';
    if (window.location.host.indexOf('freewaysites') != -1 || window.location.host
      .indexOf('pbhs-sites') != -1) {
      var pathArray = window.location.pathname.split('/');
      url = "//" + window.location.host + "/" + pathArray[1] +
        "/wp-admin/admin-ajax.php?action=pbhsadmin&admin_action=purge_files";
    } else {
      url = "//" + window.location.host +
        "/wp-admin/admin-ajax.php?action=pbhsadmin&admin_action=purge_files";
    }
    var themeDirectory = globalGetThemeFolderName();
    postData = '{"files":"minify:' + themeDirectory + '"}';
    globalSendRequest(url, "json;charset=utf-8", postData, function(req) {
      if (req.status != 200 && req.status != 304) {
        status.completed = false;
        status.message = "Minified Files could not be purged";
      }
      else {
        status.completed = true;
        status.message = "Minified Files have been purged";
      }
      callback(status);
      if (status.completed) location.reload();
    });
  }
}
