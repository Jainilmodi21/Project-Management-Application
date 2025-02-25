
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TaskDetails.css'; // Add your custom styles
import { useAuth } from "../AuthContext"; // Import your AuthContext to get the logged-in user

const TaskDetails = () => {
  const { taskId } = useParams(); // Get the task ID from the route
  const [task, setTask] = useState(null); // State to hold task details
  const { user } = useAuth(); // Get the current user from the auth context
  const [file, setFile] = useState(null); // File state for attachments

  // Fetch task details from the backend when the component mounts
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/task/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` } // Send token for auth
        });
        setTask(response.data.task); // Set the fetched task
        console.log("Task details:", response.data.task);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  
  // Handle marking the task as done
  const handleMarkAsDone = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/task/${taskId}`, { status: 'Completed' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTask((prevTask) => ({ ...prevTask, status: 'Completed' })); // Update task status in UI
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file
  };

  // Submit the file to the backend
  // const handleFileUpload = async () => {
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const token = localStorage.getItem('token');
  //     await axios.post(`http://localhost:5000/api/task/${taskId}/upload`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data' // Important for file uploads
  //       }
  //     });
  //     alert('File uploaded successfully!');
  //     setFile(null); // Clear the file after upload
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  //};

  if (!task) return <p>Loading task details...</p>; // Show a loading message if task is not loaded yet

  return (
    <div className="container tasks-page mt-4">
      <div key={taskId} className="card task-detail-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>{task.name}</h2>
          {task.status!="Approved" &&
          <button className="btn btn-success" onClick={handleMarkAsDone}>
            Mark as Done
          </button>
          }
        </div>
        <div className="card-body">
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Status:</strong> 
            <span className={`badge ${task.status === 'Ongoing' ? 'bg-warning' : 'bg-success'}`}>
              {task.status}
            </span>
          </p>
          <p><strong>Due Date:</strong> {new Date(task.due_date).toLocaleDateString()}</p>
          <p><strong>Assigned To:</strong> {task.assignedTo && task.assignedTo.map(user => user.name).join(', ')}</p>

          {/* File upload section
          <div className="mb-3">
            <input type="file" onChange={handleFileChange} />
            <button className="btn btn-primary mt-2" onClick={handleFileUpload}>
              Upload File
            </button>
          </div>

          {/* Attachments list */}
          {/* {task.attachments && task.attachments.length > 0 && (
            <div>
              <h5>Attachments</h5>
              <ul className="list-group">
                {task.attachments.map((attachment, index) => (
                  <li key={index} className="list-group-item">
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">{attachment.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
