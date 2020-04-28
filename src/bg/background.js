console.log("background.js is running");

chrome.browserAction.onClicked.addListener(btnClicked);

function btnClicked({ id }) {
  // Fallback incase we cannot grab the URL using the chrome.tabs API
  let tablink = "<PASTE_YOUR_URL_HERE>";
  chrome.tabs.getSelected(null, function (tab) {
    if (tab.url) {
      tablink = tab.url;
    }
    chrome.tabs.sendMessage(id, tablink);
  });
}

// TODO: Add a remove handler
