import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For routing
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css'; // Import custom CSS

function Register() {
  const [email, setEmail] = useState(''); // Changed from usernameOrEmail to email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // Optional
  const [avatar, setAvatar] = useState(null); // Optional
  const [errors, setErrors] = useState({}); // State to store validation errors

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input validation
    const validationErrors = {};
    if (!email) {
      validationErrors.email = 'Email is required.'; // Updated error message
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email is invalid.'; // Email format validation
    }
    if (!password) {
      validationErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }
    
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return; // Prevent form submission if validation fails
    // }

    // Handle registration logic using a secure API
    const response = await fetch('http://localhost:5000/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }), // Send data to backend
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Registration error:', errorData);
    } else {
      console.log('Registration successful!');
      // Reset fields and errors on success
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setAvatar(null);
      setErrors({});
    }
  };

  return (
   
    <div className="container mt-5 register-container">
      <h1 className="text-center mb-4">Create Account</h1>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name (Optional)</label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="avatar" className="form-label">Avatar (Optional)</label>
          <input type="file" id="avatar" className="form-control" onChange={(e) => setAvatar(e.target.files[0])} />
          {avatar && <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" className="img-preview mt-2" />}
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
        <div>
            <br/>
          <span>Already have an account? </span>
          <Link to="/" className="text-primary">
            Login
          </Link>
        </div>
      </form>
    </div>
   
  );
}

export default Register;
