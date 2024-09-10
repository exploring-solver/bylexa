import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/Config';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${Config.backendUrl}/api/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <ul className="space-y-2">
        {projects.map(project => (
          <li key={project._id} className="border p-4 rounded">
            <Link to={`/project/${project._id}`} className="text-blue-500 hover:text-blue-700">
              {project.name}
            </Link>
            <p className="text-gray-600">{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;