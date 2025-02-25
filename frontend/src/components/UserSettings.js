import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext"; // Import the AuthContext to get the current user and logout function
import './UserSettings.css'; // Import custom CSS
import axios from 'axios';

function UserSettings() {
  const { user, logout } = useAuth(); // Get current user and logout from AuthContext
  const navigate = useNavigate(); // For navigation
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [curuser, setUser] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      alert('Please log in to access user settings.');
      navigate('/'); // Redirect to login page
      return;
    }
    // Fetch current user's details
    setUser({
      name: user.name || 'Not Loggedin',
      email: user.email || 'not logged in',
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...curuser, [name]: value });
  };

  const handleEditClick = () => {
    setEditMode(true); // Activate edit mode
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:5000/api/user/${user.id}`, {
        name: curuser.name,
        email: curuser.email,
      });

      if (response.status === 200) {
        // Success: Update user state to reflect changes
        setEditMode(false);
        alert('Profile updated successfully!');
        navigate("/");
      }
    } catch (error) {
      // Handle errors
      console.error('There was an error updating the user data!', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    logout(); // Log out the user
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className="container mt-5 user-settings-container">
      <h1 className="text-center mb-4" id="heading1">User Settings</h1>

      {/* Profile Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Profile Information</h3>
          <button className="btn btn-primary" onClick={handleEditClick}>Edit Profile</button>
        </div>
        <div className="card-body">
          <p><strong>Name:</strong> {editMode ? curuser.name : user.name}</p>
          <p><strong>Email:</strong> {editMode ? curuser.email : user.email}</p>
        </div>
        <div className="card-footer d-flex justify-content-center">
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <>
          <div className="backdrop"></div> {/* Backdrop */}
          <div className="card edit-card">
            <div className="card-header">
              <h3>Edit Profile</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveChanges}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={curuser.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={curuser.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-success" >Save Changes</button>
                <button type="button" className="btn btn-secondary ms-3" onClick={() => setEditMode(false)}>Cancel</button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserSettings;
