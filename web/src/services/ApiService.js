import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const sendSpeechToServer = async (words) => {
  const prompt = "whatever you reply say in english, " + words;
  try {
    const response = await axios.post(`${BASE_URL}/send-command`, { command: prompt });
    return response.data.interpretedCommand;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};