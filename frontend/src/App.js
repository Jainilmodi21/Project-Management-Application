import React from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

import { AuthProvider } from './AuthContext';
import Navbar from './Navbar';
import CreateProject from './components/CreateProject';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProjectDetails from './components/ProjectDetails';
import ProjectsPage from './components/ProjectsPage';
import Register from './components/Register';
import TaskDetails from './components/TaskDetails';
import TasksPage from './components/TasksPage';
import TeamManagement from './components/TeamManagement';
import UserSettings from './components/UserSettings';

// A helper component to conditionally render the Navbar
function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render Navbar based on the current path */}
      {location.pathname !== '/' && location.pathname !== '/register'&& <Navbar />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout /> {/* Navbar is conditionally rendered here */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projectspage" element={<ProjectsPage />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/taskspage/:projectId" element={<TasksPage />} />
          <Route path="/taskspage" element={<TasksPage />} />
          <Route path="/task-details/:taskId" element={<TaskDetails />} />
          <Route path="/team-management/:projectId" element={<TeamManagement />} />
          <Route path="/user-settings" element={<UserSettings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
