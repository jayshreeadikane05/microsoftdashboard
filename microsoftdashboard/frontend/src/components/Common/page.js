import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet will render the child routes
import Navbar from './navbar';
import Sidebar from './sidebar';
import Footer from './footer';

const Page = () => {
  return (
    <div className="container-scroller">
    <div className="page-container">
      <Navbar />
      <div className="container-fluid page-body-wrapper pt-0">
        <Sidebar />
        <div className="main-panel">
          <Outlet /> {/* This is where different content will be rendered */}
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
};

export default Page;
