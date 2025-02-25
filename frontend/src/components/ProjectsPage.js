// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from "../AuthContext";

// import './ProjectsPage.css'; // Custom CSS

// function ProjectsPage() {
//   const [projectList, setProjectList] = useState([]); // State to store the project list
//   const navigate = useNavigate();

//   // Handle the Create Project button click
//   const handleCreateProject = () => {
//     navigate('/create-project'); // Redirect to the create project page
//   };
//   const { user } = useAuth();
//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/project/${user.id}/projects`); // Adjust the endpoint as necessary
//       const projects = response.data;
//       setProjectList(projects);
//       console.log(projects);
//     }
//     catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProjects(); // Call the function to fetch projects
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h1 className="text-center mb-4" id="heading1">Projects</h1>

//       {/* Create Project Button */}
//       <div className="text-end mb-4">
//         <button className="btn btn-success" onClick={handleCreateProject}>
//           Create Project
//         </button>
//       </div>

//       {/* Project Cards */}
//       <div className="row">
//         {projectList.map((project) => (
//           <div className="col-md-4 mb-4" key={project._id}>
//             <div className="card project-card shadow-sm">
//               <div className="card-body">
//                 <h4 className="card-title">{project.name}</h4>
//                 <p className="card-text">{project.description}</p>
//                 <span className={`badge ${project.status === 'Ongoing' ? 'bg-warning' : 'bg-success'}`}>
//                   {project.status}
//                 </span>
//                 <Link to={`/project/${project._id}`} className="btn btn-primary mt-3">
//                   View Details
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ProjectsPage;


import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../AuthContext";
import './ProjectsPage.css'; // Custom CSS

function ProjectsPage() {
  const [projectList, setProjectList] = useState([]); // State to store the project list
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle the Create Project button click
  const handleCreateProject = () => {
    navigate('/create-project'); // Redirect to the create project page
  };

  // Fetch the list of projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${user.id}/projects`);
      const projects = response.data;
      setProjectList(projects);
    } catch (error) {
      setError('Error fetching projects');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(); // Call the function to fetch projects
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4" id="heading1">Projects</h1>

      {/* Create Project Button */}
      <div className="text-end mb-4">
        <button className="btn btn-success" onClick={handleCreateProject}>
          Create Project
        </button>
      </div>

      {/* No Projects Message */}
      {projectList.length === 0 ? (
        <div className="text-center">
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="row">
          {projectList.map((project) => (
            <div className="col-md-4 mb-4" key={project._id}>
              <div className="card project-card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title">{project.name}</h4>
                  <p className="card-text">{project.description}</p>
                  <span
                    className={`badge ${project.status === 'Ongoing' ? 'bg-warning' : 'bg-success'}`}>
                    {project.status}
                  </span>
                  <Link to={`/project/${project._id}`} className="btn btn-primary mt-3">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;

