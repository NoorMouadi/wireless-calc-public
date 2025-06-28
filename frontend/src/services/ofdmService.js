// src/services/ofdmService.js

import axios from "axios";

const API_URL = "http://localhost:8000"; // غيّر حسب بيئتك

export async function calculateOFDM(data) {
  try {
    const response = await axios.post(`${API_URL}/ofdm`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
