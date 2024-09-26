import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/Config';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [commands, setCommands] = useState([]);
  const [newCommand, setNewCommand] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Voice recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  recognition.continuous = true;
  recognition.interimResults = false;

  useEffect(() => {
    const fetchProjectAndCommands = async () => {
      try {
        const projectResponse = await axios.get(`${Config.backendUrl}/api/projects/${id}`);
        setProject(projectResponse.data);

        const commandsResponse = await axios.get(`${Config.backendUrl}/api/commands/project/${id}`);
        setCommands(commandsResponse.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchProjectAndCommands();
  }, [id]);

  const handleExecuteCommand = async () => {
    try {
      const response = await axios.post(`${Config.backendUrl}/api/projects/${id}/execute`, { command: newCommand });
      alert(`Command executed: ${response.data.action}`);
      setNewCommand('');
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

  const toggleListening = () => {
    setIsListening(prevState => !prevState);
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setNewCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    // Cleanup when component is unmounted
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  if (!project) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className='px-20 text-white bg-gray-900 min-h-screen p-6'>
      {/* Project Header */}
      <h2 className="text-4xl font-bold mb-6 text-blue-400">{project.name}</h2>
      <p className="mb-6 text-gray-300">{project.description}</p>
      <a href={`${Config.assistanturl}`} className="mb-6 text-red-600 hover:underline">Click here to visit the online voice assistant</a>
      <br />
      <br />
      <br />
      {/* Commands Section */}
      <h3 className="text-2xl font-semibold mb-4">Available Commands:</h3>
      <ul className="mb-6 space-y-4">
        {commands.map(command => (
          <li key={command._id} className="border border-gray-600 p-4 rounded-lg bg-gray-800">
            <strong className="text-blue-400">{command.name}</strong>: {command.description}
          </li>
        ))}
      </ul>

      {/* Voice Assistant Toggle */}
      <div className="mb-6">
        <button
          onClick={toggleListening}
          className={`px-6 py-2 rounded-lg ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>

      {/* Text Input and Execute Button */}
      <div className="mb-6">
        <input
          type="text"
          value={newCommand}
          onChange={(e) => setNewCommand(e.target.value)}
          placeholder="Enter a command"
          className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 mb-4"
        />
        <button
          onClick={handleExecuteCommand}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Execute Command
        </button>
      </div>

      {/* Microcontroller Integration Section */}
      <h3 className="text-2xl font-semibold mb-4">Microcontroller Integration:</h3>
      <p>To integrate this project with your microcontroller, use the following URL:</p>
      <code className="block bg-gray-800 p-3 rounded-lg text-green-400 mt-4 text-wrap overflow-scroll">
        {`${Config.backendUrl}/api/projects/${id}/current-command`}
      </code>
    </div>
  );
};

export default ProjectDetail;
