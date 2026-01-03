import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

export interface Listing {
  id: string;
  profile_id: string;
  listing_type: string;
  gender_policy: string | null;
  internal_label: string;
  public_title: string;
  total_inventory: number;
  max_occupancy_adults: number;
  max_occupancy_children: number;
  bed_configuration: Record<string, any> | string | null;
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
  uploading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  items: [],
  loading: false,
  uploading: false,
  error: null,
};

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async (
    { profileId, businessId }: { profileId?: string; businessId?: string },
    { rejectWithValue }
  ) => {
    try {
      let query = supabase.from("listings").select("*");

      if (businessId) {
        query = query.eq("business_id", businessId);
      } else if (profileId) {
        // Fallback for legacy or user-based lookups
        query = query.eq("profile_id", profileId);
      } else {
        throw new Error("Most provide either businessId or profileId");
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      return data as Listing[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createListing = createAsyncThunk(
  "listings/createListing",
  async (
    {
      listingData,
      images,
      userId,
      businessId,
    }: { listingData: any; images: File[]; userId: string; businessId: string },
    { rejectWithValue }
  ) => {
    try {
      if (!businessId)
        throw new Error("Business ID is required to create a listing.");

      // Verify Business Exists/Access (Optional but good safety)
      const { data: business, error: businessCheckError } = await supabase
        .from("businesses")
        .select("id")
        .eq("id", businessId)
        .single();

      if (businessCheckError || !business) {
        throw new Error("Invalid Business ID. Please report this issue.");
      }

      // 1. Upload Images
      const photoUrls: string[] = [];
      // console.log("images", images);

      for (const file of images) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `listings/${businessId}/${fileName}`; // Use business ID for deeper org

        const { error: uploadError } = await supabase.storage
          .from("listings")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Image upload error:", uploadError);
          throw new Error(`Failed to upload images: ${uploadError.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("listings").getPublicUrl(filePath);
        photoUrls.push(publicUrl);
      }
      // console.log("photoUrls", photoUrls);

      // 2. Insert Listing
      // listing_type is required by DB check constraint
      // profile_id is kept for legacy/ownership tracking depending on DB schema,
      // but business_id is the new primary grouping.
      const response = await supabase
        .from("listings")
        .insert({
          ...listingData,
          business_id: businessId,
          // profile_id: userId, // Can keep or remove depending on if you dropped the column.
          // Including it ensures backward compat if the column is still NOT NULL
          profile_id: userId,
          photos: photoUrls,
          status: "Active", // or 'inactive' based on your new schema default
          created_at: new Date().toISOString(),
          total_units: listingData.total_units || 1,
        })
        .select()
        .single();

      if (response.error) {
        console.error("Listing insert error:", response.error);
        throw response.error;
      }

      return response.data as Listing;
    } catch (err: any) {
      console.error("Error in createListing thunk:", err);
      return rejectWithValue(err.message || "An unknown error occurred");
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
      })
      .addCase(createListing.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.uploading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addListing, clearListings } = listingsSlice.actions;
export default listingsSlice.reducer;
