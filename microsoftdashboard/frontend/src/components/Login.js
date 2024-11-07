import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from '../api/api'; 
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'; 
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff } from 'react-feather'; // Ensure you have an icon library for eye icons
import ForgotPassword from './ForgotPassword'; // Import the ForgotPassword component

const Login = () => {
  const [usernameOrEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false); // State to toggle views
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await postData('/auth/login', { usernameOrEmail, password });

      const token = response.data.token;
      const decodedToken = jwtDecode(token);  
      
      Cookies.set('token', token); 
      Cookies.set('email', response.data.email);
      
      const expirationTime = decodedToken.exp * 1000; 
      Cookies.set('token_expiration', expirationTime);

      toast.success("Login successful!"); 
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed: " + (error.message || "Invalid credentials.")); 
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              {forgotPassword ? ( 
                <ForgotPassword onBackToLogin={() => setForgotPassword(false)} />
              ) : (
                <div className="auth-form-dark text-left py-5 px-4 px-sm-5">
                  <div className="brands-logo">
                    <img src="/assets/images/VM-Horizontal-Logo.webp" alt="logo" className="img-fluid logoimg" />
                  </div>
                  <h4 className="pt-3">Hello! let's get started</h4>
                  <h6 className="fw-light">Sign in to continue.</h6>

                  <form className="pt-3" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Username or Email</label>
                      <input
                        type="text"
                        value={usernameOrEmail}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control form-control-lg"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control form-control-lg"
                        required
                      />
                      <div className="text-center mt-2">
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="btn btn-outline-secondary eyebutton"
                          style={{ border: 'none' }}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 d-grid gap-2">
                      <button
                        className="btn btn-block btn-dark btn-lg fw-medium auth-form-btn"
                        type="submit"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-link"
                      onClick={() => setForgotPassword(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
