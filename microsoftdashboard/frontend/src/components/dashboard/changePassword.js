import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from '../../api/api'; 
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'; 
import { Eye, EyeOff } from 'react-feather';
import axios from 'axios';
const BASE_API_URL = process.env.BASE_API_URL || "http://192.168.1.10:8000/api";
const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login'); 
        }
    }, [navigate]);
    const handlePasswordChange = async (e) => {
      e.preventDefault();
  
      if (newPassword !== confirmPassword) {
          toast.error("New password and confirm password do not match.");
          return;
      }
  
      try {
          const token = Cookies.get('token');
  
          const headers = {
              Authorization: `Bearer ${token}` 
          };
  
          const response = await axios.post(`${BASE_API_URL}/pri/changePassword`, 
              { newPassword: newPassword }, 
              { headers: headers } 
          );
  
          if (response.data.status == 1) {
              toast.success(response.data.message);
  
              if (response.data.newToken) {
                  Cookies.set('token', response.data.newToken);
              }

                setModalVisible(true);
              
          } else {
              toast.error(response.data.message);
          }
      } catch (error) {
          toast.error("An error occurred while changing the password.");
          console.error(error);
      }
  };

  const handleReLogin = () => {
    navigate('/login');
};

const handleStay = () => {
    setModalVisible(false);
    navigate('/dashboard'); 
};

    return (
        <div className="content-wrapper">
        <div className="row w-100">
        <div className="content-wrapper d-flex align-items-center auth">
        <div className="col-sm-12  d-flex justify-content-center">
          <div className="card w-50">
            <div className="card-body">
            <h4 className="card-title">Change Password</h4>
             
                <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-group">
                    <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    />
                    <div className="input-group-append">
                    <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff /> : <Eye />}
                    </span>
                    </div>
                </div>
                </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <div className="input-group-append"> 
                      <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </span>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Change Password</button>
                </form>
              </div>
            </div>
          </div>
          </div>
        </div>
      
        {modalVisible && (
          <div
            className="modal fade show d-flex justify-content-center align-items-center"
            style={{ display: 'block' }}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Password Changed</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setModalVisible(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Your password has been changed. Would you like to re-login now?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={handleReLogin}>
                    Re-login
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleStay}>
                    Stay Logged In
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
          
    );
};

export default ChangePassword;
