import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);
  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };
  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };
  const loginWithGoogle = async (credential) => {
    const response = await authAPI.googleAuth(credential);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };
  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await authAPI.uploadProfilePicture(formData);
    setUser(response.data.user);
    return response.data;
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, updateProfilePicture, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
