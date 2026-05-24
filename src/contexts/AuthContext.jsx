import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { Navigate } from 'react-router-dom';
import { upsertUser, setUserOffline } from '../firebase/firestore';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign in with Google popup
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await upsertUser(result.user);
      return result.user;
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
      }
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    setError(null);
    try {
      if (currentUser) {
        await setUserOffline(currentUser.uid);
      }
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Track auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await upsertUser(user);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    // Mark offline on window close
    const handleBeforeUnload = () => {
      if (auth.currentUser) {
        setUserOffline(auth.currentUser.uid);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    setError,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/** RequireAuth component ensures protected routes are accessed only by authenticated users */
export const RequireAuth = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <div className="auth-loading">Loading…</div>;
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default AuthContext;
