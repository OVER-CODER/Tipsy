import { useEffect, useState } from "react";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["lastError"], (data) => {
      if (data.lastError) {
        setErrorMessage(data.lastError.message);
      } else {
        setErrorMessage("No recent errors found.");
      }
    });
  }, []);

  const fetchSolutions = async () => {
    if (!errorMessage) return;
    setLoading(true);

    try {
      const response = await fetch("/api/fetchSolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: errorMessage }),
      });

      const { suggestions } = await response.json();
      setSolutions(suggestions || ["No solutions found."]);
    } catch (error) {
      setSolutions(["Failed to fetch solutions."]);
    }

    setLoading(false);
  };

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
          className="w-full"
        ></textarea>
      </div>

      <button onClick={fetchSolutions} disabled={loading}>
        {loading ? "Fetching Solutions..." : "Fetch Solutions"}
      </button>

      <div className="solutions-container mt-4 w-full">
        {solutions.length > 0 ? (
          <ul>
            {solutions.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No solutions available yet.</p>
        )}
      </div>
    </div>
  );
}
