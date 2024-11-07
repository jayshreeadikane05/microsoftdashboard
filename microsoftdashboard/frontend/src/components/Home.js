import React from 'react';
import '../assets/css/home.css';  // Adjust the path based on the new location
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handlelogin = () => {
    navigate('/login');

  };

  return (
    <>
     <div className="dashboard-container" style={{
    backgroundColor: 'black',  
    minHeight: '100vh',
    padding: '20px',
    color: 'white',  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/1_HTC1oMKYwC7a8vUBsiplhw.gif)`, 
    backgroundPosition: 'center', 
    backgroundSize: 'cover', 
    backgroundBlendMode: 'darken', 
    backgroundColor: '#00000087', 
   
}}>

        <div className="container">
          <div className="logo-img">
            <div className='d-flex justify-content-between'>
              <img src={`${process.env.PUBLIC_URL}/assets/images/VM-Horizontal-Logo.webp`} alt="Screenshot" />
              {/* Login Button */}
              <div>
                      <a onClick={handlelogin} className="btn btn-primary text-white me-0">
                      <i class="mdi mdi-account-key"></i> Login
        </a>
              </div>
            </div>



            <h1 style={{lineHeight : '56px'}}>
            Build Your Campaign Landing Page Instantly,<br/> No Coding Required!
            </h1>

            <p>Unlock the full potential of your business with our comprehensive suite of technology solutions. </p>

          </div>

          <div className="img-fluid">
            <img src={`${process.env.PUBLIC_URL}/images/apps2.png`} alt="Screenshot" />
          </div>
        </div>
        <footer className="footer" style={{ backgroundColor: '#000',color:'#fff'  }}>
    <div className="d-sm-flex justify-content-center justify-content-sm-between">
      <span className="text-white text-center text-sm-left d-block d-sm-inline-block" style={{color:'#fff'}}>Vereigen Media</span>
      <span className="float-none float-sm-end d-block mt-1 mt-sm-0 text-center">Copyright © 2024. All rights reserved.</span>
    </div>
  </footer>
      </div>
     
    </>
  );
}

export default Home;