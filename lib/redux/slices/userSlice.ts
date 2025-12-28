import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  userType: "traveller" | "manager" | "admin" | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  email: null,
  displayName: null,
  photoURL: null,
  userType: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<Omit<UserState, "isAuthenticated">>
    ) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
      state.userType = action.payload.userType;
      state.isAuthenticated = !!action.payload.id;
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.displayName = null;
      state.photoURL = null;
      state.userType = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
