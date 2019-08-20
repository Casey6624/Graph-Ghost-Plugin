const elements = []

document.addEventListener("click", function (e) {
    elements.push(e.target)
    console.log(elements)
    e.target.style.border = "2px double red"
    e.target.style.padding = "0.5rem"
})