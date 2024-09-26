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
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      <div className='max-w-3xl mx-auto'>
        <h2 className="text-4xl font-bold mb-8 text-blue-400">Create New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-lg">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-2 text-lg">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="code" className="block mb-2 text-lg">Microcontroller Code:</label>
            <textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-green-400 h-64 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
