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

  // 4 Main Categories
  const MAIN_CATEGORIES = [
    { id: 'cafe', label: 'Cafe', icon: Coffee },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'coworking', label: 'Study Hub', icon: Building2 },
    { id: 'park', label: 'Parks', icon: Trees },
  ];

  // Filter spots based on search bar, category pill, & university
  const filteredSpots = spots.filter((spot) => {
    if (activeCategory && spot.category !== activeCategory) {
      return false;
    }
    if (selectedUniversity && spot.university_id !== selectedUniversity.id) {
      return false;
    }
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

  const handleUniversityClick = (uni: UniversityLandmark) => {
    if (selectedUniversity?.id === uni.id) {
      setSelectedUniversity(null);
    } else {
      setSelectedUniversity(uni);
    }
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
        <p className="text-sm sm:text-base text-[#586b61] max-w-2xl mx-auto font-medium">
          Discover quiet cafes, free libraries, budget food spots, and study hubs around Manila universities (UPM, UST, DLSU, FEU, PUP, Mapúa, etc.).
        </p>

        {/* Centered Search Bar */}
        <div className="relative max-w-2xl mx-auto shadow-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#567b66]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study spots, Wi-Fi, UPM, UST, DLSU, PUP, budget kainan..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#dce4e0] rounded-2xl text-sm text-[#1b2a22] placeholder-[#586b61]/60 focus:outline-none focus:ring-2 focus:ring-[#567b66] focus:border-transparent transition shadow-sm"
          />
        </div>

        {/* 4 Main Category Filter Pills */}
        <div className="pt-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {MAIN_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
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
        </div>
      </section>

      {/* 🏛️ 12 Manila University Campus Jump Filter Pills */}
      <section className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-[#586b61] flex items-center gap-1 shrink-0">
            <GraduationCap className="w-4 h-4 text-[#567b66]" /> Campus:
          </span>
          {MANILA_UNIVERSITIES.map((uni) => {
            const isSelected = selectedUniversity?.id === uni.id;
            return (
              <button
                key={uni.id}
                onClick={() => handleUniversityClick(uni)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                    : 'bg-white text-[#1b2a22] border-[#dce4e0] hover:border-amber-500'
                }`}
              >
                🏛️ {uni.shortCode}
              </button>
            );
          })}
        </div>
      </section>

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
