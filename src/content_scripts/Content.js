let elements = [];
let state = false;

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
  console.log(message);
}

console.log("Content Script is running");

const submitButton = document.createElement("div");
submitButton.setAttribute("id", "g-g-d-Submit");
submitButton.innerHTML = "Create GraphQL API";
document.body.appendChild(submitButton);
document.getElementById("g-g-d-Submit").addEventListener("click", function() {
  console.log("Submitting to Server");
});

// Cancel Actions
const cancelButton = document.createElement("div");
cancelButton.setAttribute("id", "g-g-d-Cancel");
cancelButton.innerHTML = "Cancel";
document.body.appendChild(cancelButton);
document.getElementById("g-g-d-Cancel").addEventListener("click", function() {
  // Here we want to set localStorage to "false" as we want to stop using the editor mode
  chrome.storage.sync.set({ "g-g-dState": "false" }, function() {
    console.log("Graph Ghost is closing...");
  });
});

// Counter Actions
const counterLabel = document.createElement("div");
counterLabel.setAttribute("id", "g-g-d-Counter");
counterLabel.innerHTML = `${elements.length} Elements Selected`;
document.body.appendChild(counterLabel);
document.getElementById("g-g-d-Counter").addEventListener("click", function() {
  console.log("Cancelling API Creation");
});
// Submit Actions

function checkIfEditing() {
  chrome.storage.sync.get("g-g-dState", function(items) {
    if (items["g-g-dState"] === "true") state = true;
  });
}

function updateCounter() {
  counterLabel.innerHTML = `${elements.length} Elements Selected`;
}

// Code to handle the selection
document.addEventListener("click", function(e) {
  // Validation
  if (
    e.target.id === "g-g-d-Submit" ||
    e.target.id === "g-g-d-Cancel" ||
    e.target.id === "g-g-d-Counter" ||
    e.target.nodeName === "HTML" ||
    e.target.nodeName === "BODY"
  )
    return;
  // Check if item already exists in array, remove it if so
  if (elements.includes(e.target)) {
    elements = elements.filter(el => el !== e.target);
    updateCounter();
    e.target.style.border = null;
    e.target.style.padding = null;
    console.log(elements);
    return;
  }
  // Add the new item as it is not in the array
  elements.push(e.target);
  console.log(elements);
  updateCounter();
  e.target.style.border = "2px double red";
  e.target.style.padding = "0.5rem";
});
