chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "purgeFiles":
      purgeFiles(sendResponse, message.file);
      return true; //to let the extension know we'll be responding asynchronously
      break;
  }
});

function purgeFiles(callback, file) {
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
        message: ""
      }
      //defaults to clear tag if no file is defined.
    file = file == 'css' ? "tag:"+globalGetThemeFolderName() : file;
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
    //file could be served from cdn so purge it
    if (file.indexOf('tag:') != -1 || file.indexOf('wp-content') != -1 && (file.indexOf('freewaysites') != -1 ||
      file.indexOf('pbhs-sites') != -1)) {
      postData = '{"files":"' + file + '"}';
      globalSendRequest(url, "json;charset=utf-8", postData, function(req) {

        if (req.status != 200 && req.status != 304) {
          status.completed = false;
          status.message = "File could not be purged";
        }
        else {
          status.completed = true;
          status.message = "File has been purged";
        }
        callback(status);
        if (status.completed) location.reload();
      });
    }
    //file isn't served from cdn so don't do anything
    else {
      status.message = "Something went wrong.";
      callback(status);
      globalAlertUser(
        "This file probably isn't being served from the cdn. It can't be purged."
      );
    }
  }
}
