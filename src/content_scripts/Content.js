let finishedAttributes = [];
let attributes = [];

let btnSubmit, btnCancel, btnAddAttri, counterLabel, txtAttri;

// this will be eventually be https://graphghost.co.uk/api or something similar
const NODE_SERVER = "http://127.0.0.1:4500/crawlme";

/* chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval); */

// Add a listener to listen to the message from background.js
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
  // set up submit button if not defined
  if (btnSubmit === undefined) {
    document.addEventListener("click", e => selectingEntities(e));
    btnSubmit = document.createElement("div");
    btnSubmit.setAttribute("id", "g-g-d-Submit");
    btnSubmit.innerHTML = "Done";
    document.body.appendChild(btnSubmit);
    btnSubmit.addEventListener("click", function() {
      postToServer();
    });
  }
  // set up cancel button if not defined
  if (btnCancel === undefined) {
    // Cancel Actions
    btnCancel = document.createElement("div");
    btnCancel.setAttribute("id", "g-g-d-Cancel");
    btnCancel.innerHTML = "Cancel";
    document.body.appendChild(btnCancel);
    btnCancel.addEventListener("click", function() {
      // Here we want to set localStorage to "false" as we want to stop using the editor mode
      chrome.storage.sync.set({ "g-g-dState": "false" }, function() {
        console.log("Graph Ghost is closing...");
        clearEntitiesAndStyling();
        removeButtonsAndListeners();
        document.removeEventListener("click", e => selectingEntities(e));
      });
    });
  }
  // set up cancel button if not defined
  if (txtAttri === undefined) {
    // Cancel Actions
    txtAttri = document.createElement("input");
    txtAttri.setAttribute("id", "g-g-d-txtAttri");
    txtAttri.type = "text";
    txtAttri.placeholder = "Attribute Name";
    document.body.appendChild(txtAttri);
  }
  // set up cancel button if not defined
  if (btnAddAttri === undefined) {
    // Cancel Actions
    btnAddAttri = document.createElement("div");
    btnAddAttri.setAttribute("id", "g-g-d-addAttri");
    btnAddAttri.innerHTML = "Add";
    document.body.appendChild(btnAddAttri);
    btnAddAttri.addEventListener("click", function() {});
  }
  // set up counter if not defined
  if (counterLabel === undefined) {
    // Counter Actions
    counterLabel = document.createElement("div");
    counterLabel.setAttribute("id", "g-g-d-Counter");
    counterLabel.innerHTML = `${entities.length} entities Selected`;
    document.body.appendChild(counterLabel);
  }
}

function removeButtonsAndListeners() {
  console.log("removing event listener!");
  document.removeEventListener("click", e => selectingEntities(e));
  if (btnSubmit !== undefined) {
    btnSubmit.removeEventListener("click");
  }
  if (btnSubmit !== undefined) {
    btnCancel.removeEventListener("click");
  }
  if (btnSubmit.parentNode !== undefined) {
    btnSubmit.parentNode.removeChild(btnSubmit);
    btnSubmit = undefined;
  }
  if (btnCancel.parentNode !== undefined) {
    btnCancel.parentNode.removeChild(btnCancel);
    btnCancel = undefined;
  }
  if (counterLabel.parentNode !== undefined) {
    counterLabel.parentNode.removeChild(counterLabel);
    counterLabel = undefined;
  }
}

function validateAttrName() {
  if (txtAttri.value.trim() === "") return false;
  const conditions = [
    "!",
    "?",
    " ",
    "*",
    "/",
    "\\",
    "`",
    "#",
    "~",
    "=",
    "+",
    "-"
  ];
  const testInput = conditions.some(cond => txtAttri.value.includes(cond));
  // if false then contains illegal characters
  return !testInput;
}

function clearEntitiesAndStyling() {
  entities.forEach(function({ style }, index) {
    // remove styling and clear entities array
    style.border = "none";
    style.padding = "0rem";
  });
  entities = [];
}

function postToServer() {
  const validAttrName = validateAttrName();
  console.log(validAttrName);

  let data = { entityName: txtAttri.value, entities: [...entities] };
  chrome.runtime.sendMessage(JSON.stringify(data));
  return;
  chrome.runtime.sendMessage({ entities: entities });
  /*         const data = {
          entities: entities,
          // This needs changing to be dynamic via the google tabs API
          url: "http://localhost/ggd/index.html"
        };
        fetch(NODE_SERVER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(response => console.log("Success: ", JSON.stringify(response)))
          .catch(err => {
            return err;
          }); */
}

console.log("Content Script is running");

function updateCounter() {
  if (counterLabel === undefined) return;
  counterLabel.innerHTML = `${entities.length} entities Selected`;
}

const selectingEntities = function({ target }) {
  if (
    target.id === "g-g-d-Submit" ||
    target.id === "g-g-d-Cancel" ||
    target.id === "g-g-d-Counter" ||
    target.id === "g-g-d-txtAttri" ||
    target.id === "g-g-d-addAttri" ||
    target.nodeName === "HTML" ||
    target.nodeName === "BODY"
  )
    return;
  // Check if item already exists in array, remove it if so
  if (entities.includes(target)) {
    entities = entities.filter(el => el !== target);
    updateCounter();
    target.style.border = "";
    target.style.padding = "";
    console.log(entities);
    return;
  }
  // Add the new item as it is not in the array
  entities.push(target);
  console.log(entities);
  updateCounter();
  target.style.border = "2px double red";
  target.style.padding = "0.5rem";
};
//}
/*   }, 10); */
