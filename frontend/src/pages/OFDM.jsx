import React, { useState } from "react";

export default function OFDMSystemsCalculator() {
  const [inputs, setInputs] = useState({
    modulationOrder: "",
    resourceElementsPerRB: "",
    symbolsPerRB: "",
    parallelRBs: "",
    bandwidth: "",
    symbolTime: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleCalculate = async () => {
    const payload = {
      m_order: Number(inputs.modulationOrder),
      n_subcarriers: Number(inputs.resourceElementsPerRB),
      n_symbols_prb: Number(inputs.symbolsPerRB),
      n_prb_parallel: Number(inputs.parallelRBs),
      bandwidth: Number(inputs.bandwidth),
      t_sym: Number(inputs.symbolTime),
    };

    const isValid = Object.values(payload).every((val) => val > 0);
    if (!isValid) {
      setResult("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/ofdm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("API call failed");
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setResult("Something went wrong. Please check inputs or server.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>OFDM Systems Calculator</h2>
        <p style={subtitleStyle}>
          <span>
            Calculate data rates for resource elements, OFDM symbols, resource
            blocks, parallel blocks, and spectral efficiency.
          </span>
          <br />
          <span style={{ fontSize: "0.97em", color: "#888" }}>
            (Resource Element → Symbol → Block → System)
          </span>
        </p>
        <details style={{ marginBottom: "1.3em" }}>
          <summary style={{ fontWeight: "bold", cursor: "pointer" }}>
            What does this calculate?
          </summary>
          <div style={{ color: "#666", fontSize: "1em", paddingLeft: "1.5em" }}>
            <ul>
              <li><b>Modulation Order (M):</b> Bits per symbol, e.g. 2 (BPSK), 4 (QPSK), 16, 64...</li>
              <li><b>Resource Elements per RB:</b> Number of subcarriers × symbols per RB (e.g. 84 for LTE)</li>
              <li><b>Symbols per RB:</b> Number of OFDM symbols in one RB (e.g. 7 or 14)</li>
              <li><b>Parallel RBs:</b> Number of RBs used in parallel</li>
              <li><b>Bandwidth (Hz):</b> System bandwidth for spectral efficiency</li>
              <li><b>Symbol Time (s):</b> Duration of one OFDM symbol</li>
            </ul>
          </div>
        </details>
        <div style={{ display: "flex", flexDirection: "column", gap: "17px" }}>
          {renderInput("Modulation Order (M)", "modulationOrder", "e.g. 2, 4, 16, 64", "e.g. 2 for BPSK, 4 for QPSK, 16 for 16QAM, etc.", inputs, handleChange)}
          {renderInput("Resource Elements per RB", "resourceElementsPerRB", "e.g. 84", "Subcarriers × symbols per RB (e.g. 12 × 7 = 84)", inputs, handleChange)}
          {renderInput("Symbols per RB", "symbolsPerRB", "e.g. 7", "Number of OFDM symbols in one RB (e.g. 7, 14...)", inputs, handleChange)}
          {renderInput("Parallel RBs", "parallelRBs", "e.g. 25", "Number of RBs used simultaneously in the system", inputs, handleChange)}
          {renderInput("Bandwidth (Hz)", "bandwidth", "e.g. 20000000", "System bandwidth (e.g. 20,000,000 for 20 MHz)", inputs, handleChange)}
          {renderInput("OFDM Symbol Time (s)", "symbolTime", "e.g. 7.14e-6", "Typical LTE OFDM symbol duration (e.g. 7.14 μs)", inputs, handleChange)}
        </div>
        <div style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}>
          <button style={buttonStyle} onClick={handleCalculate}>Calculate</button>
        </div>
        {result && typeof result === "object" && result.numbers && (
          <div style={{ marginTop: 30, fontSize: "1.12rem" }}>
            <strong>Results:</strong>
            <ul style={{ textAlign: "left", lineHeight: 1.7 }}>
              {Object.entries(result.numbers).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {Number(value).toLocaleString()} <b>{key.includes("bpsHz") ? "bits/sec/Hz" : "bps"}</b></li>
              ))}
            </ul>
            <div style={{
              marginTop: 25,
              padding: "20px",
              background: "#f5f8ff",
              borderRadius: "14px",
              color: "#222",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap"
            }}>
              <strong style={{ display: "block", fontSize: "1.13rem", marginBottom: 6 }}>Explanation in Simple Words:</strong>
              {result.explanation}
            </div>
          </div>
        )}
        {result && typeof result === "string" && (
          <div style={errorBox}>{result}</div>
        )}
      </div>
    </div>
  );
}

const renderInput = (label, name, placeholder, help, state, onChange) => (
  <label>
    <b>{label}</b>
    <input
      type="number"
      step="any"
      name={name}
      value={state[name]}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
    />
    <div style={helpText}>{help}</div>
  </label>
);

const containerStyle = {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f6e6ea",
  margin: 0,
  padding: 0,
};

const cardStyle = {
  width: "90vw",
  maxWidth: "520px",
  background: "#fff",
  borderRadius: "20px",
  padding: "38px 32px",
  boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
};

const titleStyle = {
  fontWeight: 800,
  fontSize: "2.1rem",
  marginBottom: 5,
  textAlign: "center",
  color: "#ad1457",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#555",
  fontSize: "1.07em",
  marginTop: 0,
  marginBottom: 22,
};

const inputStyle = {
  width: "100%",
  fontSize: "1rem",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ec407a",
  marginTop: "6px",
  marginBottom: "3px",
  background: "#faf0f2",
  outline: "none",
};

const helpText = {
  fontSize: "0.94em",
  color: "#888",
  marginTop: "1.5px",
  marginBottom: "-1px",
};

const buttonStyle = {
  padding: "11px 28px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1.07rem",
  background: "#e91e63",
  color: "white",
  border: "none",
  cursor: "pointer",
  transition: "all 0.17s",
};

const errorBox = {
  marginTop: 20,
  background: "#fde0dc",
  borderRadius: 10,
  padding: 16,
  whiteSpace: "pre-wrap",
};
