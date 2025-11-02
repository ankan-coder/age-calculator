// src/utils/firebaseAuth.js
import { auth } from '../firebase';

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

