import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProjectDetails.css'; // Import custom CSS
import { useAuth } from "../AuthContext";

function ProjectDetails() {
  const { projectId } = useParams(); // Get projectId from URL
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const [isProjectTask, setIsProjectTask] = useState(false);
  const [projectTasks, setProjectTasks] = useState([]);
  const [isTeamMembers, setIsTeamMembers] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // State for handling edit mode
  const [editedProject, setEditedProject] = useState({});
  const [newTeamMember, setNewTeamMember] = useState(''); // Input for adding a new team member
  const [newRole, setNewRole] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false); // Modal visibility
  const { user } = useAuth();
  const loggedInUserId = user.id;

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Fetch project details, tasks, and team members
        const response = await axios.get(`http://localhost:5000/api/project/${projectId}`);
        let { project, tasks, teamMembers } = response.data;
        teamMembers = project.teamMembers;
        console.log(project);
        console.log(tasks);

        if (tasks) {
          setProjectTasks(tasks);
          setIsProjectTask(true);
        }
        setProject(project);
        if (teamMembers) {
          setIsTeamMembers(true);
          setTeamMembers(project.teamMembers || []);
        }

        console.log(teamMembers);
        setEditedProject(project);
      } catch (err) {
        console.error('Error fetching project details:', err);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  // Handle input changes for the editable form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject({ ...editedProject, [name]: value });
  };

  // Function to save the updated project details
  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/project/${projectId}`, editedProject);
      setProject(editedProject);
      setIsEditing(false);
      closeEditModal();
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  const handleAddTeamMember = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/project/${projectId}/team-members`, {
        'user_id': newTeamMember,
        'role': newRole,
      });
      console.log(response.data.project.teamMembers);
      setTeamMembers(response.data.project.teamMembers); // Update team members
      setNewTeamMember('');
      setShowTeamModal(false);
    } catch (err) {
      console.error('Error adding team member:', err);
    }
  };

  const handleRemoveTeamMember = async (member_id) => {
    try {
      // Use a parameterized URL to pass the member_id
      await axios.delete(`http://localhost:5000/api/project/${projectId}/team-members/${member_id}`);
      // Update state to remove the team member from the list
      setTeamMembers(teamMembers.filter((member) => member.user_id !== member_id));
    } catch (err) {
      console.error('Error removing team member:', err);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/project/${projectId}`);
      navigate('/projectsPage'); // Navigate to project list after deletion
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      editedProject.status="Completed";
      console.log(editedProject);
      await axios.patch(`http://localhost:5000/api/project/${projectId}`, editedProject);
      setProject({ ...project, status: 'Completed' });
    } catch (err) {
      console.error('Error marking project as complete:', err);
    }
  };

  const handleRemoveTask = async (taskId) => {
    try {
      // Send a DELETE request to remove the task by its taskId
      await axios.delete(`http://localhost:5000/api/project/${projectId}/${taskId}`);
      // Update the state to remove the task from the list
      setProjectTasks(projectTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error removing task:', err);
    }
  };
  

  const openEditModal = () => {
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
  };

  const openTeamModal = () => {
    setShowTeamModal(true);
  };

  const closeTeamModal = () => {
    setShowTeamModal(false);
  };

  if (!project) {
    return <div>Loading project details...</div>;
  }

  const isCreator = project.created_by === loggedInUserId;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4" id="heading1">Project Details</h1>

      {/* Project Overview Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h2 className="card-title">{project?.name}</h2>
            {isCreator && (
              <button className="btn btn-primary" onClick={openEditModal}>
                Edit
              </button>
            )}
          </div>
          <p className="card-text">{project?.description}</p>
          <h4 className="card-title">
            <pre style={{ fontFamily: 'inherit' }}>
              Start Date: {new Date(project.startDate).toLocaleDateString()}          <span style={{ color: 'red' }}>Due Date:</span> {new Date(project.endDate).toLocaleDateString()}
            </pre>
          </h4>

          <span className={`badge ${project?.status === 'Ongoing' ? 'bg-warning' : 'bg-success'}`}>
            {project?.status}
          </span>
        </div>
      </div>

      {isEditing && (
         <div className="backdrop">
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  name="name"
                  value={editedProject.name || ''}
                  onChange={handleInputChange}
                  placeholder="Project Name"
                  className="form-control mb-2"
                />
                <textarea
                  name="description"
                  value={editedProject.description || ''}
                  onChange={handleInputChange}
                  placeholder="Project Description"
                  className="form-control mb-2"
                />
                <input
                  type="date"
                  name="startDate"
                  value={editedProject.startDate ? editedProject.startDate.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  type="date"
                  name="endDate"
                  value={editedProject.endDate ? editedProject.endDate.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Add Delete and Mark as Complete Buttons */}
      {isCreator && (
        <div className="mb-4 d-flex justify-content-between">
          <button className="btn btn-danger" onClick={handleDeleteProject}>
            Delete Project
          </button>
          <button className="btn btn-success" onClick={handleMarkAsComplete}>
            Mark as Complete
          </button>
        </div>
      )}

      {/* Tasks Section */}
<div className="card shadow-sm mb-4">
  <div className="card-header d-flex justify-content-between align-items-center">
    <h3>Tasks</h3>
    {isCreator && (
      <button
        className="btn btn-outline-primary"
        onClick={() => navigate(`/taskspage/${project._id}`)}
      >
        Manage
      </button>
    )}
  </div>

  {isProjectTask && (
    <ul className="list-group list-group-flush">
      {projectTasks.map((task) => (
        <li
        className="list-group-item d-flex justify-content-between align-items-center"
        key={task._id}
        style={{ cursor: 'pointer' }}
        onClick={isCreator ? () => navigate(`/task-details/${task._id}`) : null}
      >
          <span>{task.name}</span>
          <div>
            <span
              className={`badge ${
                task.status === 'Completed'
                  ? 'bg-success'
                  : task.status === 'Ongoing'
                  ? 'bg-warning'
                  : 'bg-secondary'
              }`}
            >
              {task.status}
            </span>
            {/* Remove Button visible only to project manager */}
            {isCreator && (
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleRemoveTask(task._id)}
              >
                Remove
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>


      {/* Team Members Section */}
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Team Members</h3>
          {isCreator && (
            <button className="btn btn-outline-primary" onClick={openTeamModal}>
              Manage
            </button>
          )}
        </div>
        {isTeamMembers && (
          <ul className="list-group list-group-flush">
            {teamMembers.map((member) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={member._id}>
                {member.name} - <span className="text-muted">{member.role}</span>
                {isCreator && (
                  <button className="btn btn-danger" onClick={() => handleRemoveTeamMember(member.user_id)}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for Managing Team Members */}
      {showTeamModal && (
         <div className="backdrop"> 
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Team Member</h5>
                <button type="button" className="btn-close" onClick={closeTeamModal}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={newTeamMember}
                  onChange={(e) => setNewTeamMember(e.target.value)}
                  placeholder="Enter User ID"
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Enter Role"
                  className="form-control mb-2"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeTeamModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddTeamMember}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
