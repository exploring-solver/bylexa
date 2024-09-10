import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProject from './components/CreateProject';

const App = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-blue-500 hover:text-blue-700">Projects</Link></li>
            <li><Link to="/create" className="text-blue-500 hover:text-blue-700">Create Project</Link></li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<ProjectList/>} />
        <Route path="/project/:id" element={<ProjectDetail/>} />
        <Route path="/create" element={<CreateProject/>} />
      </Routes>
    </Router>
  );
};

export default App;