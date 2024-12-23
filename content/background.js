chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "error-captured") {
    const errorMessage = message.payload;
    console.log("Error received in background:", errorMessage);
    
    chrome.storage.local.set({ lastError: errorMessage }, () => {
      console.log("Error stored in background:", errorMessage);
    });

    fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: message.payload }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("API response:", data);
        const suggestions = data.suggestions;

        
        chrome.storage.local.set({ 
          lastSuggestions: suggestions,
          lastUpdated: Date.now()
        }, () => {
          console.log("Stored suggestions:", suggestions);
        });

        chrome.runtime.sendMessage(
          { 
            type: "suggestions-updated", 
            suggestions,
            error: errorMessage 
          },
          response => {
            if (chrome.runtime.lastError) {
              console.log("Popup not open - data stored for later");
            }
          }
        );

        sendResponse({ success: true, suggestions });
      })
      .catch(error => {
        console.error("API error:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});