import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface UserState {
  user: any | null;
  token: string | null;
}

// Try to parse user data safely from cookies
const getUserFromCookie = (): any | null => {
  try {
    const userCookie = Cookies.get('user');
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    // If there's an error parsing, remove the corrupted cookie
    Cookies.remove('user');
    return null;
  }
};

const initialState: UserState = {
  user: getUserFromCookie(),
  token: Cookies.get('token') || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      try {
        Cookies.set('user', JSON.stringify(action.payload.user), { expires: 7 });
        Cookies.set('token', action.payload.token, { expires: 7 });
      } catch (error) {
        console.error('Error setting cookies:', error);
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      
      // Remove all authentication-related cookies
      const cookiesToRemove = ['user', 'token', 'userToken', 'auth', 'session'];
      
      cookiesToRemove.forEach(cookieName => {
        try {
          Cookies.remove(cookieName);
          Cookies.remove(cookieName, { path: '/' });
        } catch (error) {
          console.error(`Error removing ${cookieName} cookie:`, error);
        }
      });
      // Also clear from localStorage and sessionStorage
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      } catch (error) {
        console.error('Error clearing user/token from storage:', error);
      }
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer; 