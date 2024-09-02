const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY_12607);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

let currentCommand = "";

app.get('/api/esp32-command', (req, res) => {
  res.send(currentCommand);
  currentCommand = ""; 
});

app.post('/api/process-speech', async (req, res) => {
  const { speech } = req.body;
  console.log(`Received speech: ${speech}`);

  try {
    const result = await model.generateContent(speech);
    const response = result.response.text();
    console.log(`Gemini response: ${response}`);

    if (speech.toLowerCase().includes("blink")) {
      currentCommand = "blink_led";
    } else if (response.toLowerCase().includes("servo")) {
      currentCommand = "rotate_servo";
    }
    console.log(currentCommand);
    res.json({ response });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to process speech' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
