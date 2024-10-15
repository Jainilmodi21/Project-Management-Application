import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './Dashboard.css';
import { useAuth } from "../AuthContext";

function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    completedProjects: 0,
    activeProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]); // Fixed array initialization
  const [completedProjects, setCompletedProjects] = useState([]); // Renamed from 'completedProject'
  const [projects, setprojects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]); // Fixed array initialization
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [ongoingProjectsEndDates, setOngoingProjectsEndDates] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetching the projects data
  const fetchProjects = async () => {
    try {
      if (!user) {
        console.log("User is not logged in.");
        return; // Exit if user is not logged in
      }

      const response = await axios.get(`http://localhost:5000/api/user/${user.id}/projects`);
      const projects = response.data;
      setprojects(projects);
      // Calculate metrics
      const totalProjects = projects.length;
      const completedProjectsCount = projects.filter((project) => project.status === 'Completed').length;
      const activeProjectsCount = projects.filter((project) => project.status === 'Active').length;

      setMetrics({
        totalProjects,
        completedProjects: completedProjectsCount,
        activeProjects: activeProjectsCount,
      });

      // Set recent projects and completed projects
      setRecentProjects(projects.filter((project) => project.status === 'Active'));
      setCompletedProjects(projects.filter((project) => project.status === 'Completed'));

      // Collect end dates of ongoing projects
      const ongoingEndDates = projects
        .filter((project) => project.status === 'Active')
        .map((project) => new Date(project.endDate));
      setOngoingProjectsEndDates(ongoingEndDates);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Handle creating a new project
  const handleCreateProject = () => {
    navigate('/create-project');
  };

  // Handle card clicks to open modal with project details
  const handleCardClick = (projectsList, title) => {
    setSelectedProjects(projectsList);
    setModalTitle(title);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProjects([]);
    setModalTitle('');
  };

  // Handle calendar view
  const handleViewCalendar = () => {
    setShowCalendar(true);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
  };

  // Tile content to highlight ongoing projects' end dates on the calendar
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (
        ongoingProjectsEndDates.some(
          (endDate) =>
            endDate.getFullYear() === date.getFullYear() &&
            endDate.getMonth() === date.getMonth() &&
            endDate.getDate() === date.getDate()
        )
      ) {
        return 'highlight-tile';
      }
    }
    return null;
  };

  return (
    <div className="container mt-5 dashboard-container">
      <h1 className="text-center mb-4" id="heading1">
        Dashboard
      </h1>

      {/* Metrics Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div
            className="card text-center shadow-sm"
            onClick={() => handleCardClick(projects, 'Total Projects')}
          >
            <div className="card-body">
              <h5 className="card-title">Total Projects</h5>
              <p className="card-text display-4">{metrics.totalProjects}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card text-center shadow-sm"
            onClick={() => handleCardClick(recentProjects, 'Active Projects')}
          >
            <div className="card-body">
              <h5 className="card-title">Active Projects</h5>
              <p className="card-text display-4">{metrics.activeProjects}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card text-center shadow-sm"
            onClick={() => handleCardClick(completedProjects, 'Completed Projects')}
          >
            <div className="card-body">
              <h5 className="card-title">Completed Projects</h5>
              <p className="card-text display-4">{metrics.completedProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h2>Recent Projects</h2>
        </div>
        <ul className="list-group list-group-flush">
          {recentProjects.length > 0 ? (
            recentProjects.slice(0, 3).map((project) => (
              <li
                className="list-group-item"
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                style={{ cursor: 'pointer' }}
              >
                {project.name}
              </li>
            ))
          ) : (
            <li className="list-group-item">No recent projects available.</li>
          )}
        </ul>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section text-center mt-4">
        <button className="btn btn-primary m-2" onClick={handleCreateProject}>
          Create New Project
        </button>
        <button className="btn btn-secondary m-2" onClick={handleViewCalendar}>
          View Calendar
        </button>
      </div>

      {/* Modal for Project Details */}
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal fade show"
            style={{ display: 'block' }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalTitle}: {selectedProjects.length}
                  </h5>
                </div>
                <div className="modal-body">
                  <ul className="project-list">
                    {selectedProjects.map((project) => (
                      <li key={project._id} className="project-item">
                        {project.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="calendar-backdrop">
          <div className="calendar-card card shadow-sm">
            <div className="card-header">
              <h5>Calendar</h5>
              <button
                type="button"
                className="close"
                onClick={closeCalendar}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="card-body">
              <Calendar tileClassName={tileClassName} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;











// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useEffect, useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Import Axios
// import './Dashboard.css';
// import { useAuth } from "../AuthContext";

// function Dashboard() {
//   const [metrics, setMetrics] = useState({
//     totalProjects: 0,
//     completedProjects: 0,
//     activeProjects: 0,
//   });
//   const [recentProjects, setRecentProjects] = useState([{}]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedProjects, setSelectedProjects] = useState([{}]);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [modalTitle, setModalTitle] = useState('');
//   const [ongoingProjectsEndDates, setOngoingProjectsEndDates] = useState([]);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const fetchProjects = async () => {
//     try {
//       if (!user) {
//         console.log("User is not logged in.");
//         return; // Exit if user is not logged in
//       }
//       console.log(user);
//       const response = await axios.get(`http://localhost:5000/api/user/${user.id}/projects`);
//       const projects = response.data; // Access the actual project data

//       // Calculate metrics
//       const totalProjects = projects.length;
//       const completedProjects = projects.filter((project) => project.status === 'Completed').length;
//       const activeProjects = projects.filter((project) => project.status === 'Active').length;

//       setMetrics({
//         totalProjects,
//         completedProjects,
//         activeProjects,
//       });

      

//       // Set recent projects (filter for active projects)
//       setRecentProjects(activeProjects);

//       // Collect end dates of ongoing projects
//       const ongoingEndDates = projects
//         .filter((project) => project.status === 'Active')
//         .map((project) => new Date(project.endDate));
//       setOngoingProjectsEndDates(ongoingEndDates);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchProjects(); // Call the function to fetch projects when the user is available
//     }
//   }, [user]); // Fetch projects when user changes

//   const handleCreateProject = () => {
//     navigate('/create-project');
//   };

//   const handleCardClick = (projectsList, title) => {
//     setSelectedProjects(projectsList);
//     setModalTitle(title);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedProjects([]);
//     setModalTitle('');
//   };

//   const handleViewCalendar = () => {
//     setShowCalendar(true);
//   };

//   const closeCalendar = () => {
//     setShowCalendar(false);
//   };

//   // Tile content to highlight ongoing projects' end dates on the calendar
//   const tileClassName = ({ date, view }) => {
//     if (view === 'month') {
//       if (
//         ongoingProjectsEndDates.some(
//           (endDate) =>
//             endDate.getFullYear() === date.getFullYear() &&
//             endDate.getMonth() === date.getMonth() &&
//             endDate.getDate() === date.getDate()
//         )
//       ) {
//         return 'highlight-tile';
//       }
//     }
//     return null;
//   };

//   return (
//     <div className="container mt-5 dashboard-container">
//       <h1 className="text-center mb-4" id="heading1">
//         Dashboard
//       </h1>

//       {/* Metrics Section */}
//       <div className="row mb-4">
//         <div className="col-md-4">
//           <div
//             className="card text-center shadow-sm"
//             onClick={() => handleCardClick(recentProjects, 'Total Projects')}
//           >
//             <div className="card-body">
//               <h5 className="card-title">Total Projects</h5>
//               <p className="card-text display-4">{metrics.totalProjects}</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div
//             className="card text-center shadow-sm"
//             onClick={() =>
//               handleCardClick(
//                 recentProjects.filter((project) => project.status === 'Active'),
//                 'Active Projects'
//               )
//             }
//           >
//             <div className="card-body">
//               <h5 className="card-title">Active Projects</h5>
//               <p className="card-text display-4">{metrics.activeProjects}</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div
//             className="card text-center shadow-sm"
//             onClick={() =>
//               handleCardClick(
//                 recentProjects.filter((project) => project.status === 'Completed'),
//                 'Completed Projects'
//               )
//             }
//           >
//             <div className="card-body">
//               <h5 className="card-title">Completed Projects</h5>
//               <p className="card-text display-4">{metrics.completedProjects}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Projects Section */}
//       <div className="card shadow-sm mb-4">
//         <div className="card-header">
//           <h2>Recent Projects</h2>
//         </div>
//         <ul className="list-group list-group-flush">
//           {Array.isArray(recentProjects) && recentProjects.length > 0 ? (
//             recentProjects.slice(0, 3).map((project) => (
//               <li
//                 className="list-group-item"
//                 key={project._id}
//                 onClick={() => navigate(`/project/${project._id}`)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 {project.name}
//               </li>
//             ))
//           ) : (
//             <li className="list-group-item">No recent projects available.</li>
//           )}
//         </ul>
//       </div>

//       {/* Quick Actions Section */}
//       <div className="quick-actions-section text-center mt-4">
//         <button className="btn btn-primary m-2" onClick={handleCreateProject}>
//           Create New Project
//         </button>
//         <button className="btn btn-secondary m-2" onClick={handleViewCalendar}>
//           View Calendar
//         </button>
//       </div>

//       {/* Modal for Project Details */}
//       {showModal && (
//         <div className="modal-backdrop" onClick={closeModal}>
//           <div
//             className="modal fade show"
//             style={{ display: 'block' }}
//             tabIndex="-1"
//             role="dialog"
//           >
//             <div className="modal-dialog" role="document">
//               <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                 <div className="modal-header">
//                   <h5 className="modal-title">
//                     {modalTitle}: {selectedProjects.length}
//                   </h5>
//                 </div>

//                 <div className="modal-body">
//                   <ul className="project-list">
//                     {selectedProjects.map((project) => (
//                       <li key={project._id} className="project-item">
//                         {project.name}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={closeModal}>
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Calendar Modal */}
//       {showCalendar && (
//         <div className="calendar-backdrop">
//           <div className="calendar-card card shadow-sm">
//             <div className="card-header">
//               <h5>Calendar</h5>
//               <button
//                 type="button"
//                 className="close"
//                 onClick={closeCalendar}
//                 aria-label="Close"
//               >
//                 <span aria-hidden="true">&times;</span>
//               </button>
//             </div>
//             <div className="card-body">
//               <Calendar tileClassName={tileClassName} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;
