import React, { useState } from 'react';
import type { ThirdSpace, UniversityLandmark } from '../lib/supabase';
import { MANILA_UNIVERSITIES } from '../lib/mockData';
import { ManilaMap } from './Map';
import logoImg from '../assets/logo.png';
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
  CheckCircle2,
  Lock,
  Eye,
  Bell,
  User,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Tag,
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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

  // 4 Main Categories matching user wireframe icons
  const MAIN_CATEGORIES = [
    { id: 'cafe', label: 'Cafe', icon: Coffee },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'coworking', label: 'Study Hub', icon: Building2 },
    { id: 'park', label: 'Parks', icon: Trees },
  ];

  // Count active extra filters for badge counter
  const activeExtraFilterCount =
    (extraFilters.priceRange !== 'all' ? 1 : 0) +
    (extraFilters.wifiOnly ? 1 : 0) +
    (extraFilters.outletsOnly ? 1 : 0) +
    (extraFilters.freeOnly ? 1 : 0) +
    (extraFilters.is247 ? 1 : 0) +
    (extraFilters.needsId ? 1 : 0) +
    (extraFilters.compShopReg ? 1 : 0) +
    (extraFilters.has360Only ? 1 : 0);

  // Filter universities inside dropdown search
  const filteredUniversities = MANILA_UNIVERSITIES.filter(
    (uni) =>
      uni.name.toLowerCase().includes(uniSearchText.toLowerCase()) ||
      uni.shortCode.toLowerCase().includes(uniSearchText.toLowerCase())
  );

  // Filter spots based on all criteria
  const filteredSpots = spots.filter((spot) => {
    if (activeCategory && spot.category !== activeCategory) return false;
    if (selectedUniversity && spot.university_id !== selectedUniversity.id) return false;
    
    // Extra filters
    if (extraFilters.priceRange !== 'all' && spot.price_range !== extraFilters.priceRange) return false;
    if (extraFilters.wifiOnly && !spot.has_wifi) return false;
    if (extraFilters.outletsOnly && !spot.has_outlets) return false;
    if (extraFilters.freeOnly && !spot.is_free) return false;
    if (extraFilters.is247 && !spot.is_24_7) return false;
    if (extraFilters.needsId && !spot.needs_student_id) return false;
    if (extraFilters.compShopReg && !spot.comp_shop_reg_required) return false;
    if (extraFilters.has360Only && !spot.panorama_url) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        spot.title.toLowerCase().includes(q) ||
        spot.description.toLowerCase().includes(q) ||
        spot.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCategoryClick = (catId: string) => {
    if (activeCategory === catId) {
      setActiveCategory(null);
      onSelectCategory('all');
    } else {
      setActiveCategory(catId);
      onSelectCategory(catId);
    }
  };

  const handleSelectUniversity = (uni: UniversityLandmark | null) => {
    setSelectedUniversity(uni);
    setIsUniDropdownOpen(false);
    setUniSearchText('');
  };

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

  return (
    <div className="min-h-screen bg-[#e8f5d6] text-[#1b2a22] font-sans pb-12">
      {/* 1. PERFECTLY VERTICALLY CENTERED BRANDING HEADER BAR */}
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

          <div className="flex items-center space-x-2.5 my-auto">
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

      {/* 2. HERO SAGE GREEN BANNER */}
      <section className="max-w-6xl mx-auto px-4 relative pt-4 pb-10">
        <div className="relative bg-gradient-to-br from-[#237046] via-[#1b5e39] to-[#0f3c23] text-white rounded-3xl p-8 sm:p-14 text-center shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[260px] border border-white/30 group">
          <div className="absolute -top-16 -left-16 w-60 h-60 bg-white/15 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#84bd19]/25 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-lg border border-white/30 text-xs font-bold text-emerald-100 mb-4 shadow-sm hover:bg-white/25 transition-colors cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Manila Student Third Space Directory</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm max-w-2xl">
            Find your <span className="text-[#b5d354]">Study Place</span>
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto font-medium leading-relaxed mt-2">
            Discover quiet cafes, free public libraries, 24/7 study hubs, & budget food spots around UPM, UST, DLSU, FEU, PUP, & Intramuros.
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-6 pt-5 text-[11px] font-bold text-white/95">
            <div className="flex items-center space-x-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/25 shadow-sm hover:bg-white/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <span>🏛️</span>
              <span>12 Manila Campuses</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/25 shadow-sm hover:bg-white/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Sockets & Wi-Fi</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/25 shadow-sm hover:bg-white/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Student Verified</span>
            </div>
          </div>
        </div>

        {/* Floating Overlapping Search Bar */}
        <div className="relative -mt-7 max-w-xl mx-auto z-20 px-2">
          <div className="relative shadow-2xl rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 hover:border-[#1b5e39] hover:shadow-emerald-900/10 transition-all duration-300">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quiet cafes, Wi-Fi speed, UST, UPM, budget kainan..."
              className="w-full pl-6 pr-12 py-3.5 bg-transparent text-sm text-[#1b2a22] placeholder-[#45690b]/60 focus:outline-none focus:ring-2 focus:ring-[#1b5e39] rounded-2xl transition"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#45690b]">
              <span className="text-xs text-[#45690b] font-semibold mr-1">Search</span>
              <Search className="w-4 h-4 text-[#1b5e39]" />
            </div>
          </div>
        </div>

        {/* 3. CATEGORY TOOLBAR */}
        <div className="pt-6 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {MAIN_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 border shadow-sm backdrop-blur-md active:scale-95 ${
                  isSelected
                    ? 'bg-[#1b5e39] text-white border-[#1b5e39] shadow-md scale-105'
                    : 'bg-white/70 text-[#1b5e39] border-white/60 hover:bg-[#1b5e39] hover:text-white hover:border-[#1b5e39] hover:-translate-y-0.5 hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}

          {/* 🏛️ Searchable Campus Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUniDropdownOpen(!isUniDropdownOpen)}
              className={`px-4 py-2.5 border rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-sm transition-all duration-200 backdrop-blur-md active:scale-95 ${
                selectedUniversity
                  ? 'bg-[#1b5e39] text-white border-[#1b5e39]'
                  : 'bg-white/70 text-[#1b5e39] border-white/60 hover:border-[#1b5e39] hover:bg-[#1b5e39] hover:text-white hover:-translate-y-0.5'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="max-w-[140px] truncate">
                {selectedUniversity ? selectedUniversity.shortCode : 'All Campuses'}
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Glass Modal */}
            {isUniDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white/90 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-2xl z-50 p-2 space-y-2 text-left animate-in fade-in zoom-in-95 duration-200">
                <div className="px-2 pt-1">
                  <input
                    type="text"
                    value={uniSearchText}
                    onChange={(e) => setUniSearchText(e.target.value)}
                    placeholder="Search Manila campus name..."
                    className="w-full px-3 py-2 bg-[#e8f5d6]/50 border border-[#c8e2a6] rounded-xl text-xs text-[#1b2a22] focus:outline-none focus:ring-1 focus:ring-[#1b5e39]"
                    autoFocus
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
                  <button
                    onClick={() => handleSelectUniversity(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      !selectedUniversity
                        ? 'bg-[#e8f5d6] text-[#1b5e39]'
                        : 'text-[#1b2a22] hover:bg-[#e8f5d6]/50'
                    }`}
                  >
                    <span>🏛️ All Manila Campuses</span>
                    {!selectedUniversity && <Check className="w-3.5 h-3.5 text-[#1b5e39]" />}
                  </button>

                  {filteredUniversities.map((uni) => {
                    const isSelected = selectedUniversity?.id === uni.id;
                    return (
                      <button
                        key={uni.id}
                        onClick={() => handleSelectUniversity(uni)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#e8f5d6] text-[#1b5e39] font-bold'
                            : 'text-[#1b2a22] hover:bg-[#e8f5d6]/50'
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-bold mr-1.5 text-amber-800">[{uni.shortCode}]</span>
                          <span>{uni.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#1b5e39] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 🎛️ Glassmorphism Filters Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`px-4 py-2.5 border rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-sm transition-all duration-200 backdrop-blur-md active:scale-95 ${
              activeExtraFilterCount > 0
                ? 'bg-[#1b5e39] text-white border-[#1b5e39]'
                : 'bg-white/70 text-[#1b5e39] border-white/60 hover:border-[#1b5e39] hover:bg-[#1b5e39] hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeExtraFilterCount > 0 && (
              <span className="bg-white text-[#1b5e39] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                {activeExtraFilterCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* 🎛️ CENTERED DIALOG FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 p-6 space-y-6 text-[#1b2a22] animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between pb-4 border-b border-[#c8e2a6]">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-[#1b5e39]" />
                <h2 className="text-xl font-extrabold">Filter Student Spaces</h2>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#e8f5d6]/50 text-[#45690b] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#45690b] uppercase tracking-wider">
                Price Category
              </h3>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {['all', 'Free', '₱', '₱₱'].map((pr) => (
                  <button
                    key={pr}
                    onClick={() => setExtraFilters((prev) => ({ ...prev, priceRange: pr }))}
                    className={`py-2 rounded-xl font-bold border transition-all duration-200 ${
                      extraFilters.priceRange === pr
                        ? 'bg-[#1b5e39] text-white border-[#1b5e39]'
                        : 'bg-[#e8f5d6]/40 text-[#1b2a22] border-[#c8e2a6] hover:border-[#1b5e39] hover:bg-[#e8f5d6]'
                    }`}
                  >
                    {pr === 'all' ? 'Any' : pr}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#45690b] uppercase tracking-wider">
                Student Amenities & Essentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl border border-[#c8e2a6] hover:bg-[#e8f5d6]/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-sky-600" />
                    <span className="font-bold">Fast Wi-Fi</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.wifiOnly}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, wifiOnly: e.target.checked }))}
                    className="accent-[#1b5e39] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#c8e2a6] hover:bg-[#e8f5d6]/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="font-bold">Power Outlets</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.outletsOnly}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, outletsOnly: e.target.checked }))}
                    className="accent-[#1b5e39] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#c8e2a6] hover:bg-[#e8f5d6]/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold">Open 24/7</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.is247}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, is247: e.target.checked }))}
                    className="accent-[#1b5e39] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#c8e2a6] hover:bg-[#e8f5d6]/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">100% Free Entry</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.freeOnly}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, freeOnly: e.target.checked }))}
                    className="accent-[#1b5e39] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#c8e2a6] hover:bg-[#e8f5d6]/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-[#1b5e39]" />
                    <span className="font-bold">Needs Student ID</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.needsId}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, needsId: e.target.checked }))}
                    className="accent-[#1b5e39] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#c8e2a6] hover:bg-[#e8f5d6]/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-rose-600" />
                    <span className="font-bold">360° Virtual Tour</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.has360Only}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, has360Only: e.target.checked }))}
                    className="accent-[#1b5e39] w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* Modal Bottom Action Buttons */}
            <div className="pt-4 border-t border-[#c8e2a6] flex items-center justify-between">
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#45690b] hover:underline"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-6 py-2.5 bg-[#1b5e39] text-[#e8f5d6] rounded-xl text-xs font-extrabold shadow hover:bg-[#154b2d] active:scale-95 transition-transform"
              >
                Show {filteredSpots.length} Spots
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎠 SCROLLABLE FEATURED PLACES CAROUSEL */}
      <section className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#1b2a22]">Featured Places & Study Spots</h2>
            <p className="text-xs text-[#45690b] font-medium">Swipe horizontally to explore top Manila student spots</p>
          </div>
          <span className="text-xs font-bold text-[#1b5e39] flex items-center gap-1 cursor-pointer hover:underline group">
            View All ({filteredSpots.length}) <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Horizontal Scrollable Carousel Container */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#c8e2a6] scrollbar-track-transparent">
          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className="snap-start shrink-0 w-72 sm:w-80 bg-white/75 backdrop-blur-md border border-white/80 hover:border-[#1b5e39] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 shadow-md hover:shadow-2xl hover:bg-white/95 group flex flex-col justify-between"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-44 w-full bg-[#e8f5d6]/50 overflow-hidden">
                  <img
                    src={
                      spot.cover_image_url ||
                      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-[#1b5e39] uppercase tracking-wider border border-white/60 shadow-sm group-hover:bg-[#1b5e39] group-hover:text-white transition-colors">
                    {spot.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#1b5e39] text-white px-2.5 py-0.5 rounded-lg text-xs font-bold shadow group-hover:scale-105 transition-transform flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-300" />
                    <span>{spot.price_range}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2">
                  <h3 className="text-base font-bold text-[#1b2a22] group-hover:text-[#1b5e39] transition-colors truncate flex items-center justify-between">
                    <span className="truncate">{spot.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#1b5e39] shrink-0 ml-1" />
                  </h3>
                  <p className="text-xs text-[#45690b] line-clamp-2 leading-relaxed font-medium">
                    {spot.description}
                  </p>
                  <p className="text-xs text-[#45690b]/90 flex items-center gap-1 pt-1 truncate font-semibold">
                    <MapPin className="w-3 h-3 text-[#1b5e39] shrink-0" />
                    {spot.address}
                  </p>
                </div>
              </div>

              {/* Footer Badges with Price Value Numerical Rating */}
              <div className="px-4 pb-4 pt-2 border-t border-[#c8e2a6]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {spot.has_wifi && (
                    <span className="flex items-center gap-1 text-[11px] text-sky-800 bg-sky-50/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-sky-200 font-medium">
                      <Wifi className="w-3 h-3 text-sky-600" /> Wi-Fi
                    </span>
                  )}
                  {spot.has_outlets && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-amber-200 font-medium">
                      <Zap className="w-3 h-3 text-amber-600" /> Outlets
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-emerald-900 bg-emerald-100/90 backdrop-blur-sm px-2 py-0.5 rounded-md border border-emerald-300 font-bold">
                    🌼 4.9 Value
                  </span>
                </div>
                <span className="text-xs font-bold text-[#1b5e39] group-hover:translate-x-1.5 transition-transform flex items-center gap-0.5 shrink-0 ml-1">
                  View <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🗺️ Interactive Manila Map Section */}
      <section className="max-w-6xl mx-auto px-4 py-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#1b2a22] flex items-center gap-2">
            <span>🗺️</span> Metro Manila University Landmarks & Pinpoint Map
          </h2>
          <span className="text-xs font-semibold text-[#45690b]">
            Click any pin to inspect details
          </span>
        </div>
        <div className="w-full rounded-3xl overflow-hidden shadow-lg border border-white/80 hover:shadow-xl transition-shadow">
          <ManilaMap
            spots={filteredSpots}
            onSelectSpot={onSelectSpot}
            selectedCategory={activeCategory}
            selectedUniversity={selectedUniversity}
            onSelectUniversity={(uni) => setSelectedUniversity(uni)}
          />
        </div>
      </section>
    </div>
  );
};
