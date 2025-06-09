import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser as setReduxUser, clearUser as clearReduxUser } from '../store/userSlice';

interface User {
  email: string;
  name: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER = {
  email: 'khan@gmail.com',
  name: 'khan Rustam',
  username: 'khan'
};
const DEFAULT_PASSWORD = '12345';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: any) => state.user.user);
  
  // Keep local state in sync with Redux state
  const [user, setUser] = useState<User | null>(reduxUser);
  
  // Sync with Redux store changes
  useEffect(() => {
    setUser(reduxUser);
  }, [reduxUser]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (email === DEFAULT_USER.email && password === DEFAULT_PASSWORD) {
        // Update Redux store first
        dispatch(setReduxUser({
          user: DEFAULT_USER,
          token: 'mock-token-12345'
        }));
        setUser(DEFAULT_USER);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    // Clear Redux store
    dispatch(clearReduxUser());
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};