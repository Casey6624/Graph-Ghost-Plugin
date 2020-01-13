console.log("background.js is running");

chrome.browserAction.onClicked.addListener(btnClicked);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);

  chrome.tabs.create({ url: chrome.extension.getURL("notes.html") });
  sendResponse();
});

function btnClicked({ id }) {
  chrome.storage.sync.get("g-g-dState", function(items) {
    let oldValue = items["g-g-dState"];
    if (oldValue === undefined) oldValue = "false";
    let newValue = oldValue === "true" || undefined ? "false" : "true";

    chrome.storage.sync.set({ "g-g-dState": `${newValue}` }, function() {
      chrome.tabs.sendMessage(id, newValue);
    });
  });
}
