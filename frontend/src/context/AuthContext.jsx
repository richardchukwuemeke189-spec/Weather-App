import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const res = await axios.get('http://localhost:5000/api/user/me');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setUser(null);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // remove token
    setUser(null);                    // clear user from context
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser: fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);