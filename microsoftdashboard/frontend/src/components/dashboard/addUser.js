import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from 'react-feather';

const BASE_API_URL = process.env.BASE_API_URL || "http://192.168.1.10:8000/api";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setUsername(generateUsername(emailValue)); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${BASE_API_URL}/pri/addUser`,
        { email, username, password, role: userRole }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("User added successfully!");
      navigate("/user-management"); 
    } catch (error) {
      toast.error("Failed to add user.");
      console.error("Error adding user:", error);
    } finally {
      setLoading(false); 
    }
  };

  const generateUsername = (email) => {
    if (!email) return ""; 
    const emailParts = email.split("@");
    const uniquePart = Date.now();
    return `${emailParts[0]}_${uniquePart}`; 
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <h2>Add User</h2>
                <form className="pt-3" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="form-control form-control-lg"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={username} 
                      readOnly 
                      className="form-control form-control-lg"
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
                  <div className="form-group">
                    <label>User Role</label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="form-control form-control-lg"
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      {/* Add more roles as needed */}
                    </select>
                  </div>
                  <div className="mt-3 d-grid gap-2">
                    <button
                      className="btn btn-block btn-dark btn-lg fw-medium auth-form-btn"
                      type="submit"
                      disabled={loading} // Disable button while loading
                    >
                      {loading ? "Adding..." : "Add User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddUser;
