import React, { useState } from 'react';
import type { ThirdSpace, UniversityLandmark } from '../lib/supabase';
import { MANILA_UNIVERSITIES } from '../lib/mockData';
import { ManilaMap, InteractivePinPickerMap } from './Map';
import logoImg from '../assets/logo.png';
import sunflowerScoreIcon from '../assets/icons/sunflowerScore.png';
import {
  Search,
  Coffee,
  BookOpen,
  Building2,
  Trees,
  Wifi,
  Zap,
  MapPin,
  ChevronRight,
  GraduationCap,
  ChevronDown,
  Check,
  SlidersHorizontal,
  X,
  Clock,
  Lock,
  Bell,
  User,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  UploadCloud,
  CheckCircle,
  ImageIcon,
} from 'lucide-react';

interface MainPageProps {
  spots: ThirdSpace[];
  onSelectSpot: (spot: ThirdSpace) => void;
  onSelectCategory: (category: string) => void;
}

export const MainPage: React.FC<MainPageProps> = ({
  spots,
  onSelectSpot,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityLandmark | null>(null);
  const [isUniDropdownOpen, setIsUniDropdownOpen] = useState(false);
  const [uniSearchText, setUniSearchText] = useState('');

  // "More Filters" Centered Dialog Modal State
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  // "Suggest a New Spot" Modal Dialog State
  const [isSuggestSpotOpen, setIsSuggestSpotOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // New Spot Suggestion Form State
  const [suggestSpotForm, setSuggestSpotForm] = useState({
    title: '',
    category: 'cafe',
    address: 'Sampaloc, Manila',
    hasWifi: true,
    hasOutlets: true,
    is247: false,
    isFree: false,
    needsId: false,
    priceRange: '₱₱',
    description: '',
  });

  // Upload Cover Image State for New Spot Suggestion
  const [spotCoverFile, setSpotCoverFile] = useState<File | null>(null);
  const [spotCoverPreview, setSpotCoverPreview] = useState<string>('');

  const [extraFilters, setExtraFilters] = useState({
    priceRange: 'all',
    wifiOnly: false,
    outletsOnly: false,
    freeOnly: false,
    is247: false,
    needsId: false,
    compShopReg: false,
    has360Only: false,
  });

  // Filtering Logic
  const filteredSpots = spots.filter((spot) => {
    // 1. Search Bar Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = spot.title.toLowerCase().includes(q);
      const matchCat = spot.category.toLowerCase().includes(q);
      const matchAddr = spot.address.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchAddr) return false;
    }

    // 2. Category Pill Filter
    if (activeCategory && activeCategory !== 'all') {
      if (activeCategory === 'hub') {
        const isHub =
          spot.category.toLowerCase().includes('hub') ||
          spot.category.toLowerCase().includes('coworking');
        if (!isHub) return false;
      } else if (spot.category.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }
    }

    // 3. University Proximity Radius Filter
    if (selectedUniversity) {
      const spotLat = spot.lat || 14.5995;
      const spotLng = spot.lng || 120.9842;
      const R = 6371;
      const dLat = ((spotLat - selectedUniversity.lat) * Math.PI) / 180;
      const dLon = ((spotLng - selectedUniversity.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((selectedUniversity.lat * Math.PI) / 180) *
          Math.cos((spotLat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = R * c;
      if (distanceKm > 1.5) return false;
    }

    // 4. Modal Extra Filters
    if (extraFilters.priceRange !== 'all' && spot.price_range !== extraFilters.priceRange)
      return false;
    if (extraFilters.wifiOnly && !spot.has_wifi) return false;
    if (extraFilters.outletsOnly && !spot.has_outlets) return false;
    if (extraFilters.freeOnly && !spot.is_free) return false;
    if (extraFilters.is247 && !spot.is_24_7) return false;
    if (extraFilters.needsId && !spot.needs_student_id) return false;

    return true;
  });

  const countActiveExtraFilters = () => {
    let count = 0;
    if (extraFilters.priceRange !== 'all') count++;
    if (extraFilters.wifiOnly) count++;
    if (extraFilters.outletsOnly) count++;
    if (extraFilters.freeOnly) count++;
    if (extraFilters.is247) count++;
    if (extraFilters.needsId) count++;
    return count;
  };

  const activeExtraFilterCount = countActiveExtraFilters();

  const resetAllFilters = () => {
    setActiveCategory(null);
    setSelectedUniversity(null);
    setSearchQuery('');
    setExtraFilters({
      priceRange: 'all',
      wifiOnly: false,
      outletsOnly: false,
      freeOnly: false,
      is247: false,
      needsId: false,
      compShopReg: false,
      has360Only: false,
    });
  };

  const handleSpotCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSpotCoverFile(file);
      setSpotCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitSuggestSpot = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuggestSpotOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };


  return (
    <div className="min-h-screen bg-[#e8f5d6] text-[#1b2a22] font-sans pb-16">
      {/* SUCCESS TOAST NOTIFICATION */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b5e39] text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-300 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-6 h-6 text-amber-300 shrink-0" />
          <div>
            <h4 className="text-sm font-extrabold">New Spot Suggestion Pinned! 📍</h4>
            <p className="text-xs text-emerald-100">
              Thank you for building the Manila student directory! Community review in progress.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-emerald-200 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. BRANDING HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/65 backdrop-blur-xl border-b border-white/50 px-4 py-2.5 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={resetAllFilters}
            className="flex items-center space-x-3 group cursor-pointer my-auto"
          >
            <img
              src={logoImg}
              alt="ALTSpaces Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1b5e39] font-sans group-hover:scale-105 transition-transform duration-300 leading-none">
              ALTSpaces
            </h1>
          </div>

          <div className="flex items-center space-x-3 my-auto">
            <button
              onClick={() => setIsSuggestSpotOpen(true)}
              className="text-xs sm:text-sm font-extrabold text-[#1b5e39] hover:text-[#154b2d] hover:underline flex items-center space-x-1 transition"
            >
              <PlusCircle className="w-4 h-4 text-[#76ab13]" />
              <span>Suggest a Spot 📍</span>
            </button>

            <button
              aria-label="Notifications"
              className="w-9 h-9 rounded-xl bg-white/70 backdrop-blur-md border border-white/60 hover:border-[#1b5e39] hover:bg-white hover:-translate-y-0.5 hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center text-[#1b2a22] transition-all duration-200 group"
            >
              <Bell className="w-4 h-4 text-[#1b5e39] group-hover:rotate-12 transition-transform duration-300" />
            </button>
            <button
              aria-label="User Profile"
              className="w-9 h-9 rounded-xl bg-white/70 backdrop-blur-md border border-white/60 hover:border-[#1b5e39] hover:bg-white hover:-translate-y-0.5 hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center text-[#1b2a22] transition-all duration-200 group"
            >
              <User className="w-4 h-4 text-[#1b5e39] group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </header>

      {/* SUGGEST A NEW STUDY SPOT MODAL DIALOG POPUP */}
      {isSuggestSpotOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-xl border border-[#c8e2a6] rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full my-8 text-[#1b2a22] relative space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#c8e2a6] pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#e8f5d6] text-[#1b5e39] text-xs font-extrabold rounded-full mb-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Interactive Map Pinning</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1b2a22]">
                  Suggest a New Study Place 📍
                </h2>
                <p className="text-xs text-[#45690b] font-medium mt-1">
                  Know a study cafe, library, or budget spot? Pin it on the map below for Manila students!
                </p>
              </div>

              <button
                onClick={() => setIsSuggestSpotOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8f5d6] hover:bg-[#c8e2a6] text-[#1b2a22] flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSuggestSpot} className="space-y-6 text-xs sm:text-sm">
              {/* SECTION 1: Spot Name & Category */}
              <div className="space-y-3 bg-[#e8f5d6]/40 p-4 rounded-2xl border border-[#c8e2a6]/60">
                <h3 className="font-extrabold text-[#1b5e39] flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-[#84bd19]" />
                  <span>1. Place Name & Category</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-[#1b2a22]">Place / Cafe Name:</label>
                    <input
                      type="text"
                      required
                      value={suggestSpotForm.title}
                      onChange={(e) => setSuggestSpotForm({ ...suggestSpotForm, title: e.target.value })}
                      placeholder="e.g. Hash Lab Study Cafe Annex"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#c8e2a6] rounded-xl font-bold text-[#1b2a22] focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-[#1b2a22]">Category:</label>
                    <select
                      value={suggestSpotForm.category}
                      onChange={(e) => setSuggestSpotForm({ ...suggestSpotForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#c8e2a6] rounded-xl font-bold text-[#1b2a22] focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                    >
                      <option value="cafe">Study Cafe</option>
                      <option value="library">Public Library</option>
                      <option value="kainan">Budget Kainan</option>
                      <option value="park">Park / Open Space</option>
                      <option value="hub">24/7 Study Hub</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Interactive Google Maps Pinning Location */}
              <div className="space-y-3 bg-[#e8f5d6]/40 p-4 rounded-2xl border border-[#c8e2a6]/60">
                <h3 className="font-extrabold text-[#1b5e39] flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>2. Pin Location on Map (Address & Landmark)</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="block font-bold text-[#1b2a22]">Type Street Address or University Landmark:</label>
                  <input
                    type="text"
                    required
                    value={suggestSpotForm.address}
                    onChange={(e) => setSuggestSpotForm({ ...suggestSpotForm, address: e.target.value })}
                    placeholder="e.g. 1521 Dapitan St, Sampaloc, Manila (near UST Gate 2)"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#c8e2a6] rounded-xl font-medium focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#45690b] font-medium">
                    💡 The interactive map below updates in real time to pinpoint your spot on Google Maps!
                  </p>
                </div>

                {/* Interactive MapTiler Click-to-Pin Map */}
                <InteractivePinPickerMap
                  initialLat={14.5995}
                  initialLng={120.9842}
                  onSelectCoordinates={({ lat, lng }) => {
                    setSuggestSpotForm((prev) => ({
                      ...prev,
                      address: `Pinned Spot (${lat.toFixed(4)}, ${lng.toFixed(4)}), Sampaloc, Manila`,
                    }));
                  }}
                />
              </div>

              {/* SECTION 3: Key Student Amenities */}
              <div className="space-y-3 bg-[#e8f5d6]/40 p-4 rounded-2xl border border-[#c8e2a6]/60">
                <h3 className="font-extrabold text-[#1b5e39] flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>3. Student Amenities & Rules</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2.5 p-3 bg-white rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={suggestSpotForm.hasWifi}
                      onChange={(e) => setSuggestSpotForm({ ...suggestSpotForm, hasWifi: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Wifi className="w-4 h-4 text-sky-600" />
                    <span className="font-bold">Fast Wi-Fi Available</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-white rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={suggestSpotForm.hasOutlets}
                      onChange={(e) => setSuggestSpotForm({ ...suggestSpotForm, hasOutlets: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-bold">Power Sockets Available</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-white rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={suggestSpotForm.is247}
                      onChange={(e) => setSuggestSpotForm({ ...suggestSpotForm, is247: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="font-bold">Open 24/7 (Late Night)</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-white rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={suggestSpotForm.needsId}
                      onChange={(e) => setSuggestSpotForm({ ...suggestSpotForm, needsId: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Lock className="w-4 h-4 text-[#1b5e39]" />
                    <span className="font-bold">Requires Student ID</span>
                  </label>
                </div>
              </div>

              {/* SECTION 4: Upload Cover Image */}
              <div className="space-y-3 bg-[#e8f5d6]/40 p-4 rounded-2xl border border-[#c8e2a6]/60">
                <h3 className="font-extrabold text-[#1b5e39] flex items-center gap-2 text-sm">
                  <ImageIcon className="w-4 h-4 text-[#84bd19]" />
                  <span>4. Spot Cover Photo</span>
                </h3>

                <input
                  type="file"
                  accept="image/*"
                  id="spot-cover-input"
                  className="hidden"
                  onChange={handleSpotCoverChange}
                />

                {spotCoverPreview ? (
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-[#1b5e39] bg-slate-900 group">
                    <img
                      src={spotCoverPreview}
                      alt="Spot Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      📷 {spotCoverFile ? spotCoverFile.name : 'Cover Photo Selected'}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <label
                        htmlFor="spot-cover-input"
                        className="px-3 py-1.5 bg-white text-[#1b5e39] text-xs font-bold rounded-xl shadow cursor-pointer hover:bg-emerald-50"
                      >
                        Change Photo
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setSpotCoverFile(null);
                          setSpotCoverPreview('');
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow hover:bg-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="spot-cover-input"
                    className="border-2 border-dashed border-[#76ab13]/60 hover:border-[#1b5e39] bg-white p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition hover:bg-emerald-50/50 group"
                  >
                    <UploadCloud className="w-8 h-8 text-[#76ab13] group-hover:scale-110 transition-transform mb-1" />
                    <span className="font-extrabold text-[#1b2a22] text-xs sm:text-sm">
                      Click or drag to upload spot cover photo
                    </span>
                  </label>
                )}
              </div>

              {/* SECTION 5: Student Notes */}
              <div className="space-y-2">
                <label className="block font-bold text-[#1b2a22]">Why do you recommend this spot?</label>
                <textarea
                  rows={3}
                  value={suggestSpotForm.description}
                  onChange={(e) => setSuggestSpotForm({ ...suggestSpotForm, description: e.target.value })}
                  placeholder="e.g. Extremely quiet atmosphere with fast Wi-Fi, plenty of power outlets, and affordable ₱50 coffee..."
                  className="w-full px-3.5 py-2.5 bg-[#e8f5d6]/30 border border-[#c8e2a6] rounded-xl font-medium focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-[#c8e2a6]">
                <button
                  type="button"
                  onClick={() => setIsSuggestSpotOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#1b2a22] font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1b5e39] hover:bg-[#154b2d] text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span>Pin & Submit New Spot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. HERO SAGE GREEN BANNER WITH OVERLAPPING SEARCH BAR */}
      <section className="max-w-6xl mx-auto px-4 relative pt-4 pb-4">
        <div className="relative bg-gradient-to-br from-[#237046] via-[#1b5e39] to-[#0f3c23] text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[280px] border border-white/30 group pb-14">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#b5d354]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-white/15 backdrop-blur-lg border border-white/30 text-xs font-bold text-emerald-100 mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Manila Student Third Place Directory</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm max-w-2xl">
            Find your <span className="text-[#b5d354]">Study Place</span>
          </h2>

          {/* Subtitle */}
          <p className="text-emerald-100 text-xs sm:text-sm font-semibold max-w-xl mt-3 leading-relaxed opacity-95">
            Discover quiet cafes, free public libraries, 24/7 study hubs, & budget food spots around UPM, UST, DLSU, FEU, PUP, & Intramuros.
          </p>

          {/* 3 Bottom Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold text-emerald-50">
              <Building2 className="w-4 h-4 text-emerald-300" />
              <span>12 Manila Campuses</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold text-amber-200">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Sockets & Wi-Fi</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold text-emerald-50">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Student Verified</span>
            </div>
          </div>
        </div>

        {/* OVERLAPPING SEARCH BAR EMBEDDED AT BOTTOM OF HERO BANNER */}
        <div className="max-w-2xl mx-auto -mt-7 relative z-10 px-2 sm:px-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-full border border-[#c8e2a6] shadow-xl p-1.5 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quiet cafes, Wi-Fi speed, UST, UPM, budget kainan..."
              className="w-full pl-5 pr-3 py-2.5 bg-transparent text-xs sm:text-sm font-semibold text-[#1b2a22] placeholder-[#45690b]/60 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button className="px-5 py-2.5 bg-[#1b5e39] hover:bg-[#154b2d] text-white text-xs font-extrabold rounded-full flex items-center space-x-1.5 shadow transition shrink-0">
              <span>Search</span>
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY & FILTER PILLS ROW BELOW OVERLAPPING SEARCH BAR */}
      <section className="max-w-6xl mx-auto px-4 mb-8 pt-3">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {/* Category Buttons: Cafe, Library, Study Hub, Parks */}
          <button
            onClick={() => {
              setActiveCategory(activeCategory === 'cafe' ? null : 'cafe');
              onSelectCategory('cafe');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 transition shadow-sm border ${
              activeCategory === 'cafe'
                ? 'bg-[#1b5e39] text-white border-[#154b2d]'
                : 'bg-white text-[#1b2a22] border-[#c8e2a6] hover:border-[#76ab13]'
            }`}
          >
            <Coffee className="w-4 h-4 text-amber-700" />
            <span>Cafe</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory(activeCategory === 'library' ? null : 'library');
              onSelectCategory('library');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 transition shadow-sm border ${
              activeCategory === 'library'
                ? 'bg-[#1b5e39] text-white border-[#154b2d]'
                : 'bg-white text-[#1b2a22] border-[#c8e2a6] hover:border-[#76ab13]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Library</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory(activeCategory === 'hub' ? null : 'hub');
              onSelectCategory('hub');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 transition shadow-sm border ${
              activeCategory === 'hub'
                ? 'bg-[#1b5e39] text-white border-[#154b2d]'
                : 'bg-white text-[#1b2a22] border-[#c8e2a6] hover:border-[#76ab13]'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Study Hub</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory(activeCategory === 'park' ? null : 'park');
              onSelectCategory('park');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 transition shadow-sm border ${
              activeCategory === 'park'
                ? 'bg-[#1b5e39] text-white border-[#154b2d]'
                : 'bg-white text-[#1b2a22] border-[#c8e2a6] hover:border-[#76ab13]'
            }`}
          >
            <Trees className="w-4 h-4 text-green-600" />
            <span>Parks</span>
          </button>

          {/* University Radius Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUniDropdownOpen(!isUniDropdownOpen)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 transition shadow-sm border ${
                selectedUniversity
                  ? 'bg-[#1b5e39] text-white border-[#154b2d]'
                  : 'bg-white text-[#1b2a22] border-[#c8e2a6] hover:border-[#76ab13]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>{selectedUniversity ? selectedUniversity.name : 'All Campuses'}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>

            {isUniDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-72 bg-white rounded-2xl shadow-xl border border-[#c8e2a6] z-50 p-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  value={uniSearchText}
                  onChange={(e) => setUniSearchText(e.target.value)}
                  placeholder="Filter by University (UST, UPM...)"
                  className="w-full px-3 py-2 text-xs bg-[#e8f5d6]/50 border border-[#c8e2a6] rounded-xl font-medium focus:outline-none"
                />
                <div className="max-h-56 overflow-y-auto space-y-1 scrollbar-thin">
                  <button
                    onClick={() => {
                      setSelectedUniversity(null);
                      setIsUniDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl hover:bg-[#e8f5d6] text-[#1b5e39] flex items-center justify-between"
                  >
                    <span>Show All Manila Campuses</span>
                    {!selectedUniversity && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {MANILA_UNIVERSITIES.filter((u) =>
                    u.name.toLowerCase().includes(uniSearchText.toLowerCase())
                  ).map((uni) => (
                    <button
                      key={uni.id}
                      onClick={() => {
                        setSelectedUniversity(uni);
                        setIsUniDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition ${
                        selectedUniversity?.id === uni.id
                          ? 'bg-[#1b5e39] text-white font-extrabold'
                          : 'hover:bg-[#e8f5d6]/60 text-[#1b2a22]'
                      }`}
                    >
                      <span className="truncate">{uni.name}</span>
                      {selectedUniversity?.id === uni.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setIsMoreFiltersOpen(true)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 transition shadow-sm border ${
              activeExtraFilterCount > 0
                ? 'bg-[#76ab13] text-white border-[#5f8a0f]'
                : 'bg-white text-[#1b2a22] border-[#c8e2a6] hover:border-[#76ab13]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#84bd19]" />
            <span>Filters</span>
            {activeExtraFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-white text-[#76ab13] text-[11px] font-black flex items-center justify-center">
                {activeExtraFilterCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* 4. FEATURED PLACES & STUDY SPOTS HORIZONTAL CAROUSEL */}
      <section className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1b2a22]">
              Featured Places & Study Spots
            </h3>
            <p className="text-xs text-[#45690b] font-medium">
              Swipe horizontally to explore top Manila student spots
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="text-xs font-extrabold text-[#1b5e39] hover:underline flex items-center space-x-1"
          >
            <span>View All ({filteredSpots.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Scrollable Cards Carousel */}
        <div className="flex gap-5 overflow-x-auto pb-4 pt-1 scrollbar-thin">
          {filteredSpots.map((spot) => (
            <div
              key={`featured-${spot.id}`}
              onClick={() => onSelectSpot(spot)}
              className="shrink-0 w-72 sm:w-80 bg-white rounded-3xl border border-[#c8e2a6] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={
                      spot.cover_image_url ||
                      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Top Left Badge: White Category Pill */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#1b2a22] px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow border border-white/60">
                    {spot.category}
                  </div>

                  {/* Top Right Badge: Green Price Tag & Rating */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    <div className="bg-[#1b5e39] text-white px-2.5 py-1 rounded-xl text-[11px] font-black shadow flex items-center space-x-1 border border-white/30">
                      <img src={sunflowerScoreIcon} alt="Sunflower Score" className="w-4 h-4 object-contain inline" />
                      <span>{spot.overall_rating ? spot.overall_rating.toFixed(1) : '4.9'}</span>
                    </div>
                    <div className="bg-[#154b2d] text-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-black shadow border border-white/20">
                      {spot.is_free ? 'FREE' : spot.price_range}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-base font-extrabold text-[#1b2a22] group-hover:text-[#1b5e39] transition-colors truncate">
                    {spot.title}
                  </h4>
                  <p className="text-xs text-[#45690b] font-medium flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{spot.address}</span>
                  </p>
                </div>
              </div>

              {/* Card Footer Features */}
              <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-[#e8f5d6]">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#1b5e39]">
                  {spot.has_wifi && (
                    <span className="flex items-center gap-1 bg-[#e8f5d6] px-2 py-0.5 rounded-lg">
                      <Wifi className="w-3 h-3 text-sky-600" /> Wi-Fi
                    </span>
                  )}
                  {spot.has_outlets && (
                    <span className="flex items-center gap-1 bg-[#e8f5d6] px-2 py-0.5 rounded-lg">
                      <Zap className="w-3 h-3 text-amber-500" /> Outlets
                    </span>
                  )}
                  {spot.is_24_7 && (
                    <span className="flex items-center gap-1 bg-[#e8f5d6] px-2 py-0.5 rounded-lg">
                      <Clock className="w-3 h-3 text-black" /> 24/7
                    </span>
                  )}
                </div>

                <span className="text-xs font-extrabold text-[#76ab13] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE MANILA STUDENT MAP COMPONENT */}
      <section className="max-w-6xl mx-auto px-4 mb-10">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-[#c8e2a6] shadow-sm">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-sm font-extrabold text-[#1b5e39] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Interactive Manila Student Map</span>
            </h3>
            <span className="text-xs font-bold text-[#45690b]">
              Showing {filteredSpots.length} Pinned Spots
            </span>
          </div>
          <div className="h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#c8e2a6]">
            <ManilaMap
              spots={filteredSpots}
              onSelectSpot={onSelectSpot}
              selectedCategory={activeCategory || 'all'}
              selectedUniversity={selectedUniversity}
              onSelectUniversity={(uni) => setSelectedUniversity(uni)}
            />
          </div>
        </div>
      </section>

      {/* 6. SPOT CARDS GRID LIST */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold text-[#1b2a22]">
            All Manila Third Places ({filteredSpots.length})
          </h3>
          {(activeCategory || selectedUniversity || activeExtraFilterCount > 0) && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-extrabold text-[#76ab13] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredSpots.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md border border-[#c8e2a6] p-12 rounded-3xl text-center space-y-3">
            <Coffee className="w-12 h-12 text-[#76ab13] mx-auto opacity-50" />
            <h4 className="text-lg font-extrabold text-[#1b2a22]">No study spots match your filter</h4>
            <p className="text-xs text-[#45690b] font-medium">
              Try adjusting your search terms, clear university radius filter, or select another category.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-2 px-5 py-2 bg-[#1b5e39] text-white font-bold text-xs rounded-xl shadow"
            >
              Show All Spots
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                onClick={() => onSelectSpot(spot)}
                className="bg-white rounded-3xl border border-[#c8e2a6] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={
                        spot.cover_image_url ||
                        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={spot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Left Badge: White Category Pill */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#1b2a22] px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow border border-white/60">
                      {spot.category}
                    </div>

                    {/* Top Right Badge: Green Price Tag & Rating */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                      <div className="bg-[#1b5e39] text-white px-2.5 py-1 rounded-xl text-[11px] font-black shadow flex items-center space-x-1 border border-white/30">
                        <img src={sunflowerScoreIcon} alt="Sunflower Score" className="w-4 h-4 object-contain inline" />
                        <span>{spot.overall_rating ? spot.overall_rating.toFixed(1) : '4.9'}</span>
                      </div>
                      <div className="bg-[#154b2d] text-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-black shadow border border-white/20">
                        {spot.is_free ? 'FREE' : spot.price_range}
                      </div>
                    </div>
                  </div>

                  {/* Spot Card Info */}
                  <div className="p-5 space-y-3">
                    <h4 className="text-lg font-extrabold text-[#1b2a22] group-hover:text-[#1b5e39] transition-colors leading-snug">
                      {spot.title}
                    </h4>

                    <p className="text-xs text-[#45690b] font-medium flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{spot.address}</span>
                    </p>

                    <p className="text-xs text-[#1b2a22]/80 line-clamp-2 leading-relaxed font-semibold">
                      {spot.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Features */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#e8f5d6]">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#1b5e39]">
                    {spot.has_wifi && (
                      <span className="flex items-center gap-1 bg-[#e8f5d6] px-2 py-0.5 rounded-lg">
                        <Wifi className="w-3 h-3 text-sky-600" /> Wi-Fi
                      </span>
                    )}
                    {spot.has_outlets && (
                      <span className="flex items-center gap-1 bg-[#e8f5d6] px-2 py-0.5 rounded-lg">
                        <Zap className="w-3 h-3 text-amber-500" /> Outlets
                      </span>
                    )}
                    {spot.is_24_7 && (
                      <span className="flex items-center gap-1 bg-[#e8f5d6] px-2 py-0.5 rounded-lg">
                        <Clock className="w-3 h-3 text-black" /> 24/7
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-extrabold text-[#76ab13] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MORE FILTERS DIALOG MODAL */}
      {isMoreFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-xl border border-[#c8e2a6] rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full my-8 text-[#1b2a22] relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#c8e2a6] pb-4">
              <h3 className="text-lg font-extrabold text-[#1b5e39] flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#84bd19]" />
                <span>Filter Manila Third Places</span>
              </h3>
              <button
                onClick={() => setIsMoreFiltersOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8f5d6] text-[#1b2a22] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <label className="font-extrabold text-[#1b2a22]">Price Range:</label>
                <div className="grid grid-cols-4 gap-2">
                  {['all', '₱', '₱₱', '₱₱₱'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setExtraFilters({ ...extraFilters, priceRange: p })}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition ${
                        extraFilters.priceRange === p
                          ? 'bg-[#1b5e39] text-white border-[#154b2d]'
                          : 'bg-white border-[#c8e2a6] text-[#1b2a22] hover:bg-[#e8f5d6]'
                      }`}
                    >
                      {p === 'all' ? 'Any' : p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="font-extrabold text-[#1b2a22]">Must-Have Student Features:</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2.5 p-3 bg-[#e8f5d6]/40 rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extraFilters.wifiOnly}
                      onChange={(e) => setExtraFilters({ ...extraFilters, wifiOnly: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Wifi className="w-4 h-4 text-sky-600" />
                    <span className="font-bold">Fast Wi-Fi Only</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-[#e8f5d6]/40 rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extraFilters.outletsOnly}
                      onChange={(e) => setExtraFilters({ ...extraFilters, outletsOnly: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-bold">Desk Power Sockets Only</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-[#e8f5d6]/40 rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extraFilters.is247}
                      onChange={(e) => setExtraFilters({ ...extraFilters, is247: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Clock className="w-4 h-4 text-black" />
                    <span className="font-bold">Open 24/7 (Late Night)</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-[#e8f5d6]/40 rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extraFilters.freeOnly}
                      onChange={(e) => setExtraFilters({ ...extraFilters, freeOnly: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Sparkles className="w-4 h-4 text-[#84bd19]" />
                    <span className="font-bold">100% Free Entry Spots</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-[#e8f5d6]/40 rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extraFilters.needsId}
                      onChange={(e) => setExtraFilters({ ...extraFilters, needsId: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Lock className="w-4 h-4 text-[#1b5e39]" />
                    <span className="font-bold">Requires Student ID</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#c8e2a6]">
              <button
                type="button"
                onClick={() =>
                  setExtraFilters({
                    priceRange: 'all',
                    wifiOnly: false,
                    outletsOnly: false,
                    freeOnly: false,
                    is247: false,
                    needsId: false,
                    compShopReg: false,
                    has360Only: false,
                  })
                }
                className="text-xs font-extrabold text-[#76ab13] hover:underline"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setIsMoreFiltersOpen(false)}
                className="px-[#1b5e39] hover:bg-[#154b2d] px-6 py-2.5 bg-[#1b5e39] text-white font-extrabold text-xs rounded-xl shadow"
              >
                Apply Filters ({filteredSpots.length} Spots)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
