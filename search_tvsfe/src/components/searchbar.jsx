import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

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

  const handleSearch = (query) => {
    setShowSuggestions(false);
    navigate(`/results?query=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchTerm);
    }
  };

  const handleSuggestionClick = (sugg) => {
    setSearchTerm(sugg);
    setShowSuggestions(false);
    handleSearch(sugg);
  };

  return (
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
  );
}

export default SearchBar;
