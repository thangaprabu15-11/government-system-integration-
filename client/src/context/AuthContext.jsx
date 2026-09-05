import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import FirebaseService from '../services/firebaseDb';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('civicbridge_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);

        // Sync to Firebase in the background
        FirebaseService.syncUser(res.data.user, res.data.profile).catch(e => console.warn(e));
      } else {
        localStorage.removeItem('civicbridge_token');
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
      localStorage.removeItem('civicbridge_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('civicbridge_token', res.data.token);
      setUser(res.data.user);

      // Asynchronously sync to Firebase without blocking the UI
      FirebaseService.syncUser(res.data.user, null).catch(fbErr => {
        console.warn('Firebase login async sync:', fbErr);
      });

      // Background profile load without delaying login return
      API.get('/auth/me').then(meRes => {
        if (meRes.data?.success && meRes.data?.profile) {
          setProfile(meRes.data.profile);
        }
      }).catch(() => {});
    }
    return res.data;
  };

  const register = async (name, email, password, role = 'citizen') => {
    const res = await API.post('/auth/register', { name, email, password, role });
    if (res.data.success) {
      localStorage.setItem('civicbridge_token', res.data.token);
      setUser(res.data.user);

      // Asynchronously sync to Firebase without blocking the UI
      FirebaseService.syncUser(res.data.user, null).catch(fbErr => {
        console.warn('Firebase register async sync:', fbErr);
      });

      // Background profile load without delaying register return
      API.get('/auth/me').then(meRes => {
        if (meRes.data?.success && meRes.data?.profile) {
          setProfile(meRes.data.profile);
        }
      }).catch(() => {});
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('civicbridge_token');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, checkLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
