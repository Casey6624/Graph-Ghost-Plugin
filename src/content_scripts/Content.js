let elements = []

document.addEventListener("click", function (e) {
    if (elements.includes(e.target)) {
        elements = elements.filter(el => el !== e.target)
        e.target.style.border = null
        e.target.style.padding = null
        return
    }
    elements.push(e.target)
    console.log(elements)
    e.target.style.border = "2px double red"
    e.target.style.padding = "0.5rem"
})