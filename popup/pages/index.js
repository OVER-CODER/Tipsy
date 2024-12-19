import { useEffect, useState } from "react";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["lastSuggestions"], (result) => {
      if (chrome.runtime.lastError) {
        setError("Failed to load suggestions.");
      } else if (result.lastSuggestions) {
        setSolutions(result.lastSuggestions);
      }
      setLoading(false);
    });

    const handleMessage = (message, sender, sendResponse) => {
      if (message.type === "suggestions-updated") {
        console.log("Received suggestions in popup:", message.suggestions);
        setSolutions(message.suggestions || []);
        setLoading(false);
        sendResponse({ success: true });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <img src="/icon.png" alt="Extension Logo" className="w-12 mb-2" />
      <h1>Welcome Back!</h1>
      <p className="subtitle">Error References at Your Fingertips</p>

      <div className="input-container w-full">
        <label htmlFor="error" className="mb-1 text-sm">
          Error Message:
        </label>
        <textarea
          id="error"
          value={errorMessage}
          disabled
          className="w-full p-2 border rounded"
        ></textarea>
      </div>

      <div className="p-4">
        {loading ? (
          <p>Loading suggestions...</p>
        ) : (
          <div>
            <h2 className="font-bold mb-2">Suggestions</h2>
            {solutions.length > 0 ? (
              <ul className="list-disc pl-5">
                {solutions.map((suggestion, index) => (
                  <li key={index} className="mb-2">
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No suggestions available.</p>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
