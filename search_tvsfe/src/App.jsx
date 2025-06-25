

import { useState, useEffect } from "react";
 
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
 
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch("http://localhost:8000/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prefix: searchTerm }),
        });
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
 
    const debounceTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);
 
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      try {
        const response = await fetch("http://localhost:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchTerm }),
        });
        const data = await response.json();
        setResults(data.results);
        setShowSuggestions(false);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    }
  };
 
  const handleSuggestionClick = (suggestion) => {
  setSearchTerm(suggestion); 
  setShowSuggestions(false); 
 
  setTimeout(async () => {
    try {
      const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: suggestion }),
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }, 0);
};
 
  return (
    <div>
    
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #ccc",
          position: "sticky",
          top: 0,
          zIndex: 999,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "15px",
            color: "#222",
            flexWrap: "wrap",
          }}
        >
          <img
            src="/TVSLogo.svg"
            alt="TVS Logo"
            style={{ height: "32px", marginRight: "12px" }}
          />
          <span style={{ cursor: "pointer", whiteSpace: "nowrap" }}>Products</span>
          <span style={{ cursor: "pointer", whiteSpace: "nowrap" }}>Services</span>
          <span style={{ cursor: "pointer", whiteSpace: "nowrap" }}>Shop</span>
          <span style={{ cursor: "pointer", whiteSpace: "nowrap" }}>Company</span>
        </div>

        <div style={{ position: "relative", marginTop: "8px", marginBottom: "8px" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search vehicle or accessory..."
            style={{
              padding: "8px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "300px",
            }}
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                width: "300px",
                backgroundColor: "white",
                color: "black",
                border: "1px solid #ccc",
                borderTop: "none",
                listStyle: "none",
                padding: "0",
                margin: "0",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((sugg, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(sugg)}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                >
                  {sugg}
                </li>
              ))}
            </ul>
          )}
        </div>
 
        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "14px",
            color: "#003399",
            whiteSpace: "nowrap",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <span style={{ cursor: "pointer" }}>Buy Vehicle</span>
          <span style={{ cursor: "pointer" }}>Test Ride</span>
          <span style={{ cursor: "pointer" }}>Dealers</span>
        </div>
      </div>
 
      <div style={{ width: "100%", overflow: "hidden" }}>
        <img
          src="/tvs-banner.webp"
          alt="TVS Banner"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "500px",
            objectFit: "cover",
          }}
        />
      </div>
      
<div style={{ padding: "16px" }}>
  <h3>Results:</h3>
  {results.length === 0 ? (
    <p>No results to display.</p>
  ) : (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {results.map((item, index) => (
        <li
          key={index}
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <pre style={{ margin: 0 }}>{JSON.stringify(item, null, 2)}</pre>
        </li>
      ))}
    </ul>
  )}
</div>
  </div>
  );
}
 
export default App;