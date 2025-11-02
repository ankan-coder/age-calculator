// src/utils/firebaseAuth.js
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const SESSION_DURATION_DAYS = 7;
const LOGIN_TIMESTAMP_KEY = 'firebaseAuthLoginTimestamp';

/**
 * Store login timestamp when user logs in
 */
export const storeLoginTimestamp = () => {
  const timestamp = Date.now();
  localStorage.setItem(LOGIN_TIMESTAMP_KEY, timestamp.toString());
};

/**
 * Check if session has expired (7 days)
 * @returns {boolean} True if session is expired
 */
export const isSessionExpired = () => {
  const loginTimestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
  if (!loginTimestamp) {
    return true; // No timestamp means session expired
  }
  
  const loginTime = parseInt(loginTimestamp, 10);
  const currentTime = Date.now();
  const daysSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60 * 24);
  
  return daysSinceLogin >= SESSION_DURATION_DAYS;
};

/**
 * Clear login timestamp
 */
export const clearLoginTimestamp = () => {
  localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
};

/**
 * Check session and sign out if expired
 * @returns {Promise<boolean>} True if session is valid, false if expired
 */
export const validateSession = async () => {
  if (isSessionExpired()) {
    // Clear the timestamp
    clearLoginTimestamp();
    // Sign out the user
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out expired session:', error);
    }
    return false;
  }
  return true;
};

/**
 * Get the current authenticated user's ID token
 * @returns {Promise<string|null>} The ID token or null if not authenticated
 */
export const getAuthToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    
    // Validate session before getting token
    const isValid = await validateSession();
    if (!isValid) {
      return null;
    }
    
    // Get the ID token (this automatically refreshes if needed)
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Get the current authenticated user's UID
 * @returns {string|null} The user ID or null if not authenticated
 */
export const getUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

/**
 * Verify that the user is authenticated before performing operations
 * @throws {Error} If user is not authenticated
 */
export const requireAuth = () => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('User must be authenticated to perform this operation');
  }
  return userId;
};

