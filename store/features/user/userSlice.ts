import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

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
  loading: boolean;
  error: string | null;
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
  loading: false,
  error: null,
};

export const updateOnboarding = createAsyncThunk(
  "user/updateOnboarding",
  async (
    { userId, role }: { userId: string; role: "traveller" | "manager" },
    { rejectWithValue }
  ) => {
    try {
      // 1. Update Supabase User Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { user_type: role },
      });
      if (authError) throw authError;

      // 2. Update Profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ user_type: role })
        .eq("id", userId);
      if (profileError) throw profileError;

      return role;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const syncUserProfile = createAsyncThunk(
  "user/syncUserProfile",
  async (userData: any, { rejectWithValue }) => {
    try {
      const profileData = {
        id: userData.id,
        email: userData.email,
        display_name: userData.displayName,
        photo_url:
          userData.photoURL ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${userData.email}`,
        user_type: userData.userType,
        business_name: userData.businessName,
        business_phone: userData.businessPhone,
        is_verified: userData.isVerified,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" });

      if (upsertError?.message.includes("profiles_email_key")) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("email", userData.email);
        if (updateError) throw updateError;
      } else if (upsertError) {
        throw upsertError;
      }

      return true;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<
        Omit<UserState, "isAuthenticated" | "loading" | "error">
      >
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
  extraReducers: (builder) => {
    builder
      .addCase(updateOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.userType = action.payload;
      })
      .addCase(updateOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(syncUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncUserProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(syncUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
