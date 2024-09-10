import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/Config';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [commands, setCommands] = useState([]);
  const [newCommand, setNewCommand] = useState('');

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

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
      <p className="mb-4">{project.description}</p>
      
      <h3 className="text-xl font-bold mb-2">Commands:</h3>
      <ul className="mb-4 space-y-2">
        {commands.map(command => (
          <li key={command._id} className="border p-2 rounded">
            <strong>{command.name}</strong>: {command.description}
          </li>
        ))}
      </ul>
      
      <div className="mb-4">
        <input
          type="text"
          value={newCommand}
          onChange={(e) => setNewCommand(e.target.value)}
          placeholder="Enter a command"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleExecuteCommand}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Execute Command
        </button>
      </div>
      
      <h3 className="text-xl font-bold mb-2">Microcontroller Integration:</h3>
      <p>To integrate this project with your microcontroller, use the following URL:</p>
      <code className="block bg-gray-100 p-2 rounded mt-2">
        {`${window.location.origin}/api/projects/${id}/current-command`}
      </code>
    </div>
  );
};

export default ProjectDetail;