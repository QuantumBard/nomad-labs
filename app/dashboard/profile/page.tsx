"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Globe,
  Instagram,
  Twitter,
  Facebook,
  Save,
  Loader2,
  Edit2,
  Mail,
  Phone,
  ShieldCheck,
  X,
  Languages,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile, updateProfile } from "@/store/features/user/userSlice";
import { supabase } from "@/lib/supabase";

const ProfilePage = () => {
  const { user, showToast } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUserState = useAppSelector((state) => state.user);
  const { loading: reduxLoading, persona } = reduxUserState;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
    bio: "",
    instagram: "",
    twitter: "",
    facebook: "",
    language: "",
    phoneNumber: "",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Router Guard: If not loading and no user, go home
    if (!reduxLoading && !user) {
      router.push("/");
      return;
    }

    if (user?.id) {
      dispatch(fetchProfile(user.id))
        .unwrap()
        .then((data) => {
          const { identity, persona } = data;
          setFormData({
            displayName: identity.display_name || "",
            photoURL: identity.photo_url || "",
            bio: persona?.bio || "",
            instagram: persona?.socials?.instagram || "",
            twitter: persona?.socials?.twitter || "",
            facebook: persona?.socials?.facebook || "",
            language: persona?.language || "",
            phoneNumber: persona?.phone_number || "",
          });
        });
    }
  }, [user, reduxLoading, dispatch, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profiles").getPublicUrl(filePath);

      await dispatch(
        updateProfile({
          updates: { display_name: formData.displayName, photo_url: publicUrl },
          type: "identity",
        })
      ).unwrap();

      setFormData((prev) => ({ ...prev, photoURL: publicUrl }));
      showToast("Profile picture updated!", "success");
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      // 1. Update Identity (Tier 1)
      await dispatch(
        updateProfile({
          updates: { display_name: formData.displayName },
          type: "identity",
        })
      ).unwrap();

      // 2. Update Persona (Tier 2)
      await dispatch(
        updateProfile({
          updates: {
            bio: formData.bio,
            language: formData.language,
            phone_number: formData.phoneNumber,
            socials: {
              instagram: formData.instagram,
              twitter: formData.twitter,
              facebook: formData.facebook,
            },
          },
          type: "persona",
        })
      ).unwrap();

      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (reduxLoading && !formData.displayName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-serif text-zinc-900 dark:text-white">
              Profile Sanctuary
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              {isEditing
                ? "Refining your personal identity and persona."
                : "Your digital identity in the Nomad world."}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-medium hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all shadow-sm"
            >
              <Edit2
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          /* EDIT FORM VIEW */
          <form
            onSubmit={handleSubmit}
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* Avatar Section */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-8">
              <div className="relative group shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-950 shadow-xl">
                  <img
                    src={
                      formData.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${formData.displayName}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Camera size={16} />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-zinc-900 dark:text-white mb-1">
                  Profile Picture
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                  A premium photograph enhances trust within the community.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-8">
              {/* Tier 1: Identity */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-zinc-400" size={20} />
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    Core Identity
                  </h2>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">
                    Display Name
                  </label>
                  <input
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Tier 2: Persona */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-8 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="text-zinc-400" size={20} />
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    Extended Persona
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Share your story..."
                    className="w-full p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all resize-none italic"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-500">
                      Languages
                    </label>
                    <input
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      placeholder="e.g. English, French"
                      className="w-full p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-500">
                      Phone Number
                    </label>
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Social Presence
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                        <Instagram size={14} /> Instagram
                      </div>
                      <input
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                        <Twitter size={14} /> Twitter
                      </div>
                      <input
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                        <Facebook size={14} /> Facebook
                      </div>
                      <input
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-8 py-4 text-zinc-500 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-50 min-w-[200px]"
              >
                {saving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Complete Updates
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* DISPLAY VIEW */
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* Main Info Card */}
            <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-100 dark:bg-zinc-800/50 rounded-bl-full opacity-30" />

              <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative">
                {/* Large Avatar */}
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-zinc-50 dark:border-zinc-800 shadow-2xl shrink-0 scale-hover transition-transform duration-500">
                  <img
                    src={
                      formData.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${formData.displayName}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div>
                    <h2 className="text-4xl font-serif text-zinc-900 dark:text-white mb-2">
                      {formData.displayName || "Anonymous Nomad"}
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Mail size={14} className="text-zinc-400" />
                        {user?.email}
                      </span>
                      {formData.phoneNumber && (
                        <span className="flex items-center gap-1.5 text-sm">
                          <Phone size={14} className="text-zinc-400" />
                          {formData.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed italic max-w-xl font-light">
                    “
                    {formData.bio ||
                      "Crafting a unique story in every destination. No bio provided yet, but the journey continues."}
                    ”
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    {formData.language && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700">
                        <Languages size={14} />
                        {formData.language}
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/10 rounded-full text-xs font-semibold text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                      <ShieldCheck size={14} />
                      Verified Member
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Footer */}
              {(formData.instagram ||
                formData.twitter ||
                formData.facebook) && (
                <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-center md:justify-start gap-6">
                  {formData.instagram && (
                    <a
                      href={`https://instagram.com/${formData.instagram}`}
                      target="_blank"
                      rel="noopener"
                      className="text-zinc-400 hover:text-pink-500 transition-colors"
                    >
                      <Instagram size={24} />
                    </a>
                  )}
                  {formData.twitter && (
                    <a
                      href={`https://twitter.com/${formData.twitter}`}
                      target="_blank"
                      rel="noopener"
                      className="text-zinc-400 hover:text-sky-500 transition-colors"
                    >
                      <Twitter size={24} />
                    </a>
                  )}
                  {formData.facebook && (
                    <a
                      href={`https://facebook.com/${formData.facebook}`}
                      target="_blank"
                      rel="noopener"
                      className="text-zinc-400 hover:text-blue-600 transition-colors"
                    >
                      <Facebook size={24} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Account Insights (Placeholder for further features) */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  Member Since
                </span>
                <p className="text-xl text-zinc-900 dark:text-white mt-1">
                  {reduxUserState.joinedAt
                    ? new Date(reduxUserState.joinedAt).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )
                    : "January 2026"}
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  {user?.userType === "manager" ? "Stays Hosted" : "Bookings"}
                </span>
                <p className="text-xl text-zinc-900 dark:text-white mt-1">0</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  Achievements
                </span>
                <p className="text-xl text-zinc-900 dark:text-white mt-1">
                  First Nomad
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scale-hover:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
