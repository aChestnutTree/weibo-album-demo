function getUrlParameter(sParam)
{
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)
  {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam)
    {
      return sParameterName[1];
    }
  }
}


function uidsToString(uids) {
  var uidString = "";
  if (uids instanceof Array && uids.length !== null && uids.length > 0) {
    for (var x in uids) {
      if (parseInt(x) !== 0) {
        uidString += ";" + uids[x];
      }
      else {
        uidString += uids[x];
      }
    }
  }
  return uidString;
}

function saveUids(uids) {
  var uidString = uidsToString(uids);
  chrome.storage.local.set({
    uidString: uidString
  }, function () {
    //console.log(uidString);
  });
}
