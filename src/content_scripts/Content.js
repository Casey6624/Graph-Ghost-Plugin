let elements = [];

let submitButton, cancelButton, counterLabel;

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      chrome.runtime.onMessage.addListener(gotMessage);

      function gotMessage(message, sender, sendResponse) {
        console.log("MESSAGE " + message);
        if (message === "true") {
          // Submit Actions
          if (submitButton === undefined) {
            document.addEventListener("click", e => selectingElements(e));
            submitButton = document.createElement("div");
            submitButton.setAttribute("id", "g-g-d-Submit");
            submitButton.innerHTML = "Create GraphQL API";
            document.body.appendChild(submitButton);
            document
              .getElementById("g-g-d-Submit")
              .addEventListener("click", function() {
                console.log("Submitting to Server");
              });
          }

          if (cancelButton === undefined) {
            // Cancel Actions
            cancelButton = document.createElement("div");
            cancelButton.setAttribute("id", "g-g-d-Cancel");
            cancelButton.innerHTML = "Cancel";
            document.body.appendChild(cancelButton);
            document
              .getElementById("g-g-d-Cancel")
              .addEventListener("click", function() {
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

          if (counterLabel === undefined) {
            // Counter Actions
            counterLabel = document.createElement("div");
            counterLabel.setAttribute("id", "g-g-d-Counter");
            counterLabel.innerHTML = `${elements.length} Elements Selected`;
            document.body.appendChild(counterLabel);
            document
              .getElementById("g-g-d-Counter")
              .addEventListener("click", function() {
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
        submitButton.parentNode.removeChild(submitButton);
        submitButton = undefined;
        cancelButton.parentNode.removeChild(cancelButton);
        cancelButton = undefined;
        counterLabel.parentNode.removeChild(counterLabel);
        counterLabel = undefined;
      }

      function clearElementsAndStyling() {
        elements.forEach(function(el, index) {
          el.style.border = "none";
          el.style.padding = "0rem";
        });
        elements = [];
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
