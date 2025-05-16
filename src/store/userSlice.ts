import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface UserState {
  user: any | null;
  token: string | null;
}

const initialState: UserState = {
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null,
  token: Cookies.get('token') || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      Cookies.set('user', JSON.stringify(action.payload.user));
      Cookies.set('token', action.payload.token);
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove('user');
      Cookies.remove('token');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer; 