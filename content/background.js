chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "error-captured") {
      console.log("Error from localhost:3001:", message.payload);
      
      chrome.storage.local.set({ lastCapturedError: message.payload }, () => {
        console.log("Error stored locally:", message.payload);
      });
  
      sendResponse({ status: "ok" });
    } else {
      sendResponse({ status: "unknown message type" });
    }
  });
  