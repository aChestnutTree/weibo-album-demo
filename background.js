chrome.browserAction.onClicked.addListener(function (tab) {
  var openURL = "index.html";
  chrome.tabs.create({url: openURL});
});
