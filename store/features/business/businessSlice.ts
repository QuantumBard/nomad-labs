import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

export interface Business {
  id: string;
  owner_user_id: string; // references users(id)
  name: string;
  slug?: string;
  description?: string;
  phone_number?: string;
  address?: string;
  location?: { lat: number; lng: number } | any; // geography(POINT,4326)
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  metadata?: any;
  status: "draft" | "published" | "suspended" | "deleted";
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  businesses: [],
  currentBusiness: null,
  loading: false,
  error: null,
};

// Fetch all businesses managed by the user
export const fetchUserBusinesses = createAsyncThunk(
  "business/fetchUserBusinesses",
  async (userId: string, { rejectWithValue }) => {
    try {
      // 1. Fetch businesses owned by user
      const { data: ownedBusinesses, error: ownerError } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_user_id", userId);

      if (ownerError) throw ownerError;

      // 2. Fetch businesses where user is a manager
      const { data: managedBusinessLinks, error: managerError } = await supabase
        .from("business_managers")
        .select("business_id, businesses(*)")
        .eq("user_id", userId);

      if (managerError) throw managerError;

      const managedBusinesses = managedBusinessLinks.map(
        (link: any) => link.businesses
      );

      // Combine and deduplicate
      const allBusinesses = [
        ...(ownedBusinesses || []),
        ...(managedBusinesses || []),
      ];
      const uniqueBusinesses = Array.from(
        new Map(allBusinesses.map((item) => [item.id, item])).values()
      );

      return uniqueBusinesses;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createBusiness = createAsyncThunk(
  "business/createBusiness",
  async (
    {
      userId,
      businessData,
    }: { userId: string; businessData: Partial<Business> },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .insert({
          ...businessData,
          owner_user_id: userId,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;

      // Automatically add creators as manager?
      // Supabase RLS usually handles owner access, but business_managers table is good for explicit roles
      const { error: managerError } = await supabase
        .from("business_managers")
        .insert({
          business_id: data.id,
          user_id: userId,
          role: "owner",
        });

      if (managerError)
        console.warn(
          "Failed to add owner to business_managers linkage",
          managerError
        );

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBusiness = createAsyncThunk(
  "business/updateBusiness",
  async (
    { businessId, updates }: { businessId: string; updates: Partial<Business> },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", businessId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setCurrentBusiness: (state, action: PayloadAction<Business | null>) => {
      state.currentBusiness = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Businesses
      .addCase(fetchUserBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload;
        // Auto-select first business if none selected
        if (!state.currentBusiness && action.payload.length > 0) {
          state.currentBusiness = action.payload[0];
        }
      })
      .addCase(fetchUserBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Business
      .addCase(createBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses.push(action.payload);
        state.currentBusiness = action.payload;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Business
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.businesses.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        if (state.currentBusiness?.id === action.payload.id) {
          state.currentBusiness = action.payload;
        }
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentBusiness, clearError } = businessSlice.actions;
export default businessSlice.reducer;
