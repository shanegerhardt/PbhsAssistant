window.buttons = {};
window.statuses = {};
window.tools = {};
window.onload = function() {
  buildOptions();
  /* To add new features go to plugins.json and follow the format
   * Then in this file created a variable for your button
   * and create an onclick function to activate your content
   * script
   */
};
//grabs selected features from the options page creates the interface
function buildOptions() {
  chrome.storage.local.get('layout', function(result) {
    //Create interface
    for (var key in result["layout"]) {
      if (result["layout"].hasOwnProperty(key)) {
        item = result["layout"][key];
        createInterfaceItem(item["name"], item["title"], item["type"]);
      }
    }
    //Update statuses
    for (var key in statuses) {
      if (statuses.hasOwnProperty(key)) {
        statusUpdate(key);
      }
    }
  });
}

function createInterfaceItem(name, title, type) {
  var element;
  switch (type) {
    case 'button':
      element = document.createElement("BUTTON");
      var text = document.createTextNode(title);
      element.appendChild(text);
      element.setAttribute("id", name + "Button");
      element.dataset.name = name;
      element.dataset.title = title;
      element.dataset.type = type;
      document.getElementById('loaded-buttons').appendChild(element);
      buttons[name] = document.getElementById(name + 'Button');
      if (buttons[name] !== null) {
        buttons[name].addEventListener("click", buttonClick);
      }
      break;
    case 'status':
      element = document.createElement("P");
      element.setAttribute("id", name + "Status");
      element.className = "status";
      element.dataset.name = name;
      element.dataset.title = title;
      element.dataset.type = type;
      document.getElementById('loaded-status').appendChild(element);
      statuses[name] = document.getElementById(name + 'Status');
      break;
    case 'tool':
      element = document.createElement("BUTTON");
      var text = document.createTextNode(title);
      element.appendChild(text);
      element.setAttribute("id", name + "Button");
      element.dataset.name = name;
      element.dataset.title = title;
      element.dataset.type = type;
      document.getElementById('loaded-buttons').appendChild(element);
      tools[name] = document.getElementById(name + 'Button');
      if (tools[name] !== null) {
        tools[name].addEventListener("click", toolClick);
      }
      break;
  }
}

function printDetail(parent, detail) {
  var element = document.createElement("SPAN");
  element.innerHTML = detail;
  element.className = "detail";
  parent.appendChild(element);
}

function buttonClick(e) {
  e = e || window.event;
  var element = e.target;
  element.className = "loading";
  chrome.extension.sendMessage({
    type: element.dataset.name
  }, function(status) {
    if (status.completed) {
      element.innerHTML = status.message;
    } else {
      element.innerHTML = status.message;
      element.className = "error";
    }
  });
}

function toolClick(e) {
  e = e || window.event;
  var element = e.target;
  element.className = "loading";
  chrome.extension.sendMessage({
    type: element.dataset.name
  }, function(status) {
    if (status.completed) {
      element.innerHTML = status.message;
      window.close();
    } else {
      element.innerHTML = status.message;
      element.className = "error";
    }
  });
}

function statusUpdate(name) {
  chrome.extension.sendMessage({
    type: name
  }, function(status) {
    if (status != null) {
      var element = document.getElementById(name + "Status");
      element.innerHTML = status.message;
      if (status.detail != null) {
        printDetail(element, status.detail);
      }
    }
  });
}
