import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
      <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <NavLink
            className="nav-link"
            to="/dashboard"
          >
            <i className="menu-icon mdi mdi-apps"></i>
            <span className="menu-title">Dashboard</span>
          </NavLink>
        </li>
       
        <li className={`nav-item ${location.pathname === '/generate-lp' ? 'active' : ''}`}>
          <NavLink
            className="nav-link"
            to="/generate-lp"
          >
            <i className="menu-icon mdi mdi-arrange-bring-forward"></i>
            <span className="menu-title">Create LP</span>
          </NavLink>
        </li>
    
        <li className={`nav-item ${location.pathname === '/snippet' ? 'active' : ''}`}>
          <NavLink
            className="nav-link"
            to="/snippet"
          >
            <i className="menu-icon mdi mdi mdi-arrange-send-backward"></i>
            <span className="menu-title">Add Snippet</span>
          </NavLink>
        </li>

      
        <li className={`nav-item ${location.pathname === '/filescollate' ? 'active' : ''}`}>
          <NavLink
            className="nav-link"
            to="/filescollate"
          >
            <i className="menu-icon mdi mdi-card-text-outline"></i>
            <span className="menu-title">Collate Excels</span>
          </NavLink>
        </li>
       

        <li className="nav-item nav-category">Campaign</li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#ui-basic"
            aria-expanded="true"
            aria-controls="ui-basic"
          >
            <i className="menu-icon mdi mdi-floor-plan"></i>
            <span className="menu-title">Campaigns</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse show" id="ui-basic">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <NavLink
                  className={`nav-link ${activePath === '/azure' ? 'active' : ''}`}
                  to="/azure"
                >
                  Azure
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={`nav-link ${activePath === '/bizzapps' ? 'active' : ''}`}
                  to="/bizzapps"
                >
                  BizzApps
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={`nav-link ${activePath === '/modernwork' ? 'active' : ''}`}
                  to="/modernwork"
                >
                  ModernWork
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={`nav-link ${activePath === '/security' ? 'active' : ''}`}
                  to="/security"
                >
                  Security
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={`nav-link ${activePath === '/surface' ? 'active' : ''}`}
                  to="/surface"
                >
                  Surface
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={`nav-link ${activePath === '/power-platform' ? 'active' : ''}`}
                  to="/power-platform"
                >
                  Power Platform
                </NavLink>
              </li>
            </ul>
          </div>

         
        </li>
        <li className={`nav-item ${location.pathname === '/user-management' ? 'active' : ''}`}>
          <NavLink
            className="nav-link"
            to="/user-management"
          >
            <i className="menu-icon mdi mdi-arrange-bring-forward"></i>
            <span className="menu-title">User Management</span>
          </NavLink>
        </li>
      </ul>
    
    </nav>
  );
};

export default Sidebar;
