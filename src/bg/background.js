console.log("background.js is running");

chrome.browserAction.onClicked.addListener(btnClicked);

function btnClicked({ id }) {
  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.sync.get("g-g-dState", function(items) {
      let oldValue = items["g-g-dState"];
      if (oldValue === undefined) oldValue = "false";
      let newValue = oldValue === "true" || undefined ? "false" : "true";

      chrome.storage.sync.set({ "g-g-dState": `${newValue}` }, function() {
        chrome.tabs.sendMessage(id, newValue);
      });
    });
  });
}
