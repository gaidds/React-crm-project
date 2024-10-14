import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TokenExpirationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const expirationTime = localStorage.getItem('TokenExpiration');
    if (expirationTime) {
      const timeout = parseInt(expirationTime, 10) - Date.now();
      console.log(timeout)

      // Set a timeout to automatically remove the token when it expires
      const tokenExpirationTimeout = setTimeout(() => {
        localStorage.removeItem('Token');
        localStorage.removeItem('TokenExpiration');
        navigate('/login');
      }, timeout);

      return () => clearTimeout(tokenExpirationTimeout); // Clear timeout on unmount
    }
  }, [navigate]);

  return null;
}

export default TokenExpirationHandler;