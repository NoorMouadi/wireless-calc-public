// src/pages/Cellular.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function CellularSystemDesign() {
  const [inputs, setInputs] = useState({
    totalArea: "",
    cellRadius: "",
    totalChannels: "",
    clusterSize: "",
    subsPerCell: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleCalculate = async () => {
    const payload = {
      totalArea:     parseFloat(inputs.totalArea),
      cellRadius:    parseFloat(inputs.cellRadius),
      totalChannels: parseInt(inputs.totalChannels, 10),
      clusterSize:   parseInt(inputs.clusterSize, 10),
      subsPerCell:   parseInt(inputs.subsPerCell, 10) || 0,
    };

    if (
      isNaN(payload.totalArea)     ||
      isNaN(payload.cellRadius)    ||
      isNaN(payload.totalChannels) ||
      isNaN(payload.clusterSize)
    ) {
      setResult("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/cellular", payload);
      setResult(res.data);
    } catch {
      setResult("An error occurred while contacting the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance:none;margin:0;
        }
        input[type=number]{-moz-appearance:textfield;}
      `}</style>

      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Cellular System Design</h2>

          <p style={subtitleStyle}>
            This tool estimates the number&nbsp;of cells, channels per cell,
            clusters, and capacity for a basic cellular network using standard
            formulas.
          </p>

          <details style={detailsStyle}>
            <summary style={detailsSummaryStyle}>What does this calculate?</summary>
            <div style={detailsTextStyle}>
              <ul style={listStyle}>
                <li><b>Total Area (km²):</b> area the network must cover</li>
                <li><b>Cell Radius (km):</b> radius of one hexagonal cell</li>
                <li><b>Total Channels:</b> full pool of duplex frequencies</li>
                <li><b>Cluster Size (N):</b> cells per cluster (e.g.&nbsp;3, 4, 7, 12)</li>
                <li><b>Subscribers per Cell:</b> (optional) expected users per cell</li>
              </ul>
            </div>
          </details>

          <div style={inputsContainer}>
            {[
              ["totalArea",     "Total Area to Cover (km²)",  "e.g. 500"],
              ["cellRadius",    "Cell Radius (km)",           "e.g. 2"],
              ["totalChannels", "Total Available Channels",   "e.g. 210"],
              ["clusterSize",   "Cluster Size (N)",           "e.g. 7"],
              ["subsPerCell",   "Subscribers per Cell (optional)", "e.g. 150"],
            ].map(([name, label, ph]) => (
              <label key={name} style={labelStyle}>
                <span style={labelTextStyle}>{label}</span>
                <input
                  type="number" step="any"
                  name={name}
                  value={inputs[name]}
                  onChange={handleChange}
                  placeholder={ph}
                  style={inputStyle}
                  disabled={loading}
                />
              </label>
            ))}
          </div>

          <div style={buttonContainer}>
            <button
              style={buttonStyle}
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? "Calculating…" : "Calculate"}
            </button>
          </div>

          {/* numeric results + AI explanation */}
          {result && typeof result === "object" && (
            <div style={resultsStyle}>
              <strong>Results:</strong>
              <ul style={listStyle}>
                <li><strong>Cell Area:</strong> {result.numbers["Cell Area (km²)"]} km²</li>
                <li><strong>Total Cells:</strong> {result.numbers["Total Cells"]}</li>
                <li><strong>Channels per Cell:</strong> {result.numbers["Channels per Cell"]}</li>
                <li><strong>Total Clusters:</strong> {result.numbers["Total Clusters"]}</li>
                <li><strong>Reuse Distance D:</strong> {result.numbers["Reuse Distance (km)"]} km</li>
                {inputs.subsPerCell && (
                  <>
                    <li><strong>Total Subscribers:</strong> {result.numbers["Total Subscribers"]}</li>
                    <li><strong>Subscribers per Channel:</strong> {result.numbers["Subscribers per Channel"]}</li>
                  </>
                )}
              </ul>

              {/* ▼ advanced metrics */}
              <details style={{ marginTop: "12px" }}>
                <summary style={{ cursor: "pointer", color: "#ad1457", fontWeight: 600 }}>
                  Show advanced metrics
                </summary>
                <ul style={listStyle}>
                  <li><strong>Freq-Reuse Factor:</strong> {result.numbers["Frequency Reuse Factor"]}</li>
                  <li><strong>Co-channel Ratio Q:</strong> {result.numbers["Co-channel Reuse Ratio Q"]}</li>
                  <li><strong>Channels per Cluster:</strong> {result.numbers["Channels per Cluster"]}</li>
                  <li><strong>System Capacity:</strong> {result.numbers["System Capacity (channels)"]}</li>
                </ul>
              </details>

              <div style={explanationContainer}>
                <strong>AI Explanation:</strong>
                <div style={explanationBox}>{result.explanation}</div>
              </div>
            </div>
          )}

          {result && typeof result === "string" && (
            <div style={errorBox}>{result}</div>
          )}
        </div>
      </div>
    </>
  );
}
/* --------------------------------------------------
   Styles (pink theme to match Link-Budget page)
-------------------------------------------------- */
const pageStyle = {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f6e6ea",
  margin: 0, padding: 0,
};
const cardStyle = {
  width: "90vw", maxWidth: "540px",
  background: "#fff",
  borderRadius: "20px",
  padding: "34px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
};
const titleStyle = {
  fontWeight: 800, fontSize: "2.1rem",
  color: "#ad1457", textAlign: "center", margin: 0,
};
const subtitleStyle = {
  textAlign: "center", color: "#555", fontSize: "1.05rem",
  marginTop: "8px", marginBottom: "22px",
};
const detailsStyle = { marginBottom: "22px" };
const detailsSummaryStyle = { cursor: "pointer", fontWeight: 600, color: "#ad1457" };
const detailsTextStyle = { color: "#555", fontSize: "0.97rem", paddingLeft: "1em" };
const listStyle = { marginLeft: "1.1em", lineHeight: 1.55 };
const inputsContainer = { display: "flex", flexDirection: "column", gap: "18px" };
const labelStyle = { display: "block" };
const labelTextStyle = { fontWeight: 600, display: "block", marginBottom: "4px" };
const inputStyle = {
  width: "100%", padding: "10px", fontSize: "1rem",
  borderRadius: "8px", border: "1px solid #ec407a",
  background: "#faf0f2", outline: "none",
};
const buttonContainer = { textAlign: "center", marginTop: "28px" };
const buttonStyle = {
  padding: "11px 34px", fontSize: "1rem", fontWeight: 700,
  background: "#e91e63", color: "#fff", border: "none",
  borderRadius: "8px", cursor: "pointer",
  boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
  transition: "background 0.2s",
};
const resultsStyle = { marginTop: "26px", color: "#333" };
const explanationContainer = { marginTop: "16px" };
const explanationBox = {
  marginTop: "8px", background: "#fcfcfc", padding: "16px",
  borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  whiteSpace: "pre-wrap",
};
const errorBox = {
  marginTop: "22px", background: "#fde0dc", padding: "14px",
  borderRadius: "8px", color: "#b00020",
};
