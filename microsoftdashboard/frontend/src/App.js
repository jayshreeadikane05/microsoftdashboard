import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';  // Home accessible to everyone
import Dashboard from './components/dashboard/dashboard';
import GenerateLP from './components/dashboard/generatelp';
import AzureCampaign from './components/dashboard/azureCampaign';
import BizzappsCampaign from './components/dashboard/bizzappsCampaign';
import ModernworkCampaign from './components/dashboard/modernworkCampaign';
import PowerPlatformCampaign from './components/dashboard/powerPlatformCampaign';
import SecurityCampaign from './components/dashboard/securityCampaign';
import SurfaceCampaign from './components/dashboard/surfaceCampaign';

import ChangePassword from './components/dashboard/changePassword';
import Snippet from './components/dashboard/Sinppet';
import Page from './components/Common/page';
import { ToastContainer } from 'react-toastify'; 
import { PrivateRoute, PublicRoute } from './components/auth/auth';
import FilesCollate from './components/dashboard/FilesCollate';
import UserManagement from './components/dashboard/userManagement';
import AddUser from './components/dashboard/addUser';
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} /> {/* Universal access */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Private routes */}
        <Route path="/" element={<PrivateRoute><Page /></PrivateRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="generate-lp" element={<GenerateLP />} />
          <Route path="filescollate" element={<FilesCollate />} />
          <Route path="user-management" element ={<UserManagement/>} />
          <Route path="add-user" element ={<AddUser/>} />
          <Route path="snippet" element={<Snippet />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="azure" element={<AzureCampaign />} />
          <Route path="bizzapps" element={<BizzappsCampaign />} />
          <Route path="modernwork" element={<ModernworkCampaign />} />
          <Route path="power-platform" element={<PowerPlatformCampaign />} />
          <Route path="security" element={<SecurityCampaign />} />
          <Route path="surface" element={<SurfaceCampaign />} />
 
        </Route>
      </Routes>
      <ToastContainer /> 
    </Router>
  );
}

export default App;
