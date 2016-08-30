chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "pasteInfo":
      paste(sendResponse);
      return true;
      break;
  }
});

function paste(callback) {
    var status = {
      completed: false,
      message: "Something went wrong."
    }
    var inputs = document.getElementsByTagName('input');
    chrome.storage.local.get('practiceInfo', function(result) {
      var practiceInfo = result["practiceInfo"];
      if (practiceInfo["fullName"] != null) {
        inputs[0].value = practiceInfo["fullName"];
        fireEvent(inputs[0], 'input');
      }
      if (practiceInfo["lastName"] != null) {
        inputs[1].value = practiceInfo["lastName"];
        fireEvent(inputs[1], 'input');
      }
      if (practiceInfo["practiceName"] != null) {
        inputs[3].value = practiceInfo["practiceName"];
        fireEvent(inputs[3], 'input');
      }
      if (practiceInfo["address"] != null) {
        inputs[24].value = practiceInfo["address"];
        fireEvent(inputs[24], 'input');
      }
      if (practiceInfo["city"] != null) {
        inputs[25].value = practiceInfo["city"];
        fireEvent(inputs[25], 'input');
      }
      if (practiceInfo["state"] != null) {
        inputs[26].value = practiceInfo["state"];
        fireEvent(inputs[26], 'input');
      }
      if (practiceInfo["zip"] != null) {
        inputs[27].value = practiceInfo["zip"];
        fireEvent(inputs[27], 'input');
      }
      if (practiceInfo["phone"] != null) {
        inputs[28].value = practiceInfo["phone"];
        fireEvent(inputs[28], 'input');
      }
      if (practiceInfo["fax"] != null) {
        inputs[29].value = practiceInfo["fax"];
        fireEvent(inputs[29], 'input');
      }
      if (practiceInfo["email"] != null) {
        inputs[7].value = practiceInfo["email"];
        fireEvent(inputs[7], 'input');
      }
      if (practiceInfo["specialty"] != null) {
        inputs[5].value = practiceInfo["specialty"];
        fireEvent(inputs[29], 'input');
      }
      if (practiceInfo["nearby_locations"] != null) {
        inputs[22].value = practiceInfo["nearby_locations"];
        fireEvent(inputs[22], 'input');
      }
      status.completed = true;
      status.message = "Pasted Information";
      callback(status);
    });
  }
  //fires events for us when changing field values programmatically

function fireEvent(element, event) {
  var evt;
  if (document.createEventObject) {
    // dispatch for IE
    evt = document.createEventObject();
    return element.fireEvent('on' + event, evt);
  } else {
    // dispatch for firefox + others
    evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
  }
}
