import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  userType: "traveller" | "manager" | "admin" | null;
  businessName: string | null;
  businessPhone: string | null;
  isVerified: boolean;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  email: null,
  displayName: null,
  photoURL: null,
  userType: null,
  businessName: null,
  businessPhone: null,
  isVerified: false,
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
      state.businessName = action.payload.businessName;
      state.businessPhone = action.payload.businessPhone;
      state.isVerified = action.payload.isVerified;
      state.isAuthenticated = !!action.payload.id;
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.displayName = null;
      state.photoURL = null;
      state.userType = null;
      state.businessName = null;
      state.businessPhone = null;
      state.isVerified = false;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
