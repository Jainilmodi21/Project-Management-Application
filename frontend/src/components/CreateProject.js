import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css'; // Import custom CSS
import axios from 'axios';
import { useAuth } from "../AuthContext";

function CreateProject() {
  const [projectName, setProjectName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');
  const { login, user } = useAuth();

  console.log(user);
  const navigate=useNavigate();
  const handleCancelProject = () => {
    navigate('/Dashboard'); // Redirect to dashboard page
  };

 
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Prepare the request body with all required fields
      const requestBody = {
          name: projectName,
          startDate: startDate,
          endDate: endDate,
          description: description,
          created_by: user.id, // Assume userId is available (add logic to get it)
          teamMembers: [{user_id:user.id,role:"Project Manager",name:user.name}], // Ensure you are selecting team members properly
          status: 'Active' // Add default status, or pass from a form field
      };
  
      try {
          const response = await fetch('http://localhost:5000/api/project', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),  // Ensure proper body is sent
          });
  
          if (!response.ok) {
              // Handle error responses
              console.log('Error creating project:', response.status);
              throw new Error('Failed to create project');
          }
  
          const data = await response.json();  // Parse JSON response
          console.log('Project Created:', data.project);
  
          // Optionally reset the form
          setProjectName('');
          setEndDate('');
          setStartDate('');
          setDescription('');
  
          // Navigate to the dashboard after successful creation
          navigate('/Dashboard');
  
      } catch (error) {
          console.error('An error occurred:', error);
      }
  };
  // Redirect to Dashboard page
  

  return (
    <div className="container mt-5 newProject-container">
      <h2 className="text-center mb-4">Create New Project</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
        <div className="mb-3">
          <label htmlFor="projectName" className="form-label">Project Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="projectName" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <input 
            type="date" 
            className="form-control" 
            id="startDate" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">End Date</label>
          <input 
            type="date" 
            className="form-control" 
            id="endDate" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea 
            className="form-control" 
            id="description" 
            rows="3" 
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">Create Project</button>
          <button className="btn btn-secondary m-2" onClick={handleCancelProject}>Cancel</button>
        </div>
       
      </form>
    </div>
  );
}

export default CreateProject;
