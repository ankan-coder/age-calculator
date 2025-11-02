// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { validateSession, storeLoginTimestamp } from '../utils/firebaseAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  // Validate session on mount and when user changes
  useEffect(() => {
    if (user) {
      // Validate existing session
      validateSession().then((isValid) => {
        if (!isValid) {
          // Session expired, user will be signed out by validateSession
          return;
        }
        // If user exists and session is valid, ensure timestamp is stored
        // Check if timestamp exists, if not, store it (for existing sessions)
        const timestamp = localStorage.getItem('firebaseAuthLoginTimestamp');
        if (!timestamp) {
          // Store timestamp if not exists (for existing sessions without timestamp)
          storeLoginTimestamp();
        }
      });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

