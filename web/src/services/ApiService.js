import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

export const sendSpeechToServer = async (words) => {
  const prompt = "whatever you reply say in english, " + words;
  try {
    const response = await axios.post(`${BASE_URL}/api/process-speech`, {speech: prompt });
    return response.data.response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const sendCommandToESP32 = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/control`);
    return response.data;
  } catch (error) {
    console.error('Error sending command to ESP32:', error);
    throw error;
  }
};