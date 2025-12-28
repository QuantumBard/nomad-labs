import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

interface Listing {
  id: string;
  profile_id: string;
  listing_type: string;
  gender_policy: string | null;
  internal_label: string;
  public_title: string;
  total_inventory: number;
  max_occupancy_adults: number;
  max_occupancy_children: number;
  bed_configuration: any;
  bathroom_type: string;
  base_nightly_rate: number;
  weekend_markup: boolean;
  extra_guest_charge: string;
  cancellation_policy: string;
  amenities: string[];
  view_from_room: string;
  description: string;
  status: string;
  created_at: string;
  photos?: string[];
}

interface ListingsState {
  items: Listing[];
  loading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async (profileId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Listing[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    addListing: (state, action: PayloadAction<Listing>) => {
      state.items.unshift(action.payload);
    },
    clearListings: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addListing, clearListings } = listingsSlice.actions;
export default listingsSlice.reducer;
