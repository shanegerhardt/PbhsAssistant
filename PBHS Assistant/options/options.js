function loadCredentials() {
  chrome.storage.local.get('credentials', function(result) {
    if (!isEmpty(result)) {
      $("#wordpress-username").val(result.credentials.wUser);
      $("#wordpress-password").val(result.credentials.wPass);
      $("#template-username").val(result.credentials.tUser);
      $("#template-password").val(result.credentials.tPass);
    }
  });
  $("#save").click(function() {
    saveOptions();
  });
  $("#erase").click(function() {
    eraseOptions();
  });
}

function saveOptions() {
  var credentials = {
    'wUser': $("#wordpress-username").val(),
    'wPass': $("#wordpress-password").val(),
    'tUser': $("#template-username").val(),
    'tPass': $("#template-password").val(),
  };
  chrome.storage.local.set({
    'credentials': credentials
  }, function() {
    if(chrome.runtime.lastError == null){
      saveSuccess('#save');
      console.log('Credentials Saved');
    }
    else {
      saveError('#save');
      console.log('Error saving credentials');
    }
  });
}

function eraseOptions() {
  var credentials = {};
  chrome.storage.local.set({
    'credentials': credentials
  }, function() {
    if(chrome.runtime.lastError == null){
      saveSuccess('#erase');
      console.log('Credentials Deleted');
    }
    else {
      saveError('#erase');
      console.log('Error deleting credentials');
    }
  });
}

function saveLayout() {
  layout = [];
  localStorage["seoCheckUp"] = false;
  $('input:checkbox').each(function() {
    if (this.checked) {
      layout.push({
        'name': $(this).attr('name'),
        'title': $(this).attr('data-title'),
        'type': $(this).attr('data-type')
      });
      if ($(this).attr('name') == 'seoCheckUp') {
        localStorage["seoCheckUp"] = true;
      }
    }
  });
  chrome.storage.local.set({
    'layout': layout
  }, function() {
    if(chrome.runtime.lastError == null){
      saveSuccess('#layoutSave');
      console.log('Layout saved');
    }
    else {
      saveError('#layoutSave');
      console.log('Error saving layout');
    }

  });
  return true;
}

function saveSuccess(id) {
  $(id).addClass('saved-success');
}

function saveError(element) {
  $(element).addClass('saved-error');
}

function loadLayout() {
  $("#layoutSave").click(function() {
    saveLayout();
  });
  $.getJSON("plugins.json", function(data) {
    data = data.plugins[0];
    var layoutSection = $('.flex-row', '#layoutSection');
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var option =
          "<div class=\"checkbox\"><input type=\"checkbox\" id=\"layout" +
          key + "\" name=\"" + key + "\" data-title=\"" + data[key][
            "title"
          ] + "\" data-type=\"" + data[key]["type"] +
          "\"><label for=\"layout" + key +
          "\"><div class=\"layout-container\"><div class=\"layout-title\">" +
          data[key]["title"] +
          "</div><div class=\"layout-description well\">" + data[key][
            "description"
          ] +
          "<i class=\"fa fa-check layout-enabled\"></i><i class=\"fa fa-times layout-disabled\"></i></div></div></label></div>";
        $(layoutSection).append(option);
      }
    }
  });
  showSelectedBoxes();
}

function showSelectedBoxes() {
  chrome.storage.local.get('layout', function(result) {
    for (var key in result["layout"]) {
      if (result["layout"].hasOwnProperty(key)) {
        $("input[name='" + result["layout"][key]["name"] + "']").prop(
          'checked', true);
      }
    }
  });
}

function loadContent(url) {
  $("#content").empty();
  $("#content").load(url, function() {
    switch (url) {
      case "parts/layout.html":
        loadLayout();
        break;
      case "parts/user-info.html":
        loadCredentials();
        break;
    }
    $(".btn").on(
        "webkitAnimationEnd animationend",
        function() {
            $(this).removeClass("saved-success");
            $(this).removeClass("saved-error");
        }
    );
  });
}
$(function() {
  loadContent("parts/about.html");
  $("a", ".sidebar-nav").click(function(e) {
    e.preventDefault();
    var clickedLink = $(this);
    $("a.active", ".sidebar-nav").removeClass('active');
    loadContent(clickedLink.attr("href"));
    clickedLink.addClass('active');
  });
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
});

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true && JSON.stringify(obj) === JSON.stringify({});
}
