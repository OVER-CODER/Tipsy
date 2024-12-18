function sendErrorToBackground(errorMessage) {
  chrome.runtime.sendMessage(
    { type: "error-captured", payload: errorMessage },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to background:", chrome.runtime.lastError.message);
      } else {
        console.log("Background response:", response);
      }
    }
  );
}

function storeErrorLocally(errorMessage) {
  chrome.storage.local.set({ lastError: { message: errorMessage } }, () => {
    console.log("Error stored in local storage:", errorMessage);
  });
}

function captureError(errorMessage) {
  console.log("Captured error:", errorMessage);
  sendErrorToBackground(errorMessage);
  storeErrorLocally(errorMessage);
}

window.onerror = function (message, source, lineno, colno, error) {
  captureError(error ? error.message : message);
};

window.addEventListener("unhandledrejection", (event) => {
  const errorMessage = event.reason ? event.reason.message : "Unhandled rejection occurred";
  captureError(errorMessage);
});

const originalConsoleError = console.error;
console.error = function (...args) {
  const errorMessage = args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg)).join(" ");
  captureError(errorMessage);
  originalConsoleError.apply(console, args);
};

console.log("Error capturing script successfully injected.");
