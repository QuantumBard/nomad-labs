import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

interface UserState {
  // Tier 1: Identity (users table)
  id: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  userType: "traveller" | "manager" | "admin" | "support" | null;
  emailVerified: boolean;
  joinedAt: string | null;

  // Tier 2: Persona (profiles table)
  persona: {
    bio: string | null;
    socials: Record<string, string>;
    language: string | null;
    phoneNumber: string | null;
    preferences: any;
  } | null;

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
  emailVerified: false,
  joinedAt: null,
  persona: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Update auth user and users table
export const updateOnboarding = createAsyncThunk(
  "user/updateOnboarding",
  async (
    { userId, role }: { userId: string; role: "traveller" | "manager" },
    { rejectWithValue }
  ) => {
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { user_type: role },
      });
      if (authError) throw authError;

      const { error: userError } = await supabase
        .from("users")
        .update({ user_type: role })
        .eq("id", userId);
      if (userError) throw userError;

      return role;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Sync to Tier 1: Users table
export const syncUserIdentity = createAsyncThunk(
  "user/syncUserIdentity",
  async (userData: any, { rejectWithValue }) => {
    try {
      console.log("SyncUserIdentity starting for ID:", userData.id);
      const identityData = {
        id: userData.id,
        email: userData.email,
        display_name: userData.displayName,
        photo_url:
          userData.photoURL ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${userData.email}`,
        user_type: userData.userType || "traveller",
        email_verified: userData.isVerified || false,
        updated_at: new Date().toISOString(),
      };

      console.log("Upserting into users table:", identityData);
      const { data, error: upsertError } = await supabase
        .from("users")
        .upsert(identityData, { onConflict: "id" })
        .select();

      if (upsertError) {
        console.error("Supabase Users Upsert Error:", upsertError);
        throw upsertError;
      }

      console.log("Supabase Users Upsert Success:", data);
      return true;
    } catch (err: any) {
      console.error("SyncUserIdentity failed catch block:", err);
      return rejectWithValue(err.message);
    }
  }
);

// Fetch Identity and Persona
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log("Fetching profile for:", userId);
      const [userRes, profileRes] = await Promise.all([
        supabase.from("users").select("*").eq("id", userId).single(),
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

      if (userRes.error) {
        console.error("fetchProfile: Users fetch error:", userRes.error);
        throw userRes.error;
      }

      return {
        identity: userRes.data,
        persona: profileRes.data || null,
      };
    } catch (err: any) {
      console.error("fetchProfile catch error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// Update either table
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    {
      userId,
      updates,
      type,
    }: { userId?: string; updates: any; type: "identity" | "persona" },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { user: UserState };
      const effectiveUserId = userId || state.user.id;

      if (!effectiveUserId)
        throw new Error("No User ID found for profile update");

      const table = type === "identity" ? "users" : "profiles";
      const idCol = type === "identity" ? "id" : "user_id";

      console.log(`Updating ${table} for ${effectiveUserId} with:`, updates);

      let result;

      if (type === "identity") {
        // Identity (Tier 1) record MUST exist, so we use update
        result = await supabase
          .from(table)
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq(idCol, effectiveUserId)
          .select()
          .single();
      } else {
        // Persona (Tier 2) record might NOT exist yet, so we use upsert
        const upsertData = {
          ...updates,
          [idCol]: effectiveUserId,
          updated_at: new Date().toISOString(),
        };

        result = await supabase
          .from(table)
          .upsert(upsertData, { onConflict: idCol })
          .select()
          .single();
      }

      if (result.error) {
        console.error(`updateProfile: ${table} error:`, result.error);
        throw result.error;
      }

      console.log(`updateProfile: ${table} success:`, result.data);
      return { type, data: result.data };
    } catch (err: any) {
      console.error("updateProfile catch error:", err);
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
      state.userType = action.payload.userType;
      state.emailVerified = action.payload.isVerified || false;
      state.isAuthenticated = !!action.payload.id;
    },
    clearUser: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOnboarding.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.userType = action.payload;
      })
      .addCase(updateOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { identity, persona } = action.payload;
        state.displayName = identity.display_name;
        state.photoURL = identity.photo_url;
        state.emailVerified = identity.email_verified;
        state.userType = identity.user_type;
        state.joinedAt = identity.joined_at;

        if (persona) {
          state.persona = {
            bio: persona.bio,
            socials: persona.socials || {},
            language: persona.language,
            phoneNumber: persona.phone_number,
            preferences: persona.preferences || {},
          };
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        if (type === "identity") {
          state.displayName = data.display_name;
          state.photoURL = data.photo_url;
          state.userType = data.user_type;
        } else if (type === "persona") {
          state.persona = {
            bio: data.bio,
            socials: data.socials || {},
            language: data.language,
            phoneNumber: data.phone_number,
            preferences: data.preferences || {},
          };
        }
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
