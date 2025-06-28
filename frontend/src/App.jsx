// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WCS from './pages/WCS';
import OFDM from './pages/OFDM';
import LinkBudget from './pages/LinkBudget';
import Cellular from './pages/Cellular';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wcs" element={<WCS />} />
      <Route path="/ofdm" element={<OFDM />} />
      <Route path="/link-budget" element={<LinkBudget />} />
      <Route path="/cellular" element={<Cellular />} />
    </Routes>
  );
}
