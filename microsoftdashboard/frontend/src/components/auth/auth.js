import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Middleware-like private route
export const PrivateRoute = ({ children }) => {
  const token = Cookies.get('token'); 
  const tokenExpired = isTokenExpired(token); 

  if (!token || tokenExpired) {
    Cookies.remove('token'); 
    return <Navigate to="/login" />; 
  }

  return children;  
};

export const PublicRoute = ({ children }) => {
  const token = Cookies.get('token');
  const tokenExpired = isTokenExpired(token); 
  if (token && !tokenExpired) {
    return <Navigate to="/dashboard" />; 
  }

  return children;
};
