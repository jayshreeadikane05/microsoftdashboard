import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import { postData } from '../api/api'; 
import { Eye, EyeOff } from 'react-feather'; 

const BASE_API_URL = process.env.BASE_API_URL || "http://192.168.1.10:8000/api";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); 
  const [timer, setTimer] = useState(15 * 60); 
  const [canResendOtp, setCanResendOtp] = useState(false); 
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResendOtp(true); 
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [step, timer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await postData(`${BASE_API_URL}/auth/forgotpassword`, { email });
      if (response && response.status) {
        toast.success(response.message);
        setStep(2); 
        setTimer(15 * 60);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to send reset email. Try again later.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await postData(`${BASE_API_URL}/auth/verifyOtp`, { email, otp });
      if (response && response.status) {
        toast.success("OTP verified. Please enter your new password.");
        setStep(3); // Move to reset password step
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to verify OTP. Try again later.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await postData(`${BASE_API_URL}/auth/resetPassword`, {
        email,
        newPassword
      });
      if (response && response.status) {
        toast.success("Password reset successful.");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword(""); 
        navigate('/login');
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to reset password. Try again later.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setCanResendOtp(false);
    setTimer(15 * 60);
    setOtp("");

    try {
      const response = await postData(`${BASE_API_URL}/auth/forgotpassword`, { email });
      if (response && response.status) {
        toast.success("OTP resent successfully.");
        setStep(2);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to resend OTP. Try again later.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="auth-form-dark text-left py-5 px-4 px-sm-5">
      <h4 className="pt-3">{step === 1 ? "Forgot Password?" : step === 2 ? "Enter OTP" : "Reset Password"}</h4>
      <h6 className="fw-light">
        {step === 1 ? "Enter your email to reset your password."
          : step === 2 ? `Enter the OTP sent to your email. Expires in ${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60} minutes.`
          : "Enter your new password."}
      </h6>

      <form className="pt-3" onSubmit={step === 1 ? handleEmailSubmit : step === 2 ? handleOtpSubmit : handlePasswordReset}>
        {step === 1 && (
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control form-control-lg"
              required
            />
          </div>
        )}

        {step === 2 && (
          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-control form-control-lg"
              required
            />
          </div>
        )}

        {step === 3 && (
          <>
            <div className="form-group">
              <label>New Password</label>
              <div className="input-group">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control form-control-lg"
                  required
                />
                <div className="input-group-append">
                  <button 
                    type="button" 
                    onClick={() => setPasswordVisible(!passwordVisible)} 
                    className="btn btn-outline-secondary eyebuttonf"
                  >
                    {passwordVisible ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-group">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control form-control-lg"
                  required
                />
                <div className="input-group-append">
                  <button 
                    type="button" 
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} 
                    className="btn btn-outline-secondary eyebuttonf"
                  >
                    {confirmPasswordVisible ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-3 d-grid gap-2">
          <button
            className="btn btn-block btn-dark btn-lg fw-medium auth-form-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : step === 1 ? "Send Reset Link" : step === 2 ? "Verify OTP" : "Reset Password"}
          </button>
          
          <button onClick={onBackToLogin} className="btn btn-link mt-2">
            Back to Login
          </button>

          {/* Resend OTP Button */}
          {step === 2 && canResendOtp && (
            <button onClick={handleResendOtp} className="btn btn-link mt-2">
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
