import React, { useState } from 'react';
import type { ThirdSpace } from '../lib/supabase';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  Sparkles,
  Bookmark,
  Edit3,
  ChevronRight,
  Send,
  Star,
} from 'lucide-react';

interface DetailPageProps {
  spot: ThirdSpace;
  onBack: () => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ spot, onBack }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSuggestEditOpen, setIsSuggestEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Expanded Student Reviews Dataset for Pagination Demonstration
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      user: 'Alex K.',
      role: 'UP Manila Senior Student',
      date: 'Jan 20, 2026',
      rating: 5,
      avatarBg: 'bg-indigo-100 text-indigo-700',
      initials: 'AK',
      comment:
        'Studying at this hub has been an incredible journey so far! The Wi-Fi speed is fast (around 45 Mbps), outlets are everywhere, and the aircon is cold. 10/10 recommend during finals week.',
      upvotes: 14,
      downvotes: 1,
    },
    {
      id: 'rev-2',
      user: 'Emily R.',
      role: 'UST Architecture Student',
      date: 'Nov 13, 2025',
      rating: 4,
      avatarBg: 'bg-[#8aa899]/30 text-[#1b2a22]',
      initials: 'ER',
      comment:
        'This is not just a study spot; it is a community of passionate Manila students. Plenty of power outlets near the corner tables and cheap food options nearby.',
      upvotes: 9,
      downvotes: 0,
    },
    {
      id: 'rev-3',
      user: 'Juan D.',
      role: 'DLSU Computer Science',
      date: 'Oct 05, 2025',
      rating: 5,
      avatarBg: 'bg-emerald-100 text-emerald-700',
      initials: 'JD',
      comment:
        'Great atmosphere for coding and group project meetings. Staff are friendly, and brewed coffee is refillable.',
      upvotes: 7,
      downvotes: 0,
    },
    {
      id: 'rev-4',
      user: 'Maria S.',
      role: 'PUP Accounting Student',
      date: 'Sep 18, 2025',
      rating: 4,
      avatarBg: 'bg-amber-100 text-amber-800',
      initials: 'MS',
      comment:
        'Affordable prices for students! Quiet space with comfortable chairs. Very accessible from LRT-1.',
      upvotes: 11,
      downvotes: 2,
    },
  ]);

  const [newComment, setNewComment] = useState('');

  // Pagination logic: 2 reviews per page
  const REVIEWS_PER_PAGE = 2;
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const currentReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const handleVote = (id: string, isUp: boolean) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              upvotes: isUp ? r.upvotes + 1 : r.upvotes,
              downvotes: !isUp ? r.downvotes + 1 : r.downvotes,
            }
          : r
      )
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviews((prev) => [
      {
        id: `rev-${Date.now()}`,
        user: 'You (Manila Student)',
        role: 'Student Reviewer',
        date: 'Today',
        rating: 5,
        avatarBg: 'bg-[#567b66] text-white',
        initials: 'ME',
        comment: newComment,
        upvotes: 0,
        downvotes: 0,
      },
      ...prev,
    ]);
    setNewComment('');
    setCurrentPage(1);
  };

  // Google Maps link generator
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.lat || 14.5995},${spot.lng || 120.9842}`;

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#1b2a22] font-sans pb-16">
      {/* Top Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#dce4e0] px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-[#586b61] hover:text-[#567b66] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Manila Directory</span>
          </button>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#567b66] text-white uppercase tracking-wider">
            {spot.category}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* 1. HERO TOP ROW (Wireframe 1: Left Square Image + Right Details & Rating Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Square Image Card */}
          <div className="md:col-span-5 h-72 md:h-80 rounded-3xl overflow-hidden border border-[#dce4e0] shadow-md bg-white">
            <img
              src={
                spot.cover_image_url ||
                'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
              }
              alt={spot.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column: Place Title, Action Buttons, Third Space Rating, and What To Know */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            {/* Title & Action Buttons Row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1b2a22] leading-tight">
                  {spot.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#586b61] font-semibold mt-1 flex items-center gap-1">
                  <span className="capitalize">{spot.category}</span>
                  <span>|</span>
                  <span className="truncate">{spot.address}</span>
                </p>
              </div>

              {/* Action Buttons: Suggest Edit & Favorite Spot */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => setIsSuggestEditOpen(!isSuggestEditOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#8aa899] hover:bg-[#567b66] text-white text-xs font-bold rounded-xl shadow transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Suggest Edit</span>
                </button>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl shadow transition ${
                    isFavorited
                      ? 'bg-[#567b66] text-white'
                      : 'bg-[#8aa899] hover:bg-[#567b66] text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>{isFavorited ? 'Saved Spot' : 'Favorite Spot'}</span>
                </button>
              </div>
            </div>

            {/* Suggest Edit Banner */}
            {isSuggestEditOpen && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 animate-in fade-in">
                ✍️ <strong>Suggest an Edit:</strong> Have updated Wi-Fi speed, outlet locations, or kainan prices? Submit edits via community reviews below!
              </div>
            )}

            {/* Side-by-Side Cards: Third Space Rating™ & What To Know? */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Black Card: Third Space Rating™ */}
              <div className="bg-[#1b2a22] text-white p-5 rounded-3xl flex flex-col justify-between shadow-lg space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-[#1b2a22] flex items-center justify-center text-xl font-bold">
                    🌼
                  </div>
                  <span className="text-4xl font-extrabold tracking-tight">4.7</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Third Space Rating™</h3>
                  <p className="text-[11px] text-[#8aa899] font-medium">
                    Based on 666 Student Reviews
                  </p>
                </div>
              </div>

              {/* Light Sage Card: What To Know? */}
              <div className="bg-[#dce6df] text-[#1b2a22] p-5 rounded-3xl flex flex-col justify-between shadow-sm space-y-2 border border-[#8aa899]/30">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1b2a22]">What To Know?</h3>
                  <p className="text-xs text-[#3a4a40] leading-relaxed mt-1 line-clamp-3 font-medium">
                    {spot.description}
                  </p>
                </div>
                <div className="flex items-center justify-end space-x-1 text-[10px] font-bold text-[#567b66] pt-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Summarized with AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN CONTENT ROW (Wireframes 2 & 3: Left Amenities + Photos vs Right Contact & Map Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: What this place offers + Videos & Photos */}
          <div className="lg:col-span-7 bg-white border border-[#dce4e0] p-6 rounded-3xl shadow-sm space-y-8">
            {/* Section A: What this place offers */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#1b2a22]">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[#1b2a22]">
                <div className="flex items-center space-x-2.5">
                  <span className="text-amber-500 text-sm">🌼</span>
                  <span>{spot.has_wifi ? 'Fast 45 Mbps Wi-Fi' : 'No Wi-Fi'}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-amber-500 text-sm">🌼</span>
                  <span>{spot.has_outlets ? 'Desk Power Outlets' : 'No Outlets'}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-amber-500 text-sm">🌼</span>
                  <span>{spot.is_free ? '100% Free Entry' : `Paid Spot (${spot.price_range})`}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-amber-500 text-sm">🌼</span>
                  <span>{spot.is_24_7 ? 'Open 24/7 (Late Night)' : 'Standard Hours'}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-amber-500 text-sm">🌼</span>
                  <span>{spot.needs_student_id ? 'Requires Student ID' : 'Open to All'}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-amber-500 text-sm">🌼</span>
                  <span>{spot.indoor_outdoor ? `${spot.indoor_outdoor} Seating` : 'Indoor Aircon'}</span>
                </div>
              </div>
            </div>

            {/* Section B: Videos and Photos */}
            <div className="space-y-4 pt-4 border-t border-[#dce4e0]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#1b2a22]">Videos and Photos</h2>
                <span className="text-xs font-bold text-[#567b66]">Media Gallery</span>
              </div>

              {/* Horizontal Scrollable Media Thumbnails Carousel */}
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {[
                    spot.cover_image_url || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                  ].map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 w-44 h-32 rounded-2xl overflow-hidden border border-[#dce4e0] bg-[#eef3f0]"
                    >
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                  <div className="shrink-0 w-12 h-32 rounded-2xl bg-[#eef3f0] border border-[#dce4e0] flex items-center justify-center cursor-pointer hover:bg-[#dce6df] transition">
                    <ChevronRight className="w-6 h-6 text-[#567b66]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN SIDEBAR: Map Preview & Contact Information Card */}
          <div className="lg:col-span-5 bg-[#1b2a22] text-white p-6 rounded-3xl shadow-xl space-y-6">
            {/* Embedded Mini Map Preview */}
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#8aa899]/30 relative bg-[#2a3a32]">
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                src={`https://maps.google.com/maps?q=${spot.lat || 14.5995},${spot.lng || 120.9842}&z=15&output=embed`}
                allowFullScreen
              />
            </div>

            {/* Contact Information List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#8aa899] uppercase tracking-wider">
                Contact Information
              </h3>

              <div className="space-y-3 text-xs">
                {/* Website */}
                <a
                  href={`https://maniluh.app/spot/${spot.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 text-white hover:text-amber-400 transition"
                >
                  <Globe className="w-4 h-4 text-[#8aa899] shrink-0" />
                  <span className="underline truncate font-semibold">maniluh.app/spot/{spot.id}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>

                {/* Email */}
                <div className="flex items-center space-x-3 text-white">
                  <Mail className="w-4 h-4 text-[#8aa899] shrink-0" />
                  <span className="font-medium">contact@{spot.id.replace('spot-', '')}.ph</span>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3 text-white">
                  <Phone className="w-4 h-4 text-[#8aa899] shrink-0" />
                  <span className="font-medium">(02) 8323 - 3232</span>
                </div>

                {/* Google Maps Link */}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 text-amber-400 hover:underline transition"
                >
                  <MapPin className="w-4 h-4 text-[#8aa899] shrink-0" />
                  <span className="truncate font-semibold">{googleMapsUrl}</span>
                </a>

                {/* Operating Hours */}
                <div className="flex items-start space-x-3 text-white pt-1">
                  <Clock className="w-4 h-4 text-[#8aa899] shrink-0 mt-0.5" />
                  <span className="font-medium text-[11px] leading-relaxed">
                    Mon-Thu 12-10 PM · Fri-Sat 12-11 PM · Sun 12-9 PM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MULTI-CATEGORY RATING BREAKDOWN CARD & SHADCN PAGINATED STUDENT REVIEWS */}
        <div className="space-y-6 pt-4">
          {/* Top Rating Breakdown Card (Light Gray Container) */}
          <div className="bg-[#e4e9e5] border border-[#dce4e0] p-6 rounded-3xl shadow-sm space-y-4 text-[#1b2a22]">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSuggestEditOpen(!isSuggestEditOpen)}
                className="flex items-center space-x-1.5 px-3 py-1 bg-[#8aa899] text-white text-xs font-bold rounded-xl shadow"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Suggest Edit</span>
              </button>
              <span className="text-xs font-bold text-[#586b61]">
                Based on 666 Reviews
              </span>
            </div>

            {/* 3 Category Rating Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#c4d1c7] pt-2">
              <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                <span className="text-xs font-bold text-[#586b61]">Wi-Fi & Speed</span>
                <div className="flex items-center space-x-2">
                  <span className="text-amber-500 text-lg">🌼</span>
                  <span className="text-3xl font-extrabold text-[#1b2a22]">4.7</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                <span className="text-xs font-bold text-[#586b61]">Power Outlets</span>
                <div className="flex items-center space-x-2">
                  <span className="text-amber-500 text-lg">🌼</span>
                  <span className="text-3xl font-extrabold text-[#1b2a22]">4.8</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                <span className="text-xs font-bold text-[#586b61]">Quiet Atmosphere</span>
                <div className="flex items-center space-x-2">
                  <span className="text-amber-500 text-lg">🌼</span>
                  <span className="text-3xl font-extrabold text-[#1b2a22]">4.5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Reviews List Container */}
          <div className="bg-white border border-[#dce4e0] p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#dce4e0]">
              <h2 className="text-xl font-extrabold text-[#1b2a22]">
                Student Reviews & Testimonials
              </h2>
              <span className="text-xs text-[#567b66] font-bold">
                Showing {currentReviews.length} of {reviews.length} Reviews
              </span>
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleAddReview} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a student review (Wi-Fi speed, outlet availability, noise level)..."
                className="flex-1 px-4 py-2.5 bg-[#f8f7f4] border border-[#dce4e0] rounded-xl text-xs text-[#1b2a22] placeholder-[#586b61]/60 focus:outline-none focus:ring-2 focus:ring-[#567b66]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#567b66] hover:bg-[#466654] text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <Send className="w-4 h-4" /> Post Review
              </button>
            </form>

            {/* Reviews List with Clean Dividers */}
            <div className="space-y-6">
              {currentReviews.map((rev, idx) => (
                <React.Fragment key={rev.id}>
                  {idx > 0 && <hr className="border-[#dce4e0]" />}
                  <div className="space-y-3">
                    {/* Top Date & Star Rating */}
                    <div className="flex items-center justify-between text-xs text-[#586b61]">
                      <span className="font-semibold">{rev.date}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* User Avatar + Name + Role */}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${rev.avatarBg}`}
                      >
                        {rev.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1b2a22]">{rev.user}</h4>
                        <p className="text-[11px] text-[#586b61] font-medium">{rev.role}</p>
                      </div>
                    </div>

                    {/* Review Body */}
                    <p className="text-xs sm:text-sm text-[#1b2a22] leading-relaxed font-medium pt-1">
                      {rev.comment}
                    </p>

                    {/* Upvotes / Downvotes */}
                    <div className="flex items-center space-x-4 pt-1 text-xs text-[#586b61]">
                      <button
                        onClick={() => handleVote(rev.id, true)}
                        className="flex items-center space-x-1 hover:text-emerald-600 transition font-semibold"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{rev.upvotes}</span>
                      </button>
                      <button
                        onClick={() => handleVote(rev.id, false)}
                        className="flex items-center space-x-1 hover:text-rose-600 transition font-semibold"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{rev.downvotes}</span>
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* 🔢 OFFICIAL SHADCN UI PAGINATION COMPONENT */}
            <div className="pt-4 border-t border-[#dce4e0]">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
