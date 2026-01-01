"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUserBusinesses,
  updateBusiness,
} from "@/store/features/business/businessSlice";
import { fetchListings } from "@/store/features/listings/listingsSlice";
import NewListingDrawer from "@/app/components/dashboard/NewListingDrawer";
import {
  Loader2,
  Building,
  MapPin,
  Save,
  Plus,
  ArrowLeft,
  MoreVertical,
  Home,
  AlertCircle,
} from "lucide-react";
import { Business } from "@/store/features/business/businessSlice";

const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, showToast } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { businesses, loading: businessLoading } = useAppSelector(
    (state) => state.business
  );
  const { items: listings, loading: listingsLoading } = useAppSelector(
    (state) => state.listings
  );

  const [business, setBusiness] = useState<Business | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    address: "",
    city: "",
    state: "",
    phone_number: "",
    postal_code: "",
    country: "",
    lat: "" as string | number,
    lng: "" as string | number,
  });
  const [saving, setSaving] = useState(false);

  // 1. Fetch businesses if not loaded, then find current business
  useEffect(() => {
    if (user?.id) {
      if (businesses.length === 0) {
        dispatch(fetchUserBusinesses(user.id));
      } else {
        const found = businesses.find((b) => b.id === id);
        if (found) {
          setBusiness(found);
          setFormData({
            name: found.name || "",
            slug: found.slug || "",
            description: found.description || "",
            address: found.address || "",
            city: found.city || "",
            state: found.state || "",
            phone_number: found.phone_number || "",
            postal_code: found.postal_code || "",
            country: found.country || "",
            lat: found.location?.lat ?? "",
            lng: found.location?.lng ?? "",
          });
          // Fetch listings for THIS business
          dispatch(fetchListings({ businessId: found.id }));
        }
      }
    }
  }, [user, businesses, id, dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSaving(true);
    try {
      const updates = {
        ...formData,
        location:
          formData.lat && formData.lng
            ? {
                lat: parseFloat(formData.lat as string),
                lng: parseFloat(formData.lng as string),
              }
            : null,
      };

      delete (updates as any).lat;
      delete (updates as any).lng;

      await dispatch(
        updateBusiness({ businessId: business.id, updates })
      ).unwrap();
      showToast("Business details updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update business", "error");
    } finally {
      setSaving(false);
    }
  };

  if (businessLoading && !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-zinc-400" size={32} />
      </div>
    );
  }

  if (!business && !businessLoading && businesses.length > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-center p-8">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Business Not Found
        </h1>
        <p className="text-zinc-500 mt-2 mb-6">
          The business you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <button
          onClick={() => router.push("/dashboard/host/businesses")}
          className="px-6 py-2 bg-zinc-900 text-white rounded-xl"
        >
          Back to Businesses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/dashboard/host/businesses")}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Businesses
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Business Details Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Building size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {business?.name}
                  </h1>
                  <p className="text-sm text-zinc-500">
                    Manage property details
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Business Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Slug (unique URL)
                    </label>
                    <input
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="e.g. highland-retreat"
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Phone Number
                    </label>
                    <input
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Country
                    </label>
                    <input
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        City
                      </label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Postal Code
                      </label>
                      <input
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Location (Lat / Lng)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        name="lat"
                        type="number"
                        step="any"
                        value={formData.lat}
                        onChange={handleInputChange}
                        placeholder="Latitude"
                        className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                      />
                      <input
                        name="lng"
                        type="number"
                        step="any"
                        value={formData.lng}
                        onChange={handleInputChange}
                        placeholder="Longitude"
                        className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      State / Province
                    </label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Listings */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Business Listings
                </h2>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {listingsLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-zinc-400" size={24} />
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <p className="text-sm text-zinc-500 mb-4">
                      No listings for this business yet.
                    </p>
                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className="text-sm text-indigo-600 font-medium hover:underline"
                    >
                      Add your first room
                    </button>
                  </div>
                ) : (
                  listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="group p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30 transition-all flex gap-3"
                    >
                      <div className="w-16 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0">
                        {listing.photos?.[0] ? (
                          <img
                            src={listing.photos[0]}
                            alt={listing.public_title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <Home size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-zinc-900 dark:text-white text-sm truncate">
                          {listing.public_title}
                        </h4>
                        <p className="text-xs text-zinc-500">
                          {listing.listing_type}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] rounded-md font-medium ${
                              listing.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-zinc-200 text-zinc-600"
                            }`}
                          >
                            {listing.status}
                          </span>
                        </div>
                      </div>
                      <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white self-center">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Listing Drawer */}
        {business && (
          <NewListingDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            businessId={business.id}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessDetailPage;
