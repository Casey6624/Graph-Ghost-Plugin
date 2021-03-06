console.log("Content Script is running");
let DOMNodes = [];
let allDOMNodes = [];
let xPathNodes = [];
let finishedEntities = [];
let DOMDesc = [];

let btnSubmit, btnCancel, btnAddAttri, counterLabel, txtAttri;

let currUrl = "";

// this will be eventually be https://graphghost.co.uk/api or something similar
const createCrawlEndpoint = "https://graphghost.co.uk/crawl-me/";
const showCrawlEndpoint = "https://graphghost.co.uk/crawl/";

// Add a listener to listen to the message from background.js
chrome.runtime.onMessage.addListener(function messageFromBackgroundjs(
  data,
  sender,
  sendResponse
) {
  console.log(data);
  currUrl = data;
  // set up submit button if not defined
  document.addEventListener("click", (e) => selectingEntities(e));
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
    counterLabel.innerHTML = `${DOMNodes.length} DOMNodes Selected`;
    document.body.appendChild(counterLabel);
  }
});

/* HANDLERS */
// Cancel functionality
function btnCancelHandler() {
  removeButtonsAndListeners();
}
// Submit/Done functionality
function btnSubmitHandler() {
  postToServer();
}
// Add Attribute functionality
function btnAddHandler() {
  console.log("add handler triggered!");
  if (txtAttri.value === "") {
    // TODO: add validation
    console.log("this cannot be empty");
    return;
  }
  let tempArr = [...DOMNodes];
  let data = {
    entityName: txtAttri.value,
    xPathNodes: [...xPathNodes],
    DOMDesc: [...DOMDesc],
  };

  finishedEntities.push(data);
  DOMNodes.forEach(({ style }) => {
    style.border = "2px double black";
    style.background = "#f2f2f2";
  });

  allDOMNodes.push(...DOMNodes);

  DOMNodes = [];
  DOMDesc = [];
  xPathNodes = [];
  txtAttri.value = "";
  txtAttri.textContent = "";
  console.log(finishedEntities);
  updateCounter();
}

/* EVENTS */

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
// Send to NodeJS logic
function postToServer() {
  if (finishedEntities.length === 0) {
    // TODO: Add validation message here
    console.log("You need to add at least one entity!");
    return;
  }

  const data = {
    entities: [...finishedEntities],
    // This needs changing to be dynamic via the google tabs API
    url: currUrl,
  };
  fetch(createCrawlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((resData) => {
      console.log(resData);
      const { url } = resData;
      window.location = `${showCrawlEndpoint}?cid=${url}`;
    })
    .catch((err) => {
      return err;
    });
}

// Update DOM with the current number of elements
function updateCounter() {
  if (counterLabel === undefined) return;
  counterLabel.innerHTML = `${DOMNodes.length} DOMNodes Selected`;
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
    if (finishedEntities.length === 0 || !attributes) return;
    arrCheck = attributes.includes(target);
  });

  if (allDOMNodes.includes(target) || arrCheck) {
    console.log("already in array");
    return;
  }
  // Check if item already exists in array, remove it if so
  if (DOMNodes.includes(target)) {
    DOMNodes = DOMNodes.filter((el) => el !== target);
    updateCounter();
    target.removeAttribute("style");
    console.log(DOMNodes);
    return;
  }
  // Add the new item as it is not in the array
  const DOMNode = createXPathFromElement(target);
  DOMNodes.push(target);
  DOMDesc.push({
    type: target.localName || target.tagName,
    content: target.innerHTML || target.innerText || target.value,
    outerHTML: target.outerHTML,
  });
  xPathNodes.push(DOMNode);
  console.log(DOMNodes);
  updateCounter();
  target.style.border = "2px double red";
  target.style.padding = "0.5rem";
}

// Taken from stackoverflow do not trust! https://stackoverflow.com/questions/2661818/javascript-get-xpath-of-a-node
function createXPathFromElement(elm) {
  var allNodes = document.getElementsByTagName("*");
  for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) {
    if (elm.hasAttribute("id")) {
      var uniqueIdCount = 0;
      for (var n = 0; n < allNodes.length; n++) {
        if (allNodes[n].hasAttribute("id") && allNodes[n].id == elm.id)
          uniqueIdCount++;
        if (uniqueIdCount > 1) break;
      }
      if (uniqueIdCount == 1) {
        segs.unshift('id("' + elm.getAttribute("id") + '")');
        return segs.join("/");
      } else {
        segs.unshift(
          elm.localName.toLowerCase() + '[@id="' + elm.getAttribute("id") + '"]'
        );
      }
    } else if (elm.hasAttribute("class")) {
      segs.unshift(
        elm.localName.toLowerCase() +
          '[@class="' +
          elm.getAttribute("class") +
          '"]'
      );
    } else {
      for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.localName == elm.localName) i++;
      }
      segs.unshift(elm.localName.toLowerCase() + "[" + i + "]");
    }
  }
  return segs.length ? "/" + segs.join("/") : null;
}

function lookupElementByXPath(path) {
  var evaluator = new XPathEvaluator();
  var result = evaluator.evaluate(
    path,
    document.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  return result.singleNodeValue;
}
