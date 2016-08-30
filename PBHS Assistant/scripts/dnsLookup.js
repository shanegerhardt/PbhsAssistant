chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "dnsLookup":
      dnsLookup(sendResponse);
      return true; //to let the extension know we'll be responding asynchronously
      break;
  }
});

var dnsTable;

function dnsLookup(callback) {
  var status = {
    completed: false,
    message: "Something went wrong"
  }
  dnsTable = '';
  if (globalIsLiveSite()) {
    buildDnsInfoWindow();
    status.message = "Opened DNS Tool";
    status.completed = true;
    }
  else {
    status.message = "DNS Lookup is only for live sites";
  }
  callback(status);
}

function sendDnsRequest(type) {
  var domainName = globalGetDomainName();
  var url = "https://dns-api.org/" + type + "/" + domainName;

  globalSendRequest(url, "json;charset=utf-8", null, function(req) {
    if (req.status != 200 && req.status != 304) {
      status.completed = false;
      status.message = "Could Not Complete API Call";
    }
    else {
      status.completed = true;
      status.message = "DNS Records Found";
      buildDnsTableRow(req.response);
    }
  });
}

function buildDnsInfoWindow(json) {

  var div = document.createElement("DIV");

  var anyButton = document.createElement("BUTTON")
  anyButton.innerHTML = "ANY";
  anyButton.style.marginBottom = '5px';
  anyButton.addEventListener("click", function() {
    sendDnsRequest("ANY")
  });
  div.appendChild(anyButton);

  var nsButton = document.createElement("BUTTON")
  nsButton.innerHTML = "NS";
  nsButton.addEventListener("click", function() {
    sendDnsRequest("NS")
  });
  div.appendChild(nsButton);

  var mxButton = document.createElement("BUTTON")
  mxButton.innerHTML = "MX";
  mxButton.addEventListener("click", function() {
    sendDnsRequest("MX")
  });
  div.appendChild(mxButton);

  var soaButton = document.createElement("BUTTON")
  soaButton.innerHTML = "SOA";
  soaButton.addEventListener("click", function() {
    sendDnsRequest("SOA")
  });
  div.appendChild(soaButton);

  var aButton = document.createElement("BUTTON")
  aButton.innerHTML = "A";
  aButton.addEventListener("click", function() {
    sendDnsRequest("A")
  });
  div.appendChild(aButton);

  var cnameButton = document.createElement("BUTTON")
  cnameButton.innerHTML = "CNAME";
  cnameButton.addEventListener("click", function() {
    sendDnsRequest("CNAME")
  });
  div.appendChild(cnameButton);

  var txtButton = document.createElement("BUTTON")
  txtButton.innerHTML = "TXT";
  txtButton.addEventListener("click", function() {
    sendDnsRequest("TXT")
  });
  div.appendChild(txtButton);

  dnsTable = document.createElement("TABLE");
  dnsTable.style.width = '100%';
  var topTR = dnsTable.insertRow();
  var domainCol = topTR.insertCell();
  domainCol.style.border = '1px solid black';
  domainCol.style.paddingLeft = '5px';
  domainCol.appendChild(document.createTextNode('DOMAIN'));

  var typeCol = topTR.insertCell();
  typeCol.style.border = '1px solid black';
  typeCol.style.paddingLeft = '5px';
  typeCol.appendChild(document.createTextNode('TYPE'));

  var ttlCol = topTR.insertCell();
  ttlCol.style.border = '1px solid black';
  ttlCol.style.paddingLeft = '5px';
  ttlCol.appendChild(document.createTextNode('TTL'));

  var valueCol = topTR.insertCell();
  valueCol.style.border = '1px solid black';
  valueCol.style.paddingLeft = '5px';
  valueCol.appendChild(document.createTextNode('VALUE'));

  div.appendChild(dnsTable);
  globalShowDialogWindow(div);
}

function buildDnsTableRow(json) {
  obj = JSON.parse(json);
  if(obj[0].error === undefined) {
    for(var i = 0; i < obj.length; i++) {
      var row = dnsTable.insertRow(1);
      var domainCol = row.insertCell();
      domainCol.style.border = '1px solid black';
      domainCol.style.padding = '10px 10px 10px 5px';
      domainCol.appendChild(document.createTextNode(obj[i].name));

      var typeCol = row.insertCell();
      typeCol.style.border = '1px solid black';
      typeCol.style.padding = '10px 10px 10px 5px';
      typeCol.appendChild(document.createTextNode(obj[i].type));

      var ttlCol = row.insertCell();
      ttlCol.style.border = '1px solid black';
      ttlCol.style.padding = '10px 10px 10px 5px';
      ttlCol.appendChild(document.createTextNode(obj[i].ttl));

      var valueCol = row.insertCell();
      valueCol.style.border = '1px solid black';
      valueCol.style.padding = '10px 10px 10px 5px';
      valueCol.innerHTML = obj[i].value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  }
  else {
    alert("No record found for this type");
  }
}
