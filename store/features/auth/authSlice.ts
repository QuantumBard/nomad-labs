import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import { syncUserIdentity } from "../user/userSlice";

interface AuthState {
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
};

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            typeof window !== "undefined" ? window.location.origin : "",
        },
      });
      if (error) throw error;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async (
    { email, pass }: { email: string; pass: string },
    { rejectWithValue }
  ) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async (
    {
      email,
      pass,
      metadata = {},
    }: { email: string; pass: string; metadata?: any },
    { rejectWithValue, dispatch }
  ) => {
    try {
      console.log("Starting signUpWithEmail for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            user_type: metadata.user_type || "traveller",
            full_name: metadata.full_name || email.split("@")[0],
            ...metadata,
          },
        },
      });

      if (error) {
        console.error("Supabase Auth Signup Error:", error);
        throw error;
      }

      console.log("Supabase Auth Signup Success, User ID:", data.user?.id);

      // Sync to users table immediately if signup was successful
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          displayName:
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            null,
          photoURL: data.user.user_metadata?.avatar_url || null,
          userType: data.user.user_metadata?.user_type || "traveller",
          isVerified:
            !!data.user.email_confirmed_at ||
            data.user.user_metadata?.email_verified ||
            data.user.user_metadata?.is_verified ||
            false,
        };

        console.log("Dispatching syncUserIdentity for:", userData.email);

        try {
          // IMPORTANT: Awaiting here to ensure it completes or fails visibly
          await dispatch(syncUserIdentity(userData)).unwrap();
          console.log("Identity sync successful after signup");
        } catch (syncErr: any) {
          console.error(
            "Identity sync failed after signup (in thunk):",
            syncErr
          );
        }
      }

      return data;
    } catch (err: any) {
      console.error("Signup error in authSlice:", err);
      return rejectWithValue(err.message);
    }
  }
);

export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signUpWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signOutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
