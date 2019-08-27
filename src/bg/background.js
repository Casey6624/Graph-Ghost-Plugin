chrome.browserAction.onClicked.addListener(function(tab) {
  //chrome.tabs.executeScript(null, { file: "./startSelection.js" });
  chrome.storage.sync.get("g-g-dState", function(items) {
    console.log("old val " + items["g-g-dState"]);
    let newValue = items["g-g-dState"] === "true" ? "false" : "true";

    chrome.storage.sync.set({ "g-g-dState": `${newValue}` }, function() {
      console.log("new val " + newValue);
    });
  });
});
