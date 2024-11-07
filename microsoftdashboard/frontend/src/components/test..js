import React, { useState } from 'react';

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div style={{ backgroundColor: 'black' }}>
        <div className="container">
          <navbar className="nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <img src="/assets/images/it-logo.webp" style={{ width: "50%" }} alt="Logo" />
            </div>

            {/* Hamburger Button */}
            <div className="hamburger" onClick={toggleMenu} style={{ cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '3px', backgroundColor: 'white', margin: '5px 0' }}></div>
              <div style={{ width: '30px', height: '3px', backgroundColor: 'white', margin: '5px 0' }}></div>
              <div style={{ width: '30px', height: '3px', backgroundColor: 'white', margin: '5px 0' }}></div>
            </div>
          </navbar>

          {/* Conditional Rendering of the Menu */}
          {menuOpen && (
            <div className="menu" style={{ color: 'black', padding: '10px', position: 'absolute', right: 750, top: '5px' }}>
              <ul style={{ listStyle: 'none',display:'flex',gap:"80px",fontSize:"16px" }}>
                <li><a href="#home" style={{color:"white",textDecoration:"none"}} >Home</a></li>
                <li><a href="#about" style={{color:"white",textDecoration:"none"}}>About</a></li>
                <li><a href="#services" style={{color:"white",textDecoration:"none"}}>Services</a></li>
                <li><a href="#contact" style={{color:"white",textDecoration:"none"}}>Contact</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
