const entities = [];
const attributes = [];

let btnSubmit, btnCancel, btnAddAttri, counterLabel, txtAttri;

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
                clearentitiesAndStyling();
                removeButtonsAndListeners();
                document.removeEventListener("click", e =>
                  selectingEntities(e)
                );
              });
            });
          }
          // set up cancel button if not defined
          // TODO: GGET THIS WORKING START FROM HERE
          if (txtAttri === undefined) {
            // Cancel Actions
            txtAttri = document.createElement("input");
            txtAttri.setAttribute("id", "g-g-d-txtAttri");
            txtAttri.type = "text";
            document.body.appendChild(txtAttri);
            txtAttri.addEventListener("click", function() {
              // Here we want to set localStorage to "false" as we want to stop using the editor mode
              chrome.storage.sync.set({ "g-g-dState": "false" }, function() {
                console.log("Graph Ghost is closing...");
                clearentitiesAndStyling();
                removeButtonsAndListeners();
                document.removeEventListener("click", e =>
                  selectingEntities(e)
                );
              });
            });
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
            counterLabel.addEventListener("click", function() {
              console.log("Cancelling API Creation");
            });
          }
        } else {
          removeButtonsAndListeners();
          document.removeEventListener("click", e => selectingEntities(e));
        }
      }

      function removeButtonsAndListeners() {
        console.log("removing event listener!");
        document.removeEventListener("click", e => selectingEntities(e));
        btnSubmit.removeEventListener("click");
        btnCancel.removeEventListener("click");
        btnSubmit.parentNode.removeChild(btnSubmit);
        btnSubmit = undefined;
        btnCancel.parentNode.removeChild(btnCancel);
        btnCancel = undefined;
        counterLabel.parentNode.removeChild(counterLabel);
        counterLabel = undefined;
      }

      function clearentitiesAndStyling() {
        entities.forEach(function(el, index) {
          // remove styling and clear entities array
          el.style.border = "none";
          el.style.padding = "0rem";
        });
        entities = [];
      }

      function postToServer() {
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
          target.nodeName === "HTML" ||
          target.nodeName === "BODY"
        )
          return;
        // Check if item already exists in array, remove it if so
        if (entities.includes(target)) {
          entities = entities.filter(el => el !== target);
          updateCounter();
          target.style.border = null;
          target.style.padding = null;
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
    }
  }, 10);
});
