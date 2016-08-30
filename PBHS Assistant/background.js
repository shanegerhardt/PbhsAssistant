//Listens for omnibox commands
chrome.omnibox.onInputEntered.addListener(function(text) {
  if (!isNaN(parseFloat(text)) && isFinite(text)) {
    chrome.tabs.executeScript(null, {file: 'scripts/themeView.js'}, function(){
      paFunctions['themeView'](text);
    });
  }
});
//Listens for keyboard shortcuts
chrome.commands.onCommand.addListener(function(command) {
  try {
    chrome.tabs.executeScript(null, {file: 'scripts/'+command+'.js'}, function(){
        paFunctions[command]();
      });
  } catch (e) {
    console.log("Error: unregistered function");
  }
  return true;
});
//Listens for events comping from popup.js
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  try {
    chrome.tabs.executeScript(null, {file: 'scripts/'+request.type+'.js'}, function(){
      paFunctions[request.type](function(status) {
        sendResponse(status);
      });
    });
  } catch (e) {
    sendResponse({
      completed: false,
      message: "Unregistered function"
    });
  }
  return true;
});

var paFunctions = {
  "adminLogin" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "adminLogin"
        }, respond);
      }
    });
  },
  "comboVideoUpgrade" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "comboVideoUpgrade"
        }, respond);
      }
    });
  },
  "mapFix" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "mapFix"
        }, respond);
      }
    });
  },
  "ulFix" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "ulFix"
        }, respond);
      }
    });
  },
  "themeView" : function(templateNumber) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "themeView",
          number: templateNumber
        });
      }
    });
  },
  "themeInfo" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "themeInfo"
        }, respond);
      }
    });
  },
  "copyInfo" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "copyInfo"
        }, respond);
      }
    });
  },
  "pasteInfo" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "pasteInfo"
        }, respond);
      }
    });
  },
  "purgeCustomStyles" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "purgeCustomStyles"
        }, respond);
      }
    });
  },
  "purgeFiles" : function(respond, file) {
    file = typeof file !== 'undefined' ? file : 'css';
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "purgeFiles",
          file: file
        }, respond);
      }
    });
  },
  "purgeMinified" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "purgeMinified"
        }, respond);
      }
    });
  },
  "seoCheckUp" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "seoCheckUp"
        }, function(status) {
          if (status != null) {
            if (!status.completed) {
              chrome.browserAction.setBadgeText({
                text: status.notification.toString(),
                tabId: tab.id
              });
            }
          }
          respond(status);
        });
      }
    });
  },
  "dnsLookup" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "dnsLookup"
        }, respond);
      }
    });
  },
  "purgeCodeCache" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "purgeCodeCache"
        }, respond);
      }
    });
  },
  "liveWidgetView" : function(respond) {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, {
          type: "liveWidgetView"
        }, respond);
      }
    });
  }
};


//Clears stored practice information to prevent pasting the wrong information
function loadedInfo() {
    localStorage.removeItem("practiceName");
    localStorage.removeItem("fullName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("address");
    localStorage.removeItem("city");
    localStorage.removeItem("state");
    localStorage.removeItem("zip");
    localStorage.removeItem("phone");
    localStorage.removeItem("fax");
    localStorage.removeItem("email");
    localStorage.removeItem("specialty");
    localStorage.removeItem("nearby_locations");
    return true;
  }
  //Stores copied practice information so that it can be pasted into the new site

function setLocalStorage(info) {
  localStorage["practiceName"] = info[0];
  localStorage["fullName"] = info[1];
  localStorage["lastName"] = info[2];
  localStorage["address"] = info[3];
  localStorage["city"] = info[4];
  localStorage["state"] = info[5];
  localStorage["zip"] = info[6];
  localStorage["phone"] = info[7];
  localStorage["fax"] = info[8];
  localStorage["email"] = info[9];
  localStorage["specialty"] = info[10];
  localStorage["nearby_locations"] = info[11];
  return true;
}
chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.url.indexOf('wp-login.php?redirect_to') != -1) {
    chrome.tabs.executeScript(null, {file: 'scripts/'+'adminLogin'+'.js'}, function(){
        paFunctions.adminLogin(function(response) {});
      });
  }
  if (localStorage["seoCheckUp"] == 'true') {
    chrome.tabs.executeScript(null, {file: 'scripts/'+'seoCheckUp'+'.js'}, function(){
        paFunctions.seoCheckUp(function(response) {});
      });
  }
});

function rightClickHandler(info, tab) {
  switch (info.menuItemId) {
    case "contextimage":
    chrome.tabs.executeScript(null, {file: 'scripts/'+'purgeFiles'+'.js'}, function(){
        paFunctions.purgeFiles(function(response) {}, info.srcUrl);
      });
      break;
  }
};
chrome.contextMenus.onClicked.addListener(rightClickHandler);
chrome.runtime.onInstalled.addListener(function() {
  var context = "image";
  var title = "Purge image";
  var id = chrome.contextMenus.create({
    "title": title,
    "contexts": [context],
    "id": "context" + context
  });
});

function currentExtensionVersion() {
  return chrome.runtime.getManifest().version;
}

function migrateSettings() {
  var credentials = {
    'wUser': localStorage["wUser"],
    'wPass': localStorage["wPass"],
    'tUser': localStorage["tUser"],
    'tPass': localStorage["tPass"],
  };
  chrome.storage.local.set({
    'credentials': credentials
  }, function() {
    console.log('Credentials Migrated');
  });
  var layoutKey = {
    'login': {
      'name': 'adminLogin',
      'title': 'Auto Login',
      'type': 'button'
    },
    'videos': {
      'name': 'comboVideoUpgrader',
      'title': 'Video Upgrader',
      'type': 'button'
    },
    'maps': {
      'name': 'mapFix',
      'title': 'Map Fix',
      'type': 'button'
    },
    'ul': {
      'name': 'ulFix',
      'title': 'Fix Lists',
      'type': 'button'
    },
    'copypaste': {
      'name': 'copyPasteInfo',
      'title': 'Copy/Paste Info',
      'type': 'button'
    },
    'purge': {
      'name': 'purgeCustomStyles',
      'title': 'Purge Custom Styles',
      'type': 'button'
    },
    'purgeFiles': {
      'name': 'purgeFiles',
      'title': 'Purge theme.css',
      'type': 'button'
    },
    'purgeMinified': {
      'name': 'purgeMinified',
      'title': 'Purge Minified Files',
      'type': 'button'
    },
    'seoCheckUp': {
      'name': 'seoCheckUp',
      'title': 'SEO Check Up',
      'type': 'status'
    }
  }
  var layout = {};
  for (var option of JSON.parse(localStorage["layout"])) {
    layout[String(layoutKey[option['name']]['name'])] = {
      'name': layoutKey[option['name']]['name'],
      'title': layoutKey[option['name']]['title'],
      'type': layoutKey[option['name']]['type']
    };
  }
  layout["themeInfo"] = {
    'name': 'themeInfo',
    'title': 'Theme Info',
    'type': 'status'
  };
  chrome.storage.local.set({
    'layout': layout
  }, function() {
    console.log('Layout Migrated');
  });
}

function versionCheck() {
  chrome.storage.local.get('version', function(result) {
    if (!isEmpty(result)) {
      console.log('Version Set');
    } else {
      var version = {
        "number": currentExtensionVersion
      }
      chrome.storage.local.set({
        'version': version
      }, function() {
        migrateSettings();
      });
    }
  });
}

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true && JSON.stringify(obj) === JSON.stringify({});
}
versionCheck();
