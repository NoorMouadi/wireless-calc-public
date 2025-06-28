import React, { useState } from "react";
import { getWCSExplanation } from "../services/wcsService";

export default function WirelessCommsCalculator() {
  const [inputs, setInputs] = useState({
    bandwidth: "",
    quantizerBits: "",
    sourceEncodingRatio: "1",
    channelCodingRate: "",
    burstOverhead: "0",
  });
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState("");

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleCalculate = async () => {
    const payload = {
      bandwidth:          parseFloat(inputs.bandwidth),
      quantizer_bits:     parseInt(inputs.quantizerBits),
      source_code_rate:   parseFloat(inputs.sourceEncodingRatio),
      channel_code_rate:  parseFloat(inputs.channelCodingRate),
      burst_overhead:     parseFloat(inputs.burstOverhead),
    };

    try {
      const res = await getWCSExplanation(payload);
      setResult(res.numbers);
      setExplanation(res.explanation);
    } catch {
      setResult(null);
      setExplanation("Something went wrong. Please check inputs or server.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Wireless Communication System</h2>
        <p style={subtitleStyle}>
          Compute the data rate at the output of each block in a digital transmitter.
          <br />
          <span style={{ fontSize: "0.97em", color: "#888" }}>
            (Sampler → Quantizer → Source Encoder → Channel Encoder → Interleaver → Burst Formatter)
          </span>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "17px" }}>
          <InputField label="Analog Bandwidth (Hz)"          name="bandwidth"            value={inputs.bandwidth}            onChange={handleChange} placeholder="e.g. 3400"        help="Max frequency of your analog signal." />
          <InputField label="Quantizer bits per sample"      name="quantizerBits"        value={inputs.quantizerBits}        onChange={handleChange} placeholder="e.g. 8"           help="Bits used for each digital sample." />
          <InputField label="Source Encoding Ratio"          name="sourceEncodingRatio"  value={inputs.sourceEncodingRatio}  onChange={handleChange} placeholder="e.g. 0.8"         help="Compression ratio (0.8 = 20 % compression)." />
          <InputField label="Channel Coding Rate"            name="channelCodingRate"    value={inputs.channelCodingRate}    onChange={handleChange} placeholder="e.g. 0.5"         help="0.5 means data doubles for FEC." />
          <InputField label="Burst Formatting Overhead (%)"  name="burstOverhead"        value={inputs.burstOverhead}        onChange={handleChange} placeholder="e.g. 10"          help="Extra % for headers / framing." />
        </div>

        <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
          <button style={buttonStyle} onClick={handleCalculate}>Calculate</button>
        </div>

        {result && (
          <div style={{ marginTop: 30, fontSize: "1.12rem" }}>
            <strong>Rates at Output of Each Block:</strong>
            <ul style={{ textAlign: "left", lineHeight: 1.7 }}>
              <li><strong>Sampler:</strong>            {result.fs_Hz.toLocaleString()} <b>samples/s</b></li>
              <li><strong>Quantizer:</strong>          {result.Rq_bps.toLocaleString()} <b>bps</b></li>
              <li><strong>Source Encoder:</strong>     {result.Rs_bps.toLocaleString()} <b>bps</b></li>
              <li><strong>Channel Encoder:</strong>    {result.Rc_bps.toLocaleString()} <b>bps</b></li>
              <li><strong>Interleaver:</strong>        {result.Ri_bps.toLocaleString()} <b>bps</b></li>
              <li><strong>Burst Formatter:</strong>    {result.Rb_bps.toLocaleString()} <b>bps</b></li>
            </ul>
            <div style={explanationBox}>
              <strong>Explanation:</strong>
              <br />
              {explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- helper ---------------- */
function InputField({ label, name, value, onChange, placeholder, help }) {
  return (
    <label>
      <b>{label}</b>
      <input
        type="number"
        step="any"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
      />
      <div style={helpText}>{help}</div>
    </label>
  );
}

/* ---------------- pink theme styles ---------------- */
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
  boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
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
};

const buttonStyle = {
  padding: "11px 28px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1.07rem",
  background: "#e91e63",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  transition: "background 0.17s",
};

const explanationBox = {
  marginTop: 20,
  background: "#f5f8ff",
  borderRadius: 10,
  padding: 16,
  whiteSpace: "pre-wrap",
  color: "#222",
  fontSize: "1.05rem",
  lineHeight: 1.7,
};