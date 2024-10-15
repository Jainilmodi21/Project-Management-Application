// // import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
// // import React, { useState } from 'react';
// // import { Link } from 'react-router-dom'; // For routing
// // import './Login.css'; // Import custom CSS
// // import {users} from '../DummyData';

// // function Login() {
// //   const [Email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');

// //   const handleSubmit = (event) => {
// //     event.preventDefault();
// //     // Handle login logic using a secure authentication API
// //     setEmail('');
// //     setPassword('');
// //   };

// //   return (
// //     <div className="login-container d-flex align-items-center justify-content-center vh-100">
// //       <div className="login-card card shadow-lg p-5">
// //         <h1 className="text-center mb-4">Project Management App</h1>
// //         <form onSubmit={handleSubmit}>
// //           <div className="form-group mb-3">
// //             <label htmlFor="Email" className="form-label">
// //               Email
// //             </label>
// //             <input
// //               type="text"
// //               id="Email"
// //               className="form-control"
// //               placeholder="Enter your email"
// //               value={Email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               required
// //             />
// //           </div>
// //           <div className="form-group mb-3">
// //             <label htmlFor="password" className="form-label">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               id="password"
// //               className="form-control"
// //               placeholder="Enter your password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               required
// //             />
// //           </div>
// //           <div className="form-group d-flex justify-content-between align-items-center mb-3">
// //             <div className="form-check">
// //               <input
// //                 className="form-check-input"
// //                 type="checkbox"
// //                 id="rememberMe"
// //                 defaultChecked={false} // Set initial checked state
// //               />
// //               <label className="form-check-label" htmlFor="rememberMe">
// //                 Remember Me
// //               </label>
// //             </div>
// //             <Link to="/forgot-password" className="text-muted">
// //               Forgot Password?
// //             </Link>
// //           </div>
// //           <button type="submit" className="btn btn-primary w-100 mb-3">
// //             Login
// //           </button>
// //         </form>
// //         <div className="text-center">
// //           <span>Don't have an account? </span>
// //           <Link to="/register" className="text-primary">
// //             Sign Up
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Login;
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // For routing
// import { users } from '../DummyData'; // Import the users array
// import './Login.css'; // Import custom CSS

// function Login() {
//   const [Email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate(); // For navigation after login

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // Check if the email and password match a user in the users array
//     const user = users.find((user) => user.email === Email && user.password === password);

//     if (user) {
//       // Successful login
//       setErrorMessage('');
//       console.log('Login successful', user);
//       alert('Login Successfull');
//       navigate('/dashboard'); // Redirect to dashboard or another page after successful login
//     } else {
//       // Failed login
//       setErrorMessage('Invalid email or password. Please try again.');
//     }

//     // Clear input fields
//     setEmail('');
//     setPassword('');
//   };

//   return (
//     <div className="login-container d-flex align-items-center justify-content-center vh-100">
//       <div className="login-card card shadow-lg p-5">
//         <h1 className="text-center mb-4">Project Management App</h1>
//         {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message if login fails */}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group mb-3">
//             <label htmlFor="Email" className="form-label">
//               Email
//             </label>
//             <input
//               type="text"
//               id="Email"
//               className="form-control"
//               placeholder="Enter your email"
//               value={Email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group mb-3">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="form-control"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group d-flex justify-content-between align-items-center mb-3">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="rememberMe"
//               />
//               <label className="form-check-label" htmlFor="rememberMe">
//                 Remember Me
//               </label>
//             </div>
//             <Link to="/forgot-password" className="text-muted">
//               Forgot Password?
//             </Link>
//           </div>
//           <button type="submit" className="btn btn-primary w-100 mb-3">
//             Login
//           </button>
//         </form>
//         <div className="text-center">
//           <span>Don't have an account? </span>
//           <Link to="/register" className="text-primary">
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;


import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // For routing
import { useAuth } from '../AuthContext'; // Import the useAuth hook
import { users } from '../DummyData'; // Import the users array
import './Login.css'; // Import custom CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // For navigation after login
  const { login } = useAuth(); // Get login function from AuthContext

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({password,email}),
    })

    

    if (!response.ok) {
      const errorData = await response.json();
      setErrorMessage('Invalid credentials');
      console.error('Login error:', errorData);
    } else {
      const responseData = await response.json(); // Get the user data from the response
      console.log('Login successful:', responseData);

      // Example of expected response data:
      // responseData = { userId: '123', name: 'John Doe', email: 'john@example.com', token: 'abc123' }

      // Store the authenticated user in the AuthContext
      login({

        id: responseData.id,
        name: responseData.name,
        email: responseData.email,
        token: responseData.token, // Optional: store the token if needed
        password: responseData.password,
      });

      // Reset fields and errors on success
      setEmail('');
      setPassword('');
      setErrorMessage('');

      alert('Login Successful');
      navigate('/dashboard');
    }
  };
    
 

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100">
      <div className="login-card card shadow-lg p-5">
        <h1 className="text-center mb-4">Project Management App</h1>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message if login fails */}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="Email" className="form-label">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group d-flex justify-content-between align-items-center mb-3">
            
            
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>
        <div className="text-center">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
