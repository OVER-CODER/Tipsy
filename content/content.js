function injectScript() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("content/injected.js");
  script.onload = function () {
    this.remove();
  };
  document.documentElement.appendChild(script);
}

injectScript();

window.addEventListener("message", (event) => {
  if (event.source !== window || event.data.type !== "site-error") return;

  console.log("Message received in content script from injected script:", event.data.payload);

  chrome.runtime.sendMessage(
    { type: "error-captured", payload: event.data.payload },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to background:", chrome.runtime.lastError.message);
      } else {
        console.log("Message successfully sent to background:", response);
      }
    }
  );
});
