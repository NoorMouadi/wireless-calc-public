import React, { useState } from "react";
import api from "../services/api";

export default function LinkBudgetCalculator() {
  const [inputs, setInputs] = useState({
    txPower: "", txGain: "", txCableLoss: "",
    rxGain: "", rxCableLoss: "",
    distanceKm: "", frequencyMHz: "",
    extraLoss: "", arGain: "0"
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleCalculate = async () => {
    const payload = {
      txPower:      parseFloat(inputs.txPower),
      txGain:       parseFloat(inputs.txGain),
      txCableLoss:  parseFloat(inputs.txCableLoss) || 0,
      rxGain:       parseFloat(inputs.rxGain),
      rxCableLoss:  parseFloat(inputs.rxCableLoss) || 0,
      distanceKm:   parseFloat(inputs.distanceKm),
      frequencyMHz: parseFloat(inputs.frequencyMHz),
      extraLoss:    parseFloat(inputs.extraLoss) || 0,
      arGain:       parseFloat(inputs.arGain) || 0,
    };

    if (
      isNaN(payload.txPower)      || isNaN(payload.txGain)   ||
      isNaN(payload.rxGain)       || isNaN(payload.distanceKm) ||
      isNaN(payload.frequencyMHz)
    ) {
      setResult("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/link-budget", payload);
      setResult(res.data);
    } catch {
      setResult("An error occurred while contacting the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* remove number spinners */}
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none; margin: 0;
        }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Link Budget Calculator</h2>
          <p style={subtitleStyle}>
            Compute transmitted and received power in a flat wireless environment.<br/>
            <span style={noteStyle}>(Transmitter → Path Loss → Receiver)</span>
          </p>

          {/* collapsible explanation row */}
          <details style={detailsStyle}>
            <summary style={detailsSummaryStyle}>What does this calculate?</summary>
            <div style={detailsTextStyle}>
               This tool computes the EIRP and expected received signal strength for a
  point-to-point wireless link in flat terrain using standard link-budget
  formulas.<br/><br/>
              <strong>EIRP = Tx&nbsp;Power&nbsp;+&nbsp;Tx&nbsp;Gain&nbsp;−&nbsp;Tx&nbsp;Cable&nbsp;Loss</strong><br/>
              <strong>Received&nbsp;Power = EIRP&nbsp;+&nbsp;Rx&nbsp;Gain&nbsp;+&nbsp;Rx&nbsp;Amp&nbsp;Gain&nbsp;−&nbsp;FSPL&nbsp;−&nbsp;Extra&nbsp;Loss&nbsp;−&nbsp;Rx&nbsp;Cable&nbsp;Loss</strong><br/><br/>
              Enter your numbers on the left; click <em>Calculate</em> to see EIRP and the received signal strength.
            </div>
          </details>

          <div style={inputsContainer}>
            {[
              ["txPower",      "Transmit Power (dBm)"],
              ["txGain",       "Tx Antenna Gain (dBi)"],
              ["txCableLoss",  "Tx Cable Loss (dB)"],
              ["rxGain",       "Rx Antenna Gain (dBi)"],
              ["rxCableLoss",  "Rx Cable Loss (dB)"],
              ["distanceKm",   "Distance (km)"],
              ["frequencyMHz", "Frequency (MHz)"],
              ["extraLoss",    "Extra Losses (dB)"],
              ["arGain",       "Rx Amplifier Gain (dB)"],
            ].map(([name, label]) => (
              <label key={name} style={labelStyle}>
                <span style={labelTextStyle}>{label}</span>
                <input
                  type="number"
                  step="any"
                  name={name}
                  value={inputs[name]}
                  onChange={handleChange}
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

          {result && typeof result === "object" && (
            <div style={resultsStyle}>
              <strong>Results:</strong>
              <ul style={listStyle}>
                <li><strong>EIRP (dBm):</strong> {result.numbers["EIRP (dBm)"].toFixed(2)}</li>
                <li><strong>Received Power (dBm):</strong> {result.numbers["Received Power (dBm)"].toFixed(2)}</li>
              </ul>
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

// Helper‐texts mapped by label
const helpTextContent = {
  "Transmit Power (dBm)":   "Output power of the transmitter (in dBm).",
  "Tx Antenna Gain (dBi)":  "Antenna gain of the transmitter.",
  "Tx Cable Loss (dB)":     "Cable/feed loss on the transmitter side.",
  "Rx Antenna Gain (dBi)":  "Antenna gain of the receiver.",
  "Path Loss (dB)":         "Free-space or environment path loss.",
  "Rx Cable Loss (dB)":     "Cable/feed loss on the receiver side.",
};

// (rest of your previously defined styling objects: pageStyle, cardStyle, …)



// Styles
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
  width: "90vw", maxWidth: "520px",
  background: "#fff",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
};
const titleStyle = {
  fontWeight: 700, fontSize: "2rem", color: "#ad1457",
  marginBottom: "8px", textAlign: "center",
};
const subtitleStyle = {
  textAlign: "center", color: "#555", fontSize: "1rem", marginBottom: "16px",
};
const noteStyle = { color: "#880e4f", fontSize: "0.9em" };
const detailsStyle = { marginBottom: "20px" };
const detailsSummaryStyle = {
  fontWeight: 600, cursor: "pointer", color: "#ad1457",
};
const detailsTextStyle = { color: "#555", fontSize: "0.95em", paddingLeft: "1em" };
const listStyle = { marginLeft: "1.2em", lineHeight: 1.5 };
const inputsContainer = { display: "flex", flexDirection: "column", gap: "16px" };
const labelStyle = { display: "block" };
const labelTextStyle = { fontWeight: 600, display: "block", marginBottom: "4px" };
const inputStyle = {
  width: "100%", padding: "10px", fontSize: "1rem",
  borderRadius: "6px", border: "1px solid #ec407a",
  background: "#faf0f2", outline: "none",
};
const helpText = {
  fontSize: "0.85em", color: "#777", marginTop: "4px"
};
const buttonContainer = { textAlign: "center", marginTop: "24px" };
const buttonStyle = {
  padding: "10px 36px", fontSize: "1rem", fontWeight: 600,
  background: "#e91e63", color: "#fff", border: "none",
  borderRadius: "6px", cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "background 0.2s",
};
const resultsStyle = { marginTop: "24px", color: "#333" };
const explanationContainer = { marginTop: "16px" };
const explanationBox = {
  marginTop: "8px", background: "#fcfcfc", padding: "16px",
  borderRadius: "6px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  whiteSpace: "pre-wrap", color: "#444"
};
const errorBox = {
  marginTop: "20px", background: "#fde0dc", padding: "12px",
  borderRadius: "6px", color: "#b00020"
};
