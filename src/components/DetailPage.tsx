import React, { useState } from 'react';
import type { ThirdSpace } from '../lib/supabase';
import { PanoramaViewer } from './PanoramaViewer';
import {
  ArrowLeft,
  MapPin,
  Wifi,
  Zap,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Bus,
  CheckCircle2,
  Send,
} from 'lucide-react';

interface DetailPageProps {
  spot: ThirdSpace;
  onBack: () => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ spot, onBack }) => {
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      user: 'UPM Freshie',
      comment: 'Super quiet space during finals week! WiFi was around 45 Mbps.',
      upvotes: 14,
      downvotes: 1,
    },
    {
      id: 'rev-2',
      user: 'UST Architecture',
      comment: 'Plenty of power outlets near the corner tables. Coffee is cheap too!',
      upvotes: 9,
      downvotes: 0,
    },
  ]);

  const [newComment, setNewComment] = useState('');

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
        user: 'Student Reviewer',
        comment: newComment,
        upvotes: 0,
        downvotes: 0,
      },
      ...prev,
    ]);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#1b2a22] font-sans pb-12">
      {/* Top Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#dce4e0] px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-[#586b61] hover:text-[#567b66] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Page</span>
          </button>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#567b66] text-white">
            {spot.category.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Cover Photo & Banner */}
        <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden border border-[#dce4e0] shadow-md">
          <img
            src={
              spot.cover_image_url ||
              'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
            }
            alt={spot.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b2a22] via-[#1b2a22]/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {spot.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#8aa899]" />
              {spot.address}
            </p>
          </div>
        </div>

        {/* 360 Panorama Viewer Component */}
        {spot.panorama_url && (
          <PanoramaViewer imageUrl={spot.panorama_url} title={spot.title} />
        )}

        {/* Spot Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Description & Amenities */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-[#dce4e0] p-5 rounded-2xl space-y-3 shadow-sm">
              <h2 className="text-xs font-bold text-[#586b61] uppercase tracking-wider">
                About This Spot
              </h2>
              <p className="text-sm text-[#1b2a22] leading-relaxed font-medium">
                {spot.description}
              </p>
            </div>

            {/* Student Amenities Checklist */}
            <div className="bg-white border border-[#dce4e0] p-5 rounded-2xl space-y-3 shadow-sm">
              <h2 className="text-xs font-bold text-[#586b61] uppercase tracking-wider">
                Student Amenities & Features
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
                    spot.has_wifi
                      ? 'bg-sky-50 border-sky-200 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <Wifi className="w-4 h-4 text-sky-600" />
                  <span className="font-bold">
                    {spot.has_wifi ? 'Fast Wi-Fi Available' : 'No Wi-Fi'}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
                    spot.has_outlets
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="font-bold">
                    {spot.has_outlets ? 'Power Outlets Available' : 'No Outlets'}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
                    spot.is_free
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">
                    {spot.is_free ? '100% Free Entry' : `Paid (${spot.price_range})`}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
                    spot.is_24_7
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold">
                    {spot.is_24_7 ? 'Open 24/7' : 'Standard Operating Hours'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Commute & Pricing */}
          <div className="space-y-6">
            <div className="bg-white border border-[#dce4e0] p-5 rounded-2xl space-y-4 shadow-sm">
              <div>
                <span className="text-xs text-[#586b61] font-bold uppercase tracking-wider">
                  Price Category
                </span>
                <p className="text-2xl font-extrabold text-[#567b66] mt-0.5">
                  {spot.price_range}
                </p>
              </div>

              {spot.commute_info && (
                <div className="pt-3 border-t border-[#dce4e0] space-y-2">
                  <h3 className="text-xs font-bold text-[#586b61] uppercase tracking-wider flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-[#567b66]" /> Commute Guide
                  </h3>
                  {spot.commute_info.lrt && (
                    <p className="text-xs text-[#586b61]">
                      <strong className="text-[#1b2a22]">LRT/MRT:</strong> {spot.commute_info.lrt}
                    </p>
                  )}
                  {spot.commute_info.jeep && (
                    <p className="text-xs text-[#586b61]">
                      <strong className="text-[#1b2a22]">Jeepney:</strong> {spot.commute_info.jeep}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Student Reviews Section */}
        <div className="bg-white border border-[#dce4e0] p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#1b2a22]">
              Student Reviews & Community Ratings
            </h2>
            <span className="text-xs text-[#567b66] font-bold">Verified by Students</span>
          </div>

          {/* Review Input */}
          <form onSubmit={handleAddReview} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a student review (Wi-Fi speed, outlet availability)..."
              className="flex-1 px-4 py-2.5 bg-[#f8f7f4] border border-[#dce4e0] rounded-xl text-xs sm:text-sm text-[#1b2a22] placeholder-[#586b61]/60 focus:outline-none focus:ring-2 focus:ring-[#567b66]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#567b66] hover:bg-[#466654] text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition shadow"
            >
              <Send className="w-4 h-4" /> Post
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-3 pt-2">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-[#f8f7f4] border border-[#dce4e0] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1b2a22]">{rev.user}</span>
                  <div className="flex items-center space-x-3 text-[#586b61]">
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
                <p className="text-[#586b61] leading-relaxed font-medium">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
