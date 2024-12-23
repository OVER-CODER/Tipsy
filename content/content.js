function injectScript() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("content/injected.js");
  script.onload = function () {
    this.remove();
  };
  document.documentElement.appendChild(script);
}

injectScript();

function cleanErrorMessage(error) {
  if (!error) return "Unknown error";
  
  if (typeof error === "object") {
    if (error.message) return error.message;
    if (Array.isArray(error)) return error[0]?.toString() || "Unknown error";
    try {
      return JSON.stringify(error, null, 2);
    } catch (e) {
      return error.toString();
    }
  }
  return error.toString().replace(/\n\s+/g, " ").replace(/\\n/g, " ").trim();
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.data.type !== "site-error") return;

  const errorMessage = cleanErrorMessage(event.data.payload);
  console.log("Cleaned error message:", errorMessage);
  fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: errorMessage }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Suggestions from backend:", data.suggestions);
      chrome.storage.local.set({ suggestions: data.suggestions }, () => {
        console.log("Suggestions stored in local storage:", data.suggestions);
      });
    })
    .catch((err) => {
      console.error("Error sending to backend:", err);
    });

  chrome.runtime.sendMessage(
    { type: "error-captured", payload: errorMessage },
    (response) => {
      console.log("Background script response:", response);
      if (chrome.runtime.lastError) {
        console.error("Error sending to background:", chrome.runtime.lastError);
      }
    }
  );
});
