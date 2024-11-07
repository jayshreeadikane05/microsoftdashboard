import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    const emailFromCookie = Cookies.get('email'); 
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString()); // Format the time as needed
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    if (!token) {
      navigate('/login'); 
    } else if (emailFromCookie) {
      setEmail(emailFromCookie); 
    }
    return () => clearInterval(intervalId);

  }, [navigate]);

  const handleSignOut = () => {
    Cookies.remove('token');
    Cookies.remove('email');
    navigate('/login');
  };
  return (
    <nav className="navbar default-layout col-lg-12 col-12 p-0 d-flex align-items-top flex-row">
    <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
      <div className="me-3">
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-bs-toggle="minimize">
          <span className="icon-menu"></span>
        </button>
      </div>
      <div>
        <a className="navbar-brand brand-logo" href="index.html">
          <img src="assets/images/VM-Horizontal-Logo.webp" className='logoimg' alt="logo" />
        </a>
        <a className="navbar-brand brand-logo-mini" href="index.html">
          <img src="assets/images/VM-Horizontal-Logo.webp" className='logoimg' alt="logo" />
        </a>
      </div>
    </div>
    <div className="navbar-menu-wrapper d-flex align-items-top">
      <ul className="navbar-nav">
        <li className="nav-item fw-semibold d-none d-lg-block ms-0">
          <h1 className="welcome-text">Good Morning, <span className="text-black fw-bold">John Doe</span></h1>
          <h3 className="welcome-sub-text">Your performance summary this week </h3>
        </li>
      </ul>
      <ul className="navbar-nav ms-auto">
       
        <li className="nav-item d-none d-lg-block">
        <div className="navbar-time">
        <span className="current-time">{currentTime}</span>
      </div>
        </li>
       
        <li className="nav-item dropdown d-none d-lg-block user-dropdown">
          <a className="nav-link" id="UserDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
            <img className="img-xs rounded-circle" src="assets/images/faces/face8.jpg" alt="Profile image"/> </a>
          <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
            <div className="dropdown-header text-center">
              <img className="img-md rounded-circle" src="assets/images/faces/face8.jpg" alt="Profile image"/>
              <p className="mb-1 mt-3 fw-semibold">Admin</p>
              <p className="fw-light text-muted mb-0">{email}</p> {/* Display the email dynamically */}

            </div>
            <a class="dropdown-item">
              <i class="dropdown-item-icon mdi mdi-account-settings text-primary me-2"></i> 
              <Link className="nav-link" to="/change-password">Change Password</Link>  </a>
            
          
              <a className="dropdown-item" onClick={handleSignOut}>
            <i className="dropdown-item-icon mdi mdi-power text-primary me-2"></i>Sign Out
          </a>         
         
         </div>
        </li>
      </ul>
      <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-bs-toggle="offcanvas">
        <span className="mdi mdi-menu"></span>
      </button>
    </div>
  </nav>
  );
};

export default Navbar;
