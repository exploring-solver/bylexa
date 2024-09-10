import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/Config';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Config.backendUrl}/api/projects`, { name, description });
      const projectId = response.data._id;
      
      await axios.post(`${Config.backendUrl}/api/projects/${projectId}/parse-code`, { code });
      
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="code" className="block mb-1">Microcontroller Code:</label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-2 border rounded h-64 font-mono"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;