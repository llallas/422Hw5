import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    distanceMiles: "",
    difficulty: "Easy",
    region: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${API_URL}/trails`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load trails from API");
        return res.json();
      })
      .then((data) => {
        setTrails(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [API_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/trails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        distanceMiles: parseFloat(formData.distanceMiles),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add new trail");
        return res.json();
      })
      .then((newTrail) => {
        setTrails([...trails, newTrail]);
        setFormData({
          name: "",
          distanceMiles: "",
          difficulty: "Easy",
          region: "",
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading trails...</div>;
  if (error)
    return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}>
      <h1>Hiking Trail Explorer</h1>

      <div
        style={{
          background: "#f9f9f9",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "5px",
        }}>
        <h3>Add a New Trail</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name: </label>
            <br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "6px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Distance (Miles): </label>
            <br />
            <input
              type="number"
              step="0.1"
              name="distanceMiles"
              value={formData.distanceMiles}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "6px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Difficulty: </label>
            <br />
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              style={{ width: "100%", padding: "6px" }}>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Region: </label>
            <br />
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "6px" }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "8px 15px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}>
            Submit Trail
          </button>
        </form>
      </div>

      <h2>Available Trails</h2>
      {trails.length === 0 ? <p>No trails found.</p> : ulListRender(trails)}
    </div>
  );
}

function ulListRender(trails) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {trails.map((trail) => (
        <li
          key={trail.id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "4px",
          }}>
          <strong>{trail.name}</strong> ({trail.region})<br />
          Distance: {trail.distanceMiles} miles | Difficulty: {trail.difficulty}
        </li>
      ))}
    </ul>
  );
}

export default App;
