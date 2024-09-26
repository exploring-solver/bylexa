import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProject from './components/CreateProject';
import DocumentationPage from './components/DocumentationPage';

const App = () => {
  return (
    <Router>
      <div className=" px-10 p-4 bg-gray-900">
        <nav className="mb-4">
          <ul className="flex justify-between flex-wrap ">
            <li><Link to="/" className="text-blue-500 underline hover:text-blue-700">Projects</Link></li>
            <li><Link to="/create" className="text-blue-500 underline hover:text-blue-700">Create Project</Link></li>
            <li><Link to="/documentation" className="text-blue-500 underline hover:text-blue-700">Documentation/Guide</Link></li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<ProjectList/>} />
        <Route path="/project/:id" element={<ProjectDetail/>} />
        <Route path="/create" element={<CreateProject/>} />
        <Route path="/documentation" element={<DocumentationPage/>} />
      </Routes>
    </Router>
  );
};

export default App;