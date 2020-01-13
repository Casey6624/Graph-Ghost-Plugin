let entities = [];
let finishedEntities = [];

let btnSubmit, btnCancel, btnAddAttri, counterLabel, txtAttri;

let currUrl = "";

// this will be eventually be https://graphghost.co.uk/api or something similar
const NODE_SERVER = "http://localhost:4500/crawl-me";

/* chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval); */

// Add a listener to listen to the message from background.js
chrome.runtime.onMessage.addListener(messageFromBackgroundjs);

function btnCancelHandler() {
  removeButtonsAndListeners();
}

function btnSubmitHandler() {
  postToServer();
}

function btnAddHandler() {
  console.log("add handler triggered!");
  if (txtAttri.value === "") {
    // TODO: add validation
    console.log("this cannot be empty");
    return;
  }
  let tempArr = [...entities];
  let data = { entityName: txtAttri.value, attributes: [...tempArr] };

  finishedEntities.push(data);
  entities.forEach(({ style }) => {
    style.border = "2px double black";
    style.background = "#f2f2f2";
  });

  entities = [];
  txtAttri.value = "";
  txtAttri.textContent = "";

  console.log("finishedEntities");
  console.log(finishedEntities);
}

function messageFromBackgroundjs({ id, url }, sender, sendResponse) {
  currUrl = url;
  // set up submit button if not defined
  document.addEventListener("click", e => selectingEntities(e));
  if (btnSubmit === undefined) {
    btnSubmit = document.createElement("div");
    btnSubmit.setAttribute("id", "g-g-d-Submit");
    btnSubmit.innerHTML = "Done";
    document.body.appendChild(btnSubmit);
    btnSubmit.addEventListener("click", btnSubmitHandler);
  }
  // set up cancel button if not defined
  if (btnCancel === undefined) {
    // Cancel Actions
    btnCancel = document.createElement("div");
    btnCancel.setAttribute("id", "g-g-d-Cancel");
    btnCancel.innerHTML = "Cancel";
    document.body.appendChild(btnCancel);
    btnCancel.addEventListener("click", btnCancelHandler);
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
    btnAddAttri.addEventListener("click", btnAddHandler);
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
  console.log("Removing plugin event listeners and controls");
  document.removeEventListener("click", selectingEntities);
  if (btnSubmit !== undefined) {
    btnSubmit.removeEventListener("click", btnSubmitHandler);
  }
  if (btnSubmit !== undefined) {
    btnCancel.removeEventListener("click", btnCancelHandler);
  }
  if (btnAddAttri !== undefined) {
    btnAddAttri.removeEventListener("click", btnAddHandler);
  }
  if (btnSubmit.parentNode !== undefined) {
    btnSubmit.parentNode.removeChild(btnSubmit);
    btnSubmit = undefined;
  }
  if (txtAttri.parentNode !== undefined) {
    txtAttri.parentNode.removeChild(txtAttri);
    txtAttri = undefined;
  }
  if (btnAddAttri.parentNode !== undefined) {
    btnAddAttri.parentNode.removeChild(btnAddAttri);
    btnAddAttri = undefined;
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

// return truthy falsey depending on whether the validation passes
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

function postToServer() {
  if (finishedEntities.length === 0) {
    // TODO: Add validation message here
    console.log("You need to add at least one entity!");
    return;
  }

  const data = {
    entities: [...finishedEntities],
    // This needs changing to be dynamic via the google tabs API
    url: currUrl
  };
  fetch(NODE_SERVER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      return err;
    });
}

console.log("Content Script is running");

function updateCounter() {
  if (counterLabel === undefined) return;
  counterLabel.innerHTML = `${entities.length} entities Selected`;
}

function selectingEntities({ target }) {
  if (btnSubmit === undefined) return;
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

  // check to see if the user has already selected the attributes, skip if they have
  let arrCheck;
  finishedEntities.forEach(({ attributes }) => {
    arrCheck = attributes.includes(target);
  });

  if (arrCheck) {
    console.log("already in array");
    return;
  }
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
}
//}
/*   }, 10); */
