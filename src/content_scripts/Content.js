let elements = []
let selecting = false

/* Submit Actions */
const submitButton = document.createElement("div")
submitButton.setAttribute("id", "g-g-d-Submit")
submitButton.innerHTML = "Create GraphQL API"
document.body.appendChild(submitButton);
document.getElementById("g-g-d-Submit").addEventListener("click", function () {
    console.log("Submitting to Server")
})

/* Cancel Actions */
const cancelButton = document.createElement("div")
cancelButton.setAttribute("id", "g-g-d-Cancel")
cancelButton.innerHTML = "Cancel"
document.body.appendChild(cancelButton);
document.getElementById("g-g-d-Cancel").addEventListener("click", function () {
    console.log("Cancelling API Creation")
})

// Code to handle the selection
document.addEventListener("click", function (e) {
    if (e.target.id === "g-g-d-Submit" || e.target.id === "g-g-d-Cancel" || e.target.nodeName === "HTML" || e.target.nodeName === "BODY") return
    if (elements.includes(e.target)) {
        elements = elements.filter(el => el !== e.target)
        e.target.style.border = null
        e.target.style.padding = null
        console.log(elements)
        return
    }
    elements.push(e.target)
    console.log(elements)
    e.target.style.border = "2px double red"
    e.target.style.padding = "0.5rem"
})