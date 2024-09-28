const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY_12607);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.interpretCommand = async (command, availableCommands) => {
  const prompt = `Interpret the following command for an IoT device: "${command}". 
                  Available commands are: ${availableCommands.join(', ')}. 
                  Return the command name from the available list followed by its parameters (if any) as a comma-separated list. 
                  Format the response as: "commandName, param1, param2, ...". 
                  If there are no parameters, just return the command name.Return only the name of the most appropriate command from the available list without bolding or any other statement with it.`;

  try {
    const result = await model.generateContent(prompt);
    console.log("Result", result);
    const interpretedResponse = result.response.text().trim();
    console.log('Interpreted response',interpretedResponse);
    // Split the response into the command name and its parameters
    const [commandName, ...parameters] = interpretedResponse.split(',').map(item => item.trim());
    console.log('command and parameter',commandName,parameters)
    if (availableCommands.includes(commandName)) {
      return { commandName, parameters };
    } else {
      return null; // No valid command found
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to interpret command');
  }
};
