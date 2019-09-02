chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.sync.get("g-g-dState", function(items) {
    let oldValue = items["g-g-dState"];
    if (oldValue === undefined) oldValue = "false";
    console.log("old val " + oldValue);
    let newValue = oldValue === "true" || undefined ? "false" : "true";

    chrome.storage.sync.set({ "g-g-dState": `${newValue}` }, function() {
      console.log("new val " + newValue);
      if (newValue === "true")
        chrome.tabs.executeScript(null, { file: "./startSelection.js" });
    });
  });
});

chrome.browserAction.onClicked.addListener(btnClicked);

function btnClicked(tab) {
  console.log("Start editing");

  chrome.tabs.sendMessage(tab.id, true);
}
