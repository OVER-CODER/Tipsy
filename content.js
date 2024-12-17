function sendError(errorMessage) {
    fetch("http://localhost:3000/fetchsolution", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({error: errorMessage})
    })
    .then(response => response.json())
    .then(data => {
        console.log("AI Response: ", data.suggestion)
        localStorage.setItem("errorSuggestion", data.suggestion)
    })
    .catch(err => console.error("Error Sending Data:", err))
}

window.addEventListener("error", (event) => {
    sendError(event.error.message)
    console.error("Error:", event.error.message)
})

window.addEventListener("unhandledrejection", (event) => {
    sendError(event.reason.message)
    console.error("Error:", event.reason.message)
})


const orignalConsoleError = console.error;
console.error = function(...args) {
    sendError(args.join(" "))
    orignalConsoleError.apply(console, arguments)
};