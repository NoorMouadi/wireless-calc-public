import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const menu = [
    // { name: "Home", to: "/" },  // احذف هذا السطر
    { name: "WCS", to: "/wcs" },
    { name: "OFDM", to: "/ofdm" },
    { name: "Link Budget", to: "/link-budget" },
    { name: "Cellular", to: "/cellular" },
  ];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65),rgba(0,0,0,0.65)), url('banner.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* العنوان في الأعلى */}
      <div
        style={{
          width: "100vw",
          textAlign: "center",
          position: "absolute",
          top: "40px",
          left: 0,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            color: "white",
            fontWeight: "900",
            fontSize: "3.5rem",
            marginBottom: "0.5rem",
            textShadow: "0 2px 14px #000",
            letterSpacing: "1px",
            background: "rgba(0,0,0,0.25)",
            display: "inline-block",
            borderRadius: "20px",
            padding: "8px 36px",
            pointerEvents: "auto",
          }}
        >
          Wireless & Mobile Network Designer
        </h1>
      </div>

      {/* كل شيء تحت العنوان */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {}
        <nav
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "2.5rem",
            marginTop: "70px", 
          }}
        >
          {menu.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textDecoration: "none",
                padding: "0.5rem 1.2rem",
                borderRadius: "0.5rem",
                background: "rgba(0,0,0,0.3)",
                transition: "0.2s",
              }}
              onMouseOver={e => e.target.style.background = "white"}
              onMouseOut={e => e.target.style.background = "rgba(0,0,0,0.3)"}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        {/* السطر الوصفي */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "#dbeafe",
              fontWeight: "bold",
              background: "rgba(0,0,0,0.45)",
              borderRadius: "1rem",
              padding: "1rem 2rem",
              display: "inline-block",
              fontSize: "1.25rem",
              boxShadow: "0 2px 12px #0002",
              marginTop: "10px",
            }}
          >
            AI-powered tools for comms, OFDM, link budgets & cellular planning
            
          </div>
           <br />
  <span
    style={{
      color: "#fff",
      fontWeight: "bold",
      fontSize: "1.1rem",
      letterSpacing: "0.5px",
      marginTop: "10px",
      display: "inline-block",
      // No background, no shade
    }}
  >
    Developed by Leen Daraghmeh &amp; Noor Mouadi
  </span>
        </div>
      </div>
      
    </div>
    
  );
}
