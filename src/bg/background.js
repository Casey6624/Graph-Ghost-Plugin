console.log("background.js is running");

chrome.browserAction.onClicked.addListener(btnClicked);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);

  chrome.tabs.create({ url: chrome.extension.getURL("notes.html") });
  sendResponse();
});

function btnClicked({ id, url }) {
  chrome.tabs.sendMessage(id, url);
}
