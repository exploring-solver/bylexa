const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY_12607);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let commands = ["blink_led", "rotate_servo"];

app.get('/control', (req, res) => {
  // Randomly select between blink_led and rotate_servo
  let randomIndex = Math.floor(Math.random() * commands.length);
  let currentCommand = commands[randomIndex];

  res.send(currentCommand); // Send the selected command to ESP32

  // Optionally, you can reset or keep the current command for the next request
});


app.post('/send-command', async (req, res) => {
  const { command } = req.body;
  console.log(`Received command: ${command}`);
  
  // Use Gemini to interpret and generate response from the command
  const prompt = command;
  try {
    const result = await model.generateContent(prompt);
    const interpretedCommand = result.response.text();
    
    // Log the interpreted command and send back to ESP32
    console.log(`Interpreted command: ${interpretedCommand}`);
    if (interpretedCommand.includes("blink")) {
      currentCommand = "blink_led";
    } else if (interpretedCommand.includes("rotate")) {
      currentCommand = "rotate_servo";
    } else {
      currentCommand = ""; // No valid command
    }
    
    res.json({ status: 'Command processed', interpretedCommand });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to process command' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
