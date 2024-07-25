import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const verifyToken = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await axios.get('/api/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Invalid or expired token.', error);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
