import React, { useState } from 'react';
import type { ThirdSpace, UniversityLandmark } from '../lib/supabase';
import { MANILA_UNIVERSITIES } from '../lib/mockData';
import { ManilaMap } from './Map';
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
  Sparkles,
  Map as MapIcon,
  GraduationCap,
  ChevronDown,
  Check,
  SlidersHorizontal,
  X,
  Clock,
  CheckCircle2,
  Lock,
  Eye,
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
    priceRange: 'all', // 'all', 'Free', '₱', '₱₱'
    wifiOnly: false,
    outletsOnly: false,
    freeOnly: false,
    is247: false,
    needsId: false,
    compShopReg: false,
    has360Only: false,
  });

  // 4 Main Categories
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
    <div className="min-h-screen bg-[#f8f7f4] text-[#1b2a22] font-sans pb-12">
      {/* Hero & Search Header Section */}
      <section className="relative px-4 pt-10 pb-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#eef3f0] border border-[#dce4e0] text-xs font-semibold text-[#586b61]">
          <Sparkles className="w-3.5 h-3.5 text-[#567b66]" />
          <span>Student Third Space & Manila Livability Directory</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1b2a22] leading-tight">
          Find Your Perfect <span className="text-[#567b66]">Study Space</span> & Kainan
        </h1>

        {/* Subtitle Text Below Title */}
        <p className="text-sm sm:text-base text-[#586b61] max-w-2xl mx-auto font-medium leading-relaxed">
          Discover quiet cafes, free libraries, budget food spots, and study hubs around Manila universities (UPM, UST, DLSU, FEU, PUP, Mapúa, etc.).
        </p>

        {/* Global Search Bar */}
        <div className="relative max-w-2xl mx-auto shadow-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#567b66]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study spots, Wi-Fi, UPM, UST, budget kainan..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#dce4e0] rounded-2xl text-sm text-[#1b2a22] placeholder-[#586b61]/60 focus:outline-none focus:ring-2 focus:ring-[#567b66] focus:border-transparent transition shadow-sm"
          />
        </div>

        {/* Filter Toolbar Row: Category Pills + Campus Dropdown + More Filters Button */}
        <div className="pt-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {/* 4 Main Category Pills */}
          {MAIN_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#567b66] text-white border-[#567b66] shadow-md scale-105'
                    : 'bg-white text-[#1b2a22] border-[#dce4e0] hover:border-[#567b66] hover:bg-[#eef3f0]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}

          {/* 🏛️ Searchable Campus Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setIsUniDropdownOpen(!isUniDropdownOpen)}
              className="px-3.5 py-2 bg-white border border-[#dce4e0] hover:border-[#567b66] rounded-xl text-xs sm:text-sm font-bold text-[#1b2a22] flex items-center space-x-2 shadow-sm transition"
            >
              <GraduationCap className="w-4 h-4 text-[#567b66]" />
              <span className="max-w-[140px] truncate">
                {selectedUniversity ? selectedUniversity.shortCode : 'All Campuses'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#586b61]" />
            </button>

            {/* Dropdown Modal */}
            {isUniDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-[#dce4e0] rounded-2xl shadow-2xl z-50 p-2 space-y-2 text-left animate-in fade-in zoom-in-95 duration-200">
                <div className="px-2 pt-1">
                  <input
                    type="text"
                    value={uniSearchText}
                    onChange={(e) => setUniSearchText(e.target.value)}
                    placeholder="Search Manila campus name..."
                    className="w-full px-3 py-2 bg-[#f8f7f4] border border-[#dce4e0] rounded-xl text-xs text-[#1b2a22] focus:outline-none focus:ring-1 focus:ring-[#567b66]"
                    autoFocus
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
                  <button
                    onClick={() => handleSelectUniversity(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      !selectedUniversity
                        ? 'bg-[#eef3f0] text-[#567b66]'
                        : 'text-[#1b2a22] hover:bg-[#f8f7f4]'
                    }`}
                  >
                    <span>🏛️ All Manila Campuses</span>
                    {!selectedUniversity && <Check className="w-3.5 h-3.5 text-[#567b66]" />}
                  </button>

                  {filteredUniversities.map((uni) => {
                    const isSelected = selectedUniversity?.id === uni.id;
                    return (
                      <button
                        key={uni.id}
                        onClick={() => handleSelectUniversity(uni)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#eef3f0] text-[#567b66] font-bold'
                            : 'text-[#1b2a22] hover:bg-[#f8f7f4]'
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-bold mr-1.5 text-amber-700">[{uni.shortCode}]</span>
                          <span>{uni.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#567b66] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 🎛️ "More Filters" Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-[#dce4e0] hover:border-[#567b66] rounded-xl text-xs sm:text-sm font-bold text-[#1b2a22] flex items-center space-x-2 shadow-sm transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#567b66]" />
            <span>Filters</span>
            {activeExtraFilterCount > 0 && (
              <span className="bg-[#567b66] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeExtraFilterCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* 🎛️ CENTERED DIALOG FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Centered Dialog Box */}
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#dce4e0] p-6 space-y-6 text-[#1b2a22] animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between pb-4 border-b border-[#dce4e0]">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-[#567b66]" />
                <h2 className="text-xl font-extrabold">Filter Student Spaces</h2>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#f8f7f4] text-[#586b61] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#586b61] uppercase tracking-wider">
                Price Category
              </h3>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {['all', 'Free', '₱', '₱₱'].map((pr) => (
                  <button
                    key={pr}
                    onClick={() => setExtraFilters((prev) => ({ ...prev, priceRange: pr }))}
                    className={`py-2 rounded-xl font-bold border transition ${
                      extraFilters.priceRange === pr
                        ? 'bg-[#567b66] text-white border-[#567b66]'
                        : 'bg-[#f8f7f4] text-[#1b2a22] border-[#dce4e0] hover:border-[#567b66]'
                    }`}
                  >
                    {pr === 'all' ? 'Any' : pr}
                  </button>
                ))}
              </div>
            </div>

            {/* Essential Student Amenities */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#586b61] uppercase tracking-wider">
                Student Amenities & Essentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl border border-[#dce4e0] hover:bg-[#f8f7f4] cursor-pointer transition">
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-sky-600" />
                    <span className="font-bold">Fast Wi-Fi</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.wifiOnly}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, wifiOnly: e.target.checked }))}
                    className="accent-[#567b66] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#dce4e0] hover:bg-[#f8f7f4] cursor-pointer transition">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="font-bold">Power Outlets</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.outletsOnly}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, outletsOnly: e.target.checked }))}
                    className="accent-[#567b66] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#dce4e0] hover:bg-[#f8f7f4] cursor-pointer transition">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold">Open 24/7</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.is247}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, is247: e.target.checked }))}
                    className="accent-[#567b66] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#dce4e0] hover:bg-[#f8f7f4] cursor-pointer transition">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">100% Free Entry</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.freeOnly}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, freeOnly: e.target.checked }))}
                    className="accent-[#567b66] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#dce4e0] hover:bg-[#f8f7f4] cursor-pointer transition">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span className="font-bold">Needs Student ID</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.needsId}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, needsId: e.target.checked }))}
                    className="accent-[#567b66] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#dce4e0] hover:bg-[#f8f7f4] cursor-pointer transition">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-rose-600" />
                    <span className="font-bold">360° Virtual Tour</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraFilters.has360Only}
                    onChange={(e) => setExtraFilters((prev) => ({ ...prev, has360Only: e.target.checked }))}
                    className="accent-[#567b66] w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* Modal Bottom Action Buttons */}
            <div className="pt-4 border-t border-[#dce4e0] flex items-center justify-between">
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#586b61] hover:underline"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-6 py-2.5 bg-[#567b66] text-white rounded-xl text-xs font-extrabold shadow hover:bg-[#466654]"
              >
                Show {filteredSpots.length} Spots
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎠 Scrollable Featured Places Carousel */}
      <section className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#1b2a22]">Featured Places & Study Spots</h2>
            <p className="text-xs text-[#586b61]">Swipe horizontally to explore top Manila student spots</p>
          </div>
          <span className="text-xs font-bold text-[#567b66] flex items-center gap-1 cursor-pointer hover:underline">
            View All ({filteredSpots.length}) <ChevronRight className="w-4 h-4" />
          </span>
        </div>

        {/* Horizontal Scrollable Carousel Container */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#dce4e0] scrollbar-track-transparent">
          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className="snap-start shrink-0 w-72 sm:w-80 bg-white border border-[#dce4e0] hover:border-[#567b66] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-44 w-full bg-[#eef3f0] overflow-hidden">
                  <img
                    src={
                      spot.cover_image_url ||
                      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-[#567b66] uppercase tracking-wider border border-[#dce4e0] shadow-sm">
                    {spot.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#567b66] text-white px-2 py-0.5 rounded-lg text-xs font-bold shadow">
                    {spot.price_range}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2">
                  <h3 className="text-base font-bold text-[#1b2a22] group-hover:text-[#567b66] transition-colors truncate">
                    {spot.title}
                  </h3>
                  <p className="text-xs text-[#586b61] line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>
                  <p className="text-xs text-[#586b61]/80 flex items-center gap-1 pt-1 truncate font-medium">
                    <MapPin className="w-3 h-3 text-[#567b66] shrink-0" />
                    {spot.address}
                  </p>
                </div>
              </div>

              {/* Footer Badges */}
              <div className="px-4 pb-4 pt-2 border-t border-[#dce4e0]/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {spot.has_wifi && (
                    <span className="flex items-center gap-1 text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 font-medium">
                      <Wifi className="w-3 h-3 text-sky-600" /> Wi-Fi
                    </span>
                  )}
                  {spot.has_outlets && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-medium">
                      <Zap className="w-3 h-3 text-amber-600" /> Outlets
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-[#567b66] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View Details <ChevronRight className="w-3.5 h-3.5" />
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
            <MapIcon className="w-5 h-5 text-[#567b66]" /> Metro Manila University Landmarks & Pinpoint Map
          </h2>
          <span className="text-xs font-semibold text-[#586b61]">
            Click any pin to inspect details
          </span>
        </div>
        <div className="w-full">
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
