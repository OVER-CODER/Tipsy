import { useEffect, useState } from "react";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["lastError", "suggestions"], (result) => {
      setErrorMessage(result.lastError || "No errors captured yet...");
      setSolutions(result.suggestions || []);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <img src="/icon.png" alt="Extension Logo" className="w-12 mb-2" />
      <h1 className="text-xl font-bold mb-2">Error Helper</h1>
      <p className="text-sm text-gray-400 mb-4">Error References at Your Fingertips</p>

      <div className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Error Message:</label>
          <textarea
            value={errorMessage}
            readOnly
            className="w-full h-24 p-2 text-sm bg-gray-800 text-white rounded-md resize-none"
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Suggestions</h2>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : solutions.length > 0 ? (
            <div className="bg-gray-800 p-3 rounded-md max-h-48 overflow-y-auto">
              <div className="space-y-2 text-sm">
                {solutions.map((suggestion, index) => (
                  <div key={index} className="text-white">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              No suggestions
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
