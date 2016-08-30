//Send a POST or GET request
function globalSendRequest(url, contentType, postData, callback) {
  var req = globalCreateXMLHTTPObject();
  if (!req) return;
  var method = (postData) ? "POST" : "GET";
  req.open(method, url, true);
  if (postData) req.setRequestHeader('Content-type', contentType);
  req.onreadystatechange = function() {
    if (req.readyState == 4) callback(req);
  }
  req.send(postData);
}

var XMLHttpFactories = [

  function() {
    return new XMLHttpRequest()
  },
  function() {
    return new ActiveXObject("Msxml2.XMLHTTP")
  },
  function() {
    return new ActiveXObject("Msxml3.XMLHTTP")
  },
  function() {
    return new ActiveXObject("Microsoft.XMLHTTP")
  }
];

//Creates the correct XMLHTTP Object. Not totally necessary since this is a chrome extension, but it's good practice
function globalCreateXMLHTTPObject() {
    var xmlhttp = false;
    for (var i = 0; i < XMLHttpFactories.length; i++) {
      try {
        xmlhttp = XMLHttpFactories[i]();
      } catch (e) {
        continue;
      }
      break;
    }
    return xmlhttp;
  }

//Gets the name of the theme's directory
function globalGetThemeFolderName() {
    var themeDirectory = '';
    baseCSS = document.getElementById("pbhs-base-css");
    if (baseCSS !== null) {
      var href = baseCSS.getAttribute("href"),
        rx = /themes\/(.*?)\//i,
        arr = rx.exec(href);
      if (arr !== undefined) {
        themeDirectory = arr[1];
      } else {
        themeDirectory = "Unable to parse";
      }
    } else {
      themeDirectory = "No Theme";
    }
    return themeDirectory;
  }

//Checks if the site is wordpress by looking for the theme folder
function globalIsWordpress() {
    baseCSS = document.getElementById("pbhs-base-css");
    return baseCSS !== null;
  }

//Checks if you are logged in by looking for the logged-in class on the body
function globalIsLoggedIn() {
    return document.body.classList.contains('logged-in');
  }

//Gets the base url for the current site no matter what page you're on.
function globalGetBaseUrl() {
  var pathArray = window.location.pathname.split('/');
  var baseUrl = "//" + window.location.host;
  if (window.location.host.indexOf('freewaysites') != -1 || window.location.host
    .indexOf('pbhs-sites') != -1) {
    baseUrl = "//" + window.location.host + "/" + pathArray[1];
  }
  return baseUrl;
}

function globalGetDomainName() {
  var url = window.location.hostname;
  return url.replace("www.", "");
}

function globalIsLiveSite() {
  return window.location.host.indexOf('freewaysites') == -1 && window.location.host
    .indexOf('pbhs-sites') == -1;
}

function globalGetCSSFile() {
  baseCSS = document.getElementById("pbhs-base-css");
  return baseCSS.getAttribute("href");
}

function globalAlertUser(message) {
  alert(message);
}

function globalFullPageNotification(message) {
  var notificationDiv = document.createElement('div');
  notificationDiv.style.cssText =
    'position:fixed; top:0; right:0; bottom:0; left:0; background-color:rgba(0,0,0,0.7);z-index: 10000;';
  var notification = document.createTextNode(message);
  var notificationP = document.createElement('p');
  notificationP.style.cssText =
    'font-size: 28px; font-style: italic; color: white; position: absolute; top: 46vh; display: block; text-align: center; width: 100%;';
  notificationP.appendChild(notification);
  notificationDiv.appendChild(notificationP);
  document.body.appendChild(notificationDiv);
}

function globalShowDialogWindow(element) {
  var dialog = document.createElement("DIALOG");
  dialog.style.width = "600px";
  dialog.style.top = "20px";
  dialog.style.maxHeight = "400px";
  dialog.style.overflow = "scroll";
  dialog.setAttribute("id", "pbhsAssistantInfoWindow");
  dialog.appendChild(element);
  var closeButton = document.createElement("BUTTON")
  closeButton.innerHTML = "Close";
  closeButton.addEventListener("click", function() {
    document.body.removeChild(dialog);
  });
  closeButton.style.marginTop = '5px';
  dialog.appendChild(closeButton);
  document.body.appendChild(dialog);
  dialog.showModal();
}
