import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { setAuthToken } from '../Services/api';

export const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'https://bharathan56-citnow-backend.hf.space';

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;
  const role = user?.role;

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.append('username', username);
      form.append('password', password);

      const res = await axios.post(`${API_BASE}/dealer/login`, form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const accessToken = res.data?.access_token;
      if (!accessToken) throw new Error('Invalid token response from server');

      setToken(accessToken);
      setAuthToken(accessToken);

      const meResponse = await axios.get(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (meResponse.data.role !== 'dealer_user') {
        throw new Error('Please use the admin portal to login');
      }

      setUser(meResponse.data);
      return true;
    } catch (error) {
      console.error('Login error details:', error);
      throw new Error(
        error.response?.data?.detail || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  }, []);

  // ADD UPDATE PROFILE FUNCTION FOR DEALER USERS
  const updateProfile = useCallback(async (profileData) => {
  setLoading(true);
  try {
    const response = await axios.put(`${API_BASE}/users/me`, profileData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    setUser(prevUser => ({
      ...prevUser,
      ...response.data
    }));

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        'Failed to update profile';
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
}, [token]);

  useEffect(() => {
    // Reset auth header when token changes
    setAuthToken(token);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      isAuthenticated,
      loading,
      login,
      logout,
      updateProfile, 
      API_BASE,
    }),
    [token, user, role, isAuthenticated, loading, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
