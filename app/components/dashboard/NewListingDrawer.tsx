"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Upload,
  Info,
  ChevronRight,
  Bed,
  Users,
  IndianRupee,
  ShieldCheck,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import heic2any from "heic2any";

import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createListing } from "@/store/features/listings/listingsSlice";

interface NewListingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewListingDrawer: React.FC<NewListingDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { uploading, error: reduxError } = useAppSelector(
    (state) => state.listings
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [listingType, setListingType] = useState("Hotel Room");
  const [genderPolicy, setGenderPolicy] = useState("Mixed");
  const [internalLabel, setInternalLabel] = useState("");
  const [publicTitle, setPublicTitle] = useState("");
  const [totalInventory, setTotalInventory] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [beds, setBeds] = useState([{ quantity: 1, type: "King" }]);
  const [bathroomType, setBathroomType] = useState("Ensuite");
  const [baseRate, setBaseRate] = useState("");
  const [weekendMarkup, setWeekendMarkup] = useState(false);
  const [extraGuestCharge, setExtraGuestCharge] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("Flexible");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [viewFromRoom, setViewFromRoom] = useState("City View");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const addBed = () => {
    setBeds([...beds, { quantity: 1, type: "King" }]);
  };

  const removeBed = (index: number) => {
    setBeds(beds.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addImages(selectedFiles);
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  const addImages = async (files: File[]) => {
    const validFiles = files.filter((file) => {
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      return (
        type.startsWith("image/") ||
        name.endsWith(".heic") ||
        name.endsWith(".heif")
      );
    });

    if (validFiles.length === 0) return;

    for (const file of validFiles) {
      let fileToProcess = file;

      // Handle HEIC/HEIF conversion
      if (
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif") ||
        file.type === "image/heic" ||
        file.type === "image/heif"
      ) {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });

          // heic2any can return an array if multiple images are in the HEIC
          const blob = Array.isArray(convertedBlob)
            ? convertedBlob[0]
            : convertedBlob;

          fileToProcess = new File(
            [blob],
            file.name.replace(/\.(heic|heif)$/i, ".jpg"),
            { type: "image/jpeg" }
          );
        } catch (err) {
          console.error("HEIC conversion failed:", err);
          continue; // Skip this file if conversion fails
        }
      }

      setImages((prev) => [...prev, fileToProcess]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(fileToProcess);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addImages(droppedFiles);
    }
  };

  const handleSaveListing = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      if (!baseRate || isNaN(parseFloat(baseRate))) {
        throw new Error("Please enter a valid base rate");
      }

      if (!publicTitle) {
        throw new Error("Please enter a public title");
      }

      const listingData = {
        listing_type: listingType,
        gender_policy: listingType === "Hostel Bed" ? genderPolicy : null,
        internal_label: internalLabel,
        public_title: publicTitle,
        total_inventory: totalInventory,
        max_occupancy_adults: adults,
        max_occupancy_children: children,
        bed_configuration: beds,
        bathroom_type: bathroomType,
        base_nightly_rate: parseFloat(baseRate),
        weekend_markup: weekendMarkup,
        extra_guest_charge: extraGuestCharge,
        cancellation_policy: cancellationPolicy,
        amenities: amenities,
        view_from_room: viewFromRoom,
        description: description,
      };

      const resultAction = await dispatch(
        createListing({ listingData, images, userId: user.id })
      );

      if (createListing.fulfilled.match(resultAction)) {
        onClose();
      } else {
        throw new Error(resultAction.payload as string);
      }
    } catch (err: any) {
      console.error("Error saving listing:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-white dark:bg-zinc-950 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-serif text-zinc-900 dark:text-white">
              Create New Listing
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Add a new unit to your property inventory.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors text-zinc-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {(error || reduxError) && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl">
              {error || reduxError}
            </div>
          )}
          {/* Section 1: Core Identity */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Core Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Listing Type
                </label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                >
                  <option>Hotel Room</option>
                  <option>Hostel Bed</option>
                  <option>Entire Homestay</option>
                </select>
                {listingType === "Hostel Bed" && (
                  <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Dorm Gender Policy
                    </label>
                    <div className="flex gap-4">
                      {["Mixed", "Female-only", "Male-only"].map((policy) => (
                        <label
                          key={policy}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="gender"
                            checked={genderPolicy === policy}
                            onChange={() => setGenderPolicy(policy)}
                            className="accent-zinc-900 dark:accent-white"
                          />
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {policy}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                    Internal Label
                    <Info size={14} className="text-zinc-400" />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 304"
                    value={internalLabel}
                    onChange={(e) => setInternalLabel(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Public Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heritage Deluxe Suite"
                    value={publicTitle}
                    onChange={(e) => setPublicTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Inventory & Capacity */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Inventory & Capacity
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Total Inventory
                </label>
                <input
                  type="number"
                  value={totalInventory}
                  onChange={(e) => setTotalInventory(parseInt(e.target.value))}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                />
                <p className="text-[10px] text-zinc-400 mt-2 uppercase tracking-tight">
                  Identical units available for booking
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Adults
                  </label>
                  <input
                    type="number"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Children
                  </label>
                  <input
                    type="number"
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Bed Configuration
              </label>
              <div className="space-y-3">
                {beds.map((bed, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200"
                  >
                    <div className="flex-1 flex gap-2">
                      <input
                        type="number"
                        value={bed.quantity}
                        onChange={(e) => {
                          const newBeds = [...beds];
                          newBeds[index].quantity = parseInt(e.target.value);
                          setBeds(newBeds);
                        }}
                        className="w-20 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                      />
                      <select
                        value={bed.type}
                        onChange={(e) => {
                          const newBeds = [...beds];
                          newBeds[index].type = e.target.value;
                          setBeds(newBeds);
                        }}
                        className="flex-1 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                      >
                        <option>King</option>
                        <option>Queen</option>
                        <option>Twin</option>
                        <option>Bunk</option>
                        <option>Sofa Bed</option>
                      </select>
                    </div>
                    {beds.length > 1 && (
                      <button
                        onClick={() => removeBed(index)}
                        className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addBed}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors py-2"
                >
                  <Plus size={16} />
                  Add Bed
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Bathroom Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["Ensuite", "Shared", "Private External"].map((type) => (
                  <label
                    key={type}
                    className={`relative flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-all group ${
                      bathroomType === type
                        ? "border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="bathroom"
                      checked={bathroomType === type}
                      onChange={() => setBathroomType(type)}
                      className="absolute top-3 right-3 accent-zinc-900 dark:accent-white"
                    />
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-2">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Pricing & Rules */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Pricing & Rules
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Base Nightly Rate
                </label>
                <div className="relative">
                  <IndianRupee
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                  />
                </div>
              </div>
              <div
                onClick={() => setWeekendMarkup(!weekendMarkup)}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    Weekend Markup
                  </p>
                  <p className="text-[10px] text-zinc-400 uppercase">
                    Auto-increase on Fri/Sat
                  </p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    weekendMarkup
                      ? "bg-zinc-900 dark:bg-white"
                      : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all ${
                      weekendMarkup
                        ? "right-1 bg-white dark:bg-zinc-900"
                        : "left-1 bg-white"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Extra Guest Charge
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹200 after 2 guests"
                  value={extraGuestCharge}
                  onChange={(e) => setExtraGuestCharge(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Cancellation Policy
                </label>
                <select
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                >
                  <option>Flexible</option>
                  <option>Moderate</option>
                  <option>Strict</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section className="space-y-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Amenities
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Essentials
                </h4>
                <div className="space-y-3">
                  {[
                    "AC",
                    "High-speed Wi-Fi",
                    "Hot Water",
                    "Towels",
                    "Toiletries",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={amenities.includes(item)}
                        onChange={() => toggleAmenity(item)}
                        className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-white"
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Work & Tech
                </h4>
                <div className="space-y-3">
                  {[
                    "Dedicated Desk",
                    "Universal Outlets",
                    "Bedside Reading Light",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={amenities.includes(item)}
                        onChange={() => toggleAmenity(item)}
                        className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-white"
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {listingType === "Hostel Bed" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Hostel Specifics
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Individual Lockers",
                      "Bed Privacy Curtains",
                      "Power socket per bed",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={amenities.includes(item)}
                          onChange={() => toggleAmenity(item)}
                          className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-white"
                        />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Kitchen & Dining
                </h4>
                <div className="space-y-3">
                  {["Mini-fridge", "Coffee Maker", "Shared Kitchen Access"].map(
                    (item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={amenities.includes(item)}
                          onChange={() => toggleAmenity(item)}
                          className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-white"
                        />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                          {item}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Media & Description */}
          <section className="space-y-6 pb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                5
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Media & Description
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Photo Gallery
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
                className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all cursor-pointer group"
              >
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, .heic, .heif"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-zinc-400" size={24} />
                </div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Minimum 5 high-quality photos recommended
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-6 grid grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  View from Room
                </label>
                <select
                  value={viewFromRoom}
                  onChange={(e) => setViewFromRoom(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                >
                  <option>City View</option>
                  <option>Garden View</option>
                  <option>Pool View</option>
                  <option>No View / Internal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  placeholder="The elevator pitch for this room..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveListing}
            disabled={loading || uploading}
            className="flex-[2] py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {(loading || uploading) && (
              <Loader2 size={18} className="animate-spin" />
            )}
            {uploading
              ? "Uploading Images..."
              : loading
              ? "Saving..."
              : "Save Listing"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewListingDrawer;
