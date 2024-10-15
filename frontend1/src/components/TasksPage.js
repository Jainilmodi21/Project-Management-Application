// import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // For navigation
// import axios from 'axios'; // Import axios for making HTTP requests
// import './TasksPage.css'; // Custom styles
// import { useAuth } from "../AuthContext";

// const TasksPage = () => {
//   const navigate = useNavigate(); // To navigate programmatically
//   const [projects, setProjects] = useState([]); // State for projects where user is a team member
//   const { user } = useAuth(); // Auth context to get the current user
//   const [showTaskForm, setShowTaskForm] = useState({}); // Control task form visibility for each project
//   const [tasks,setTasks]=useState([]);
//   const [newTask, setNewTask] = useState({ name: '', description: '', status: 'Ongoing', due_date: '', assignedTo: [] });
//   const [teamMembers, setTeamMembers] = useState([]); // Store team members for the assigned field

//   // Fetch projects and tasks when the component mounts
//   useEffect(() => {
//     const fetchProjectsAndTasks = async () => {
//       try {
//         if (!user) {
//           console.log("User is not logged in.");
//           return; // Exit if user is not logged in
//         }
//         console.log(user);
//         const token = localStorage.getItem('token'); // Fetch token from storage
//     const response = await axios.get(`http://localhost:5000/api/user/${user.id}`, {
//       headers: {
//         Authorization: `Bearer ${token}` // Pass token in the Authorization header
//       }
//     });
//         const fetchedProjects = response.data.user.projects;
//         const fetchedTasks=response.data.user.tasks;
//         setProjects(fetchedProjects); 
//         setTasks(fetchedTasks);
//         console.log(fetchedTasks);
//         // Set the projects state
//         console.log(fetchedProjects);
//       } catch (error) {
//         console.error("Error fetching projects or tasks:", error);
//       }
//     };

//     fetchProjectsAndTasks();
//   }, [user]);

//   // Handle adding a new task
//   const handleAddTask = async (projectId) => {
//     try {
//       console.log("Creating task with data:", newTask); 
//       const response = await axios.post(`http://localhost:5000/api/task/${projectId}`, newTask);
//       setProjects((prevProjects) => prevProjects.map((project) =>
//         project._id === projectId ? { ...project, tasks: [...project.tasks, response.data] } : project
//       ));
//       setShowTaskForm((prev) => ({ ...prev, [projectId]: false })); // Hide the task form after adding the task
//       setNewTask({ name: '', description: '', status: 'Ongoing', due_date: '', assignedTo: [] }); // Reset the task form
//     } catch (error) {
//       console.error("Error adding task:", error);
//     }
//   };

//   // Function to remove a task
//   const handleRemoveTask = async (taskId, projectId) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/task/${projectId}/${taskId}`);
//       setProjects((prevProjects) =>
//         prevProjects.map((project) =>
//           project._id === projectId
//             ? { ...project, tasks: project.tasks.filter((task) => task._id !== taskId) }
//             : project
//         )
//       );
//     } catch (error) {
//       console.error("Error removing task:", error);
//     }
//   };

//   // Fetch team members for a project
//   const fetchTeamMembers = async (projectId) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/project/${projectId}`);
//       setTeamMembers(response.data.teamMembers); // Set the list of team members
//     } catch (error) {
//       console.error("Error fetching team members:", error);
//     }
//   };

//   // Handle the form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewTask({ ...newTask, [name]: value });
//   };

//   const handleAssignedToChange = (e) => {
//     // Convert the selected options into an array of values
//     const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

//     // Update the newTask state with the selected assignedTo values
//     setNewTask(prevTask => ({
//         ...prevTask,
//         assignedTo: selectedOptions  // Set the array of selected user IDs
//     }));
//   };

//   return (
//     <div className="container tasks-page mt-4">
//       {projects.length > 0 ? (
//         projects.map((project) => (
//           <div key={project._id} className="card project-detail-card mb-4">
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h2 className="mb-0">{project.name}
//                 <span className={`badge ${project.status === 'Ongoing' ? 'bg-warning' : 'bg-success'} ms-2`}>
//                   {project.status}
//                 </span>
//               </h2>
//               {project.created_by === user.id && (
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => {
//                     setShowTaskForm((prev) => ({ ...prev, [project._id]: true }));
//                     fetchTeamMembers(project._id); // Fetch team members when opening task form
//                   }}
//                 >
//                   Add Task
//                 </button>
//               )}
//             </div>

//             {/* List of Tasks for the current project */}
//             <div className="card-body">
//               <div className="row">
//               {tasks && tasks.filter((task) => task.project_id === project._id).length > 0 ? (
//                 tasks.filter((task) => task.project_id === project._id).map((task) => (
//                       <div key={task._id} className="col-12 mb-3">
//                         <div className="card h-100 task-card">
//                           <div className="card-body">
//                             <h5 className="card-title">{task.name}</h5>
//                             <p className="card-text">Description: {task.description}</p>
//                             <p className="card-text">
//                               <span className={`badge ${task.status === 'Ongoing' ? 'bg-warning' : 'bg-success'}`}>
//                                 {task.status}
//                               </span>
//                             </p>
//                             <p className="card-text">Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
//                             <div className="d-flex justify-content-between">
//                               <button
//                                 className="btn btn-outline-primary"
//                                 onClick={() => navigate(`/task-details/${task._id}`)}
//                               >
//                                 Manage
//                               </button>
//                               <button
//                                 className="btn btn-danger btn-sm"
//                                 onClick={() => handleRemoveTask(task._id, project._id)}
//                               >
//                                 Remove
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                 ) : (
//                   <p>No tasks found for this project.</p>
//                 )}
//               </div>

//               {/* Add Task Form specific to each project */}
//               {showTaskForm[project._id] && (
//                 <div className="card task-form-card mt-4">
//                   <div className="card-body">
//                     <h5>Add New Task</h5>
//                     <form>
//                       <div className="mb-3">
//                         <label className="form-label">Task Name</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           name="name"
//                           value={newTask.name}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Description</label>
//                         <textarea
//                           className="form-control"
//                           name="description"
//                           value={newTask.description}
//                           onChange={handleInputChange}
//                         ></textarea>
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Due Date</label>
//                         <input
//                           type="date"
//                           className="form-control"
//                           name="due_date"
//                           value={newTask.due_date}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Assign To</label>
//                         <select
//                           className="form-control"
//                           name="assignedTo"
//                           multiple
//                           value={newTask.assignedTo}
//                           onChange={handleAssignedToChange}
//                         >
//                           {teamMembers.map((member) => (
//                             <option key={member.user_id} value={member.user_id}>
//                               {member.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Status</label>
//                         <select
//                           className="form-control"
//                           name="status"
//                           value={newTask.status}
//                           onChange={handleInputChange}
//                         >
//                           <option value="Ongoing">Ongoing</option>
//                           <option value="Completed">Completed</option>
//                         </select>
//                       </div>
//                       <button type="button" className="btn btn-primary" onClick={() => handleAddTask(project._id)}>
//                         Add Task
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No projects found where you are a team member.</p>
//       )}
//     </div>
//   );
// };

// export default TasksPage;

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios'; // Import axios for making HTTP requests
import './TasksPage.css'; // Custom styles
import { useAuth } from "../AuthContext";

const TasksPage = () => {
  const navigate = useNavigate(); // To navigate programmatically
  const [projects, setProjects] = useState([]); // State for projects where user is a team member
  const { user } = useAuth(); // Auth context to get the current user
  const [showTaskForm, setShowTaskForm] = useState({}); // Control task form visibility for each project
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', description: '', status: 'Ongoing', due_date: '', assignedTo: [] });
  const [teamMembers, setTeamMembers] = useState([]); // Store team members for the assigned field

  // Fetch projects and tasks when the component mounts
  useEffect(() => {
    const fetchProjectsAndTasks = async () => {
      try {
        if (!user) {
          console.log("User is not logged in.");
          return; // Exit if user is not logged in
        }
        console.log(user);
        const token = localStorage.getItem('token'); // Fetch token from storage
        const response = await axios.get(`http://localhost:5000/api/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Pass token in the Authorization header
          }
        });
        const fetchedProjects = response.data.user.projects;
        const fetchedTasks = response.data.user.tasks;
        setProjects(fetchedProjects); 
        setTasks(fetchedTasks);
        console.log(fetchedTasks);
        // Set the projects state
        console.log(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects or tasks:", error);
      }
    };

    fetchProjectsAndTasks();
  }, [user,tasks]);

  // Handle adding a new task
  const handleAddTask = async (projectId) => {
    try {
      console.log("Creating task with data:", newTask); 
      const response = await axios.post(`http://localhost:5000/api/task/${projectId}`, newTask);
      setProjects((prevProjects) => prevProjects.map((project) =>
        project._id === projectId ? { ...project, tasks: [...project.tasks, response.data] } : project
      ));
      setShowTaskForm((prev) => ({ ...prev, [projectId]: false })); // Hide the task form after adding the task
      setNewTask({ name: '', description: '', status: 'Ongoing', due_date: '', assignedTo: [] }); // Reset the task form
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Function to remove a task
  const handleRemoveTask = async (taskId, projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/task/${projectId}/${taskId}`);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, tasks: project.tasks.filter((task) => task._id !== taskId) }
            : project
        )
      );
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };

  // Function to approve a task
  const handleApproveTask = async (taskId, projectId) => {
    try {
      await axios.patch(`http://localhost:5000/api/task/${taskId}`,{status:'Approved'});
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task._id === taskId ? { ...task, status: 'Approved' } : task
                )
              }
            : project
        )
      );
    } catch (error) {
      console.error("Error approving task:", error);
    }
  };

  // Fetch team members for a project
  const fetchTeamMembers = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/project/${projectId}`);
      setTeamMembers(response.data.teamMembers); // Set the list of team members
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Handle the form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAssignedToChange = (e) => {
    // Convert the selected options into an array of values
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

    // Update the newTask state with the selected assignedTo values
    setNewTask(prevTask => ({
      ...prevTask,
      assignedTo: selectedOptions  // Set the array of selected user IDs
    }));
  };

  return (
    <div className="container tasks-page mt-4">
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project._id} className="card project-detail-card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="mb-0">{project.name}
                <span className={`badge ${project.status === 'Ongoing' ? 'bg-warning' : 'bg-success'} ms-2`}>
                  {project.status}
                </span>
              </h2>
              {project.created_by === user.id && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowTaskForm((prev) => ({ ...prev, [project._id]: true }));
                    fetchTeamMembers(project._id); // Fetch team members when opening task form
                  }}
                >
                  Add Task
                </button>
              )}
            </div>

            {/* List of Tasks for the current project */}
            <div className="card-body">
              <div className="row">
                {tasks && tasks.filter((task) => task.project_id === project._id).length > 0 ? (
                  tasks.filter((task) => task.project_id === project._id).map((task) => (
                    <div key={task._id} className="col-12 mb-3">
                      <div className="card h-100 task-card">
                        <div className="card-body">
                          <h5 className="card-title">{task.name}</h5>
                          <p className="card-text">Description: {task.description}</p>
                          <p className="card-text">
                            <span className={`badge ${task.status === 'Ongoing' ? 'bg-warning' : 'bg-success'}`}>
                              {task.status}
                            </span>
                          </p>
                          <p className="card-text">Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
                          <div className="d-flex justify-content-between">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => navigate(`/task-details/${task._id}`)}
                            >
                              Manage
                            </button>
                            {project.created_by === user.id && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveTask(task._id, project._id)}
                            >
                              Remove
                            </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No tasks found for this project.</p>
                )}
              </div>

              {/* Approve Tasks Section for Project Managers */}
              {project.created_by === user.id && (
                <div className="mt-4">
                  <h5>Approve Completed Tasks</h5>
                  <div className="row">
                    {tasks.filter((task) =>  task.project_id===project._id &&task.status === 'Completed').length > 0 ? (
                      tasks.filter((task) =>   task.project_id===project._id && task.status === 'Completed').map((task) => (
                        <div key={task._id} className="col-12 mb-3">
                          <div className="card h-100 task-card">
                            <div className="card-body">
                              <h5 className="card-title">{task.name}</h5>
                              <p className="card-text">Description: {task.description}</p>
                              <p className="card-text">
                                <span className="badge bg-success">Completed</span>
                              </p>
                              <div className="d-flex justify-content-between">
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleApproveTask(task._id, project._id)}
                                >
                                  Approve
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No completed tasks to approve.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Task Form for Adding a New Task */}
            {showTaskForm[project._id] && (
              <div className="card mt-4">
                <div className="card-body">
                  <h5>Add New Task</h5>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask(project._id);
                  }}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Task Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={newTask.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={newTask.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="due_date" className="form-label">Due Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="due_date"
                        name="due_date"
                        value={newTask.due_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="assignedTo" className="form-label">Assign To</label>
                      <select
                        className="form-select"
                        id="assignedTo"
                        name="assignedTo"
                        multiple
                        value={newTask.assignedTo}
                        onChange={handleAssignedToChange}
                        required
                      >
                        {teamMembers.map(member => (
                          <option key={member._id} value={member.user_id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Task</button>
                    <button className="btn btn-secondary ms-2" onClick={() => setShowTaskForm((prev) => ({ ...prev, [project._id]: false }))}>Cancel</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

export default TasksPage;
