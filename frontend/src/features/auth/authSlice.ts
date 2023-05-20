import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateLoginStatus: (state, action: PayloadAction<boolean>) => {
      const stateRef = state;
      stateRef.isLoggedIn = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateLoginStatus } = authSlice.actions;

export default authSlice.reducer;
