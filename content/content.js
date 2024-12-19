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
  if (typeof error === "object") {
    if (Array.isArray(error)) error = error[0] || "Unknown error";
    error = JSON.stringify(error, null, 2);
  }
  return error.replace(/\n\s+/g, " ").replace(/\\n/g, " ").trim();
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.data.type !== "site-error") return;

  const errorMessage = cleanErrorMessage(event.data.payload);
  console.log("Message received in content script from injected script:", errorMessage);

  chrome.runtime.sendMessage(
    { type: "error-captured", payload: errorMessage },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to background:", chrome.runtime.lastError.message);
      } else {
        console.log("Message successfully sent to background:", response);
      }
    }
  );

  chrome.storage.local.set({ lastError: { message: errorMessage } }, () => {
    console.log("Error stored locally:", errorMessage);
  });
});
