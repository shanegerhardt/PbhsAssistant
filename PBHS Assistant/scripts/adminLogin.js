chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "adminLogin":
      login(message, sendResponse);
      return true;
      break;
  }
});

function login(message, callback) {
  var status = {
    completed: false,
    message: ""
  }
  if (window.location.pathname.indexOf('wp-login') == -1 && window.location.pathname
    .indexOf('login.asp') == -1) {
    window.location = globalGetBaseUrl() + "/admin";
  } else if (window.location.pathname.indexOf('login.asp') != -1) {
    chrome.storage.local.get('credentials', function(result) {
      globalFullPageNotification('Logging you into a template site...');
      document.getElementsByName('username')[0].value = result.credentials
        .tUser;
      document.getElementsByName('userpwd')[0].value = result.credentials
        .tPass;
      document.close();
      document.getElementsByName('form1')[0].submit();
      status.completed = true;
      status.message = "Logged In";
      callback(status);
    });
  } else {
    chrome.storage.local.get('credentials', function(result) {
      globalFullPageNotification('Logging you into wordpress...');
      document.getElementById('user_login').value = result.credentials.wUser;
      document.getElementById('user_pass').value = result.credentials.wPass;
      document.close();
      document.getElementById('loginform').submit();
      status.completed = true;
      status.message = "Logged In";
      callback(status);
    });
  }
}
