import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projects, users } from '../DummyData';
import './TeamManagement.css';

function TeamManagement() {
  const { projectId } = useParams(); // Get project ID from URL
  const [teamMembers, setTeamMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // Track which modal is open
  const [selectedMember, setSelectedMember] = useState(null); // For edit/remove actions
  const [newMember, setNewMember] = useState({ name: '', role: '' });

  // Fetch the team members based on projectId
  useEffect(() => {
    // Simulate fetching data from the backend
    const selectedProject = projects.find((project) => project._id === projectId);
    if (selectedProject && selectedProject.teamMembers) {
      const members = selectedProject.teamMembers.map((member) => {
        const foundUser = users.find((user) => user._id === member.user_id);
        if (!foundUser) {
          console.log(`No user found with ID: ${member.user_id}`);
        }
        return foundUser ? { ...foundUser, role: member.role } : null; // Add role to user
      }).filter(Boolean); // Filter out any null values in case of unmatched user IDs

      console.log(members);

      setTeamMembers(members);
    } else {
      setTeamMembers([]); // Set to empty array if no members found
    }
  }, [projectId]);

  const handleAddMember = () => {
    setModalType('add');
    setShowModal(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setModalType('edit');
    setShowModal(true);
  };

  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setModalType('remove');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMember(null);
    setNewMember({ name: '', role: ''});
  };

  const handleSave = () => {
    if (modalType === 'add') {
      setTeamMembers([...teamMembers, { ...newMember, id: teamMembers.length + 1 }]);
    } else if (modalType === 'edit') {
      setTeamMembers(teamMembers.map((member) => (member._id === selectedMember._id ? selectedMember : member)));
    } else if (modalType === 'remove') {
      setTeamMembers(teamMembers.filter((member) => member._id !== selectedMember._id));
    }
    closeModal();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4" id="heading1">Team Management</h1>

      {/* Team Members Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Team Members</h3>
          <button className="btn btn-primary" onClick={handleAddMember}>Add Member</button>
        </div>
        <ul className="list-group list-group-flush">
          {teamMembers.length > 0 ? teamMembers.map((member) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={member._id}>
              <div>
                <strong>{member.name}</strong> <span className="badge bg-info ms-2">{member.role}</span>
              </div>
              <div className="d-flex align-items-center">
                {/* <span className="badge bg-secondary me-3">{member.permissions}</span> */}
                <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => handleEditMember(member)}>Edit</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveMember(member)}>Remove</button>
              </div>
            </li>
          )) : (
            <li className="list-group-item text-center">No members found for this project</li>
          )}
        </ul>
      </div>

      {/* Manage Permissions Section */}
      {/* <div className="card shadow-sm">
        <div className="card-body">
          <h4>Manage Permissions</h4>
          <p>Use this section to manage team member roles and permissions.</p>
          <button className="btn btn-warning">Manage Roles</button>
        </div>
      </div> */}

      {/* Modal for Add, Edit, Remove */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card card shadow-sm">
            <div className="card-header d-flex justify-content-between">
              <h5>{modalType === 'add' ? 'Add New Member' : modalType === 'edit' ? 'Edit Member' : 'Remove Member'}</h5>
              <button type="button" className="close" onClick={closeModal}>&times;</button>
            </div>
            <div className="card-body">
              {modalType === 'add' && (
                <form>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input type="text" className="form-control" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} />
                  </div>
                  {/* <div className="mb-3">
                    <label className="form-label">Permissions</label>
                    <input type="text" className="form-control" value={newMember.permissions} onChange={(e) => setNewMember({ ...newMember, permissions: e.target.value })} />
                  </div> */}
                </form>
              )}

              {modalType === 'edit' && (
                <form>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={selectedMember.name} onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input type="text" className="form-control" value={selectedMember.role} onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })} />
                  </div>
                  {/* <div className="mb-3">
                    <label className="form-label">Permissions</label>
                    <input type="text" className="form-control" value={selectedMember.permissions} onChange={(e) => setSelectedMember({ ...selectedMember, permissions: e.target.value })} />
                  </div> */}
                </form>
              )}

              {modalType === 'remove' && (
                <p>Are you sure you want to remove {selectedMember?.name}?</p>
              )}
            </div>
            <div className="card-footer text-end">
              <button className="btn btn-secondary me-2" onClick={closeModal}>Cancel</button>
              {modalType !== 'remove' ? (
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              ) : (
                <button className="btn btn-danger" onClick={handleSave}>Remove</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
