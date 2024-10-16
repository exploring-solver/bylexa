const { GoogleGenerativeAI } = require('@google/generative-ai');
const { spawn } = require('child_process');
const { sendCommandToAgent } = require('../config/websocket');
const config = require('../config');
const genAI = new GoogleGenerativeAI(process.env.API_KEY_12607);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const jwt = require('jsonwebtoken');

const interpretCommand = async (command) => {
  const prompt = `Interpret the following command: "${command}". Extract and return the application, action, and task in JSON format. For example: {"application": "browser", "action": "open", "task": "google.com"}`;

  try {
    console.log(`Sending prompt to Gemini model: ${prompt}`); // Log prompt
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    // Sanitize the response to remove code block markers or unwanted text
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Try parsing the response
    const interpretedCommand = JSON.parse(responseText);
    console.log('Interpreted command:', interpretedCommand); // Log interpreted command
    return interpretedCommand;
  } catch (error) {
    console.error('Error interpreting command:', error);

    // Check if the error is a JSON parsing error and return a safe fallback
    if (error instanceof SyntaxError) {
      console.log("Returning fallback message: Sorry, I didn’t get that. Please try again.");
      return { success: false, message: 'Sorry, I didn’t get that. Please try again.' }; // Return fallback response
    }

    // Return a generic failure message for other errors without throwing
    return { success: false, message: 'Failed to interpret the command.' };
  }
};

// Function to execute the OS command using Python script
const executeOSCommand = async (interpretation) => {
  return new Promise((resolve, reject) => {
    console.log('Executing OS command with interpretation:', interpretation); // Log interpretation
    const pythonProcess = spawn('python', ['scripts/os_interaction.py', JSON.stringify(interpretation)]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`Python script output: ${data.toString()}`); // Log Python script output
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`); // Log any errors from the Python script
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python script finished successfully'); // Log successful completion
        resolve(output.trim());
      } else {
        console.error(`Python script exited with code ${code}`); // Log error code if script fails
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
};

// Controller to handle the OS command
exports.handleOSCommand = async (req, res) => {
  try {
    const { command } = req.body;
    console.log(`Received command: ${command}`); // Log received command

    // Interpret the command
    const interpretation = await interpretCommand(command);
    console.log('Interpretation result:', interpretation); // Log result of interpretation

    // If the interpretation has a message, return it to the client
    if (interpretation.message) {
      return res.status(200).json({ success: false, message: interpretation.message });
    }

    // Otherwise, execute the OS command
    const result = await executeOSCommand(interpretation);
    console.log('Final result after executing OS command:', result); // Log result of OS command execution

    // Respond back to the client
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Unexpected error handling OS command:', error.message); // Log any unexpected errors
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again.' });
  }
};

exports.handleModuleOsCommand = async (req, res) => {
  const { command } = req.body;
  const userToken = req.user.token;
  const decoded = jwt.verify(userToken, config.API_KEY_JWT);
  req.user = decoded;

  if (!command) {
    return res.status(400).json({ message: 'No command provided' });
  }

  try {
    // Interpret the command using Gemini
    const interpretedCommand = await interpretCommand(command);

    if (interpretedCommand.success === false) {
      return res.status(400).json({ message: interpretedCommand.message });
    }

    // Send the interpreted command to the user's Python module via WebSocket
    sendCommandToAgent(req.user.email, interpretedCommand);

    // Send response back to the frontend
    res.status(200).json({ message: 'Command sent successfully', command: interpretedCommand });
  } catch (error) {
    console.error('Error processing command:', error);
    res.status(500).json({ message: 'Failed to process command' });
  }
};