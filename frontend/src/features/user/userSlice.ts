import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  profilepic: string | null;
  _id: string | null;
  email: string | null;
  name: string | null;
  username: string | null;
}

const initialState: UserState = {
  profilepic: null,
  _id: null,
  email: null,
  name: null,
  username: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserState: (state, action: PayloadAction<UserState>) => {
      const stateRef = state;
      stateRef._id = action.payload._id;
      stateRef.email = action.payload.email;
      stateRef.profilepic = action.payload.profilepic;
      stateRef.name = action.payload.name;
      stateRef.username = action.payload.username;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUserState } = userSlice.actions;

export default userSlice.reducer;
