let elements = [];

let submitButton, cancelButton, counterLabel;

// this will be eventually be https://graphghost.co.uk/api or something similar
const NODE_SERVER = "http://127.0.0.1:4500/crawlme";

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // Add a listener to listen to the message from background.js
      chrome.runtime.onMessage.addListener(gotMessage);

      function gotMessage(message, sender, sendResponse) {
        if (message === "true") {
          // set up submit button if not defined
          if (submitButton === undefined) {
            document.addEventListener("click", e => selectingElements(e));
            submitButton = document.createElement("div");
            submitButton.setAttribute("id", "g-g-d-Submit");
            submitButton.innerHTML = "Create GraphQL API";
            document.body.appendChild(submitButton);
            submitButton.addEventListener("click", function() {
              postToServer();
            });
          }
          // set up cancel button if not defined
          if (cancelButton === undefined) {
            // Cancel Actions
            cancelButton = document.createElement("div");
            cancelButton.setAttribute("id", "g-g-d-Cancel");
            cancelButton.innerHTML = "Cancel";
            document.body.appendChild(cancelButton);
            cancelButton.addEventListener("click", function() {
              // Here we want to set localStorage to "false" as we want to stop using the editor mode
              chrome.storage.sync.set({ "g-g-dState": "false" }, function() {
                console.log("Graph Ghost is closing...");
                clearElementsAndStyling();
                removeButtonsAndListeners();
                document.removeEventListener("click", e =>
                  selectingElements(e)
                );
              });
            });
          }
          // set up counter if not defined
          if (counterLabel === undefined) {
            // Counter Actions
            counterLabel = document.createElement("div");
            counterLabel.setAttribute("id", "g-g-d-Counter");
            counterLabel.innerHTML = `${elements.length} Elements Selected`;
            document.body.appendChild(counterLabel);
            counterLabel.addEventListener("click", function() {
              console.log("Cancelling API Creation");
            });
          }
        } else {
          removeButtonsAndListeners();
          document.removeEventListener("click", e => selectingElements(e));
        }
      }

      function removeButtonsAndListeners() {
        console.log("removing event listener!");
        document.removeEventListener("click", e => selectingElements(e));
        submitButton.removeEventListener("click");
        cancelButton.removeEventListener("click");
        submitButton.parentNode.removeChild(submitButton);
        submitButton = undefined;
        cancelButton.parentNode.removeChild(cancelButton);
        cancelButton = undefined;
        counterLabel.parentNode.removeChild(counterLabel);
        counterLabel = undefined;
      }

      function clearElementsAndStyling() {
        elements.forEach(function(el, index) {
          // remove styling and clear elements array
          el.style.border = "none";
          el.style.padding = "0rem";
        });
        elements = [];
      }

      function postToServer() {
        const data = {
          elements: elements,
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
          });
      }

      console.log("Content Script is running");

      function updateCounter() {
        if (counterLabel === undefined) return;
        counterLabel.innerHTML = `${elements.length} Elements Selected`;
      }

      const selectingElements = function({ target }) {
        if (
          target.id === "g-g-d-Submit" ||
          target.id === "g-g-d-Cancel" ||
          target.id === "g-g-d-Counter" ||
          target.nodeName === "HTML" ||
          target.nodeName === "BODY"
        )
          return;
        // Check if item already exists in array, remove it if so
        if (elements.includes(target)) {
          elements = elements.filter(el => el !== target);
          updateCounter();
          target.style.border = null;
          target.style.padding = null;
          console.log(elements);
          return;
        }
        // Add the new item as it is not in the array
        elements.push(target);
        console.log(elements);
        updateCounter();
        target.style.border = "2px double red";
        target.style.padding = "0.5rem";
      };
    }
  }, 10);
});
