console.log("background.js is running");

chrome.browserAction.onClicked.addListener(btnClicked);

//receive message
chrome.runtime.onMessage((message, sender) => {
  console.log("Message sent");
  chrome.tabs.create({ url: "NEW URL" }, tab => {
    setTimeout(() => {
      //use your message data here.
      chrome.tabs.executeScript(tab.id, {
        code: "document.title = message.title"
      });
    }, 3000);
  });
});

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
