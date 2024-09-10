const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY_12607);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.interpretCommand = async (command, availableCommands) => {
  const prompt = `Interpret the following command for an IoT device: "${command}". 
                  Available commands are: ${availableCommands.join(', ')}. 
                  Return the most appropriate command from the available list.`;
  
  try {
    const result = await model.generateContent(prompt);
    const interpretedCommand = result.response.text().trim();
    
    if (availableCommands.includes(interpretedCommand)) {
      return interpretedCommand;
    } else {
      return null; // No valid command found
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to interpret command');
  }
};