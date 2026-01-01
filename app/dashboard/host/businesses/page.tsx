"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUserBusinesses,
  createBusiness,
} from "@/store/features/business/businessSlice";
import { Plus, Hotel, MapPin, Loader2, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

const BusinessListPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { businesses, loading } = useAppSelector((state) => state.business);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBusinessData, setNewBusinessData] = useState({
    name: "",
    slug: "",
    country: "",
    city: "",
    address: "",
    postal_code: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserBusinesses(user.id));
    }
  }, [user?.id, dispatch]);

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setCreating(true);
    try {
      await dispatch(
        createBusiness({ userId: user.id, businessData: newBusinessData })
      ).unwrap();
      setShowCreateModal(false);
      setNewBusinessData({
        name: "",
        slug: "",
        country: "",
        city: "",
        address: "",
        postal_code: "",
        description: "",
      });
    } catch (err) {
      console.error("Failed to create business", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">
              Your Businesses
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Manage your properties and listings from here.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors shadow-lg"
          >
            <Plus size={18} />
            Add New Business
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-dashed border-zinc-300 dark:border-zinc-800">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="text-zinc-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
              No businesses yet
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
              Start by registering your first property. You can manage multiple
              hotels or homestays under one account.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-zinc-900 dark:text-white font-medium hover:underline"
            >
              Register a business now
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() =>
                  router.push(`/dashboard/host/businesses/${business.id}`)
                }
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Hotel size={24} />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      business.status === "published"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {business.status.charAt(0).toUpperCase() +
                      business.status.slice(1)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {business.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 min-h-[40px]">
                  {business.description || "No description provided."}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <MapPin size={14} />
                  {business.city || "Unknown City"},{" "}
                  {business.address || "No address"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
                Register New Business
              </h2>
              <form onSubmit={handleCreateBusiness} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Business Name
                    </label>
                    <input
                      required
                      value={newBusinessData.name}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                      placeholder="The Lodge"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Slug
                    </label>
                    <input
                      required
                      value={newBusinessData.slug}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          slug: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                      placeholder="e.g. the-lodge"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Country
                    </label>
                    <input
                      required
                      value={newBusinessData.country}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          country: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                      placeholder="USA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      City
                    </label>
                    <input
                      required
                      value={newBusinessData.city}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          city: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                      placeholder="Seattle"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Address
                    </label>
                    <input
                      value={newBusinessData.address}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          address: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Postal Code
                    </label>
                    <input
                      value={newBusinessData.postal_code}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          postal_code: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all"
                      placeholder="98101"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newBusinessData.description}
                    onChange={(e) =>
                      setNewBusinessData({
                        ...newBusinessData,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all resize-none"
                    placeholder="Short description..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {creating && <Loader2 className="animate-spin" size={16} />}
                    Create Business
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessListPage;
