import axios from 'axios';

const BASE_URL = 'http://panel.mait.ac.in:3012';

export const sendSpeechToServer = async (words) => {
  const prompt = "whatever you reply say in english, " + words;
  try {
    const response = await axios.post(`${BASE_URL}/generate`, { prompt });
    return response.data.text;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};