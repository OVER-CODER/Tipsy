chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "error-captured") {
      const errorMessage = message.payload;
  
      console.log("Error captured in background.js:", errorMessage);
  
      fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: errorMessage }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch solution from Flask backend");
          }
          return response.json();
        })
        .then((data) => {
          const suggestions = data.suggestions || [];
          console.log("Solution fetched from Flask backend:", suggestions);

          chrome.storage.local.set({ lastSuggestions: suggestions }, () => {
            console.log("Suggestions stored in local storage:", suggestions);
            try {
                chrome.runtime.sendMessage(
                { type: "suggestions-updated", suggestions },
                (response) => {
                  if (chrome.runtime.lastError) {
                    console.warn("Popup is not open, message not delivered.", chrome.runtime.lastError);
                  } else {
                    console.warn("Message delivered to popup:", response);
                  }
                }
              );
            } catch (error) {
              console.error("Failed to send message to popup", error.message);
            }
          });
  
          sendResponse({ success: true, suggestions });
        })
        .catch((error) => {
          console.error("Error fetching solution:", error.message);
          sendResponse({ success: false, error: error.message });
        });
  
      return true;
    }
  });
  