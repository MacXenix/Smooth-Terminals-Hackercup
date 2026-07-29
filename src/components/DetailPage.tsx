import React, { useState } from 'react';
import type { ThirdSpace } from '../lib/supabase';
import logoImg from '../assets/logo.png';
import sunflowerScoreIcon from '../assets/icons/sunflowerScore.png';
import wifiIcon from '../assets/icons/wifi.png';
import outletIcon from '../assets/icons/power outlets.png';
import vibeCodingIcon from '../assets/icons/mingcute_vibe-coding-fill.png';
import priceTagIcon from '../assets/icons/solar_tag-price-bold.png';
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
  X,
  CheckCircle,
  Wifi,
  Zap,
  Lock,
  Tag,
  Image as ImageIcon,
  Check,
  UploadCloud,
  FileImage,
  Trash2,
  PlusCircle,
  Sliders,
} from 'lucide-react';

interface DetailPageProps {
  spot: ThirdSpace;
  onBack: () => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ spot, onBack }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSuggestEditOpen, setIsSuggestEditOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 5-Star Category Ratings State
  const [categoryRatings, setCategoryRatings] = useState({
    wifi: 5,
    outlets: 5,
    quiet: 4,
    priceValue: 5,
  });

  // File Upload State for Suggest Edit Modal
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  // Form State for Suggest Edit Modal
  const [editForm, setEditForm] = useState({
    hasWifi: spot.has_wifi,
    wifiSpeed: '45',
    hasOutlets: spot.has_outlets,
    is247: spot.is_24_7,
    isFree: spot.is_free,
    needsId: spot.needs_student_id,
    seatingType: spot.indoor_outdoor || 'indoor',
    address: spot.address,
    websiteUrl: `https://maniluh.app/spot/${spot.id}`,
    contactEmail: `contact@${spot.id.replace('spot-', '')}.ph`,
    contactPhone: '(02) 8323 - 3232',
    operatingHours: 'Mon-Thu 12-10 PM · Fri-Sat 12-11 PM · Sun 12-9 PM',
    customAmenities: '',
    socialMediaLinks: '',
    additionalNotes: '',
  });

  // Student Reviews Dataset
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      user: 'Alex K.',
      role: 'UP Manila Senior Student',
      date: 'Jan 20, 2026',
      rating: 5,
      avatarBg: 'bg-emerald-100 text-emerald-800',
      initials: 'AK',
      comment:
        'Studying at this hub has been an incredible journey so far! The Wi-Fi speed is fast (around 45 Mbps), outlets are everywhere, aircon is cold, and price is super affordable for students. 10/10 recommend during finals week.',
      upvotes: 14,
      downvotes: 1,
    },
    {
      id: 'rev-2',
      user: 'Emily R.',
      role: 'UST Architecture Student',
      date: 'Nov 13, 2025',
      rating: 4,
      avatarBg: 'bg-[#76ab13]/30 text-[#1b2a22]',
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
        'Great atmosphere for coding and group project meetings. Staff are friendly, price rates are student-budget friendly, and brewed coffee is refillable.',
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
  const [showDetailedRatingInputs, setShowDetailedRatingInputs] = useState(false);

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
    const avgScore = Math.round(
      (categoryRatings.wifi + categoryRatings.outlets + categoryRatings.quiet + categoryRatings.priceValue) / 4
    );
    setReviews((prev) => [
      {
        id: `rev-${Date.now()}`,
        user: 'You (Manila Student)',
        role: 'Student Reviewer',
        date: 'Today',
        rating: avgScore,
        avatarBg: 'bg-[#76ab13] text-white',
        initials: 'ME',
        comment: newComment,
        upvotes: 0,
        downvotes: 0,
      },
      ...prev,
    ]);
    setNewComment('');
    setCurrentPage(1);
    setShowDetailedRatingInputs(false);
  };

  // Cover Image File Change
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Gallery Photos File Change
  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitEditSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuggestEditOpen(false);
    setToastMessage('Suggested edits submitted for community review!');
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };

  const handleSubmitCategoryRatings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRatingModalOpen(false);
    setToastMessage('Category 5-star ratings submitted! Card updated live.');
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };

  // Helper renderer for 5-Star Interactive Rating Pickers
  const renderStarPicker = (currentRating: number, onSelect: (r: number) => void) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onSelect(star)}
          className="p-0.5 hover:scale-125 transition-transform"
        >
          <Star
            className={`w-5 h-5 ${
              star <= currentRating
                ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                : 'text-slate-300 hover:text-amber-300'
            }`}
          />
        </button>
      ))}
      <span className="text-xs font-extrabold text-[#1b5e39] ml-1.5">{currentRating}.0 / 5.0</span>
    </div>
  );

  // Human-readable Google Maps query using Place Title + Address
  const placeSearchQuery = `${spot.title}, ${spot.address}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeSearchQuery)}`;

  return (
    <div className="min-h-screen bg-[#e8f5d6] text-[#1b2a22] font-sans pb-16 relative">
      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b5e39] text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-300 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-6 h-6 text-amber-300 shrink-0" />
          <div>
            <h4 className="text-sm font-extrabold">{toastMessage} 🌟</h4>
            <p className="text-xs text-emerald-100">
              Thank you for keeping ALTSpaces accurate for Manila students!
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

      {/* DEDICATED SEPARATE CATEGORY RATING MODAL DIALOG POPUP */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-xl border border-[#c8e2a6] rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full my-8 text-[#1b2a22] relative space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#c8e2a6] pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#e8f5d6] text-[#1b5e39] text-xs font-extrabold rounded-full mb-2">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>5-Star Category Ratings</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1b2a22]">
                  Rate Categories for {spot.title}
                </h2>
                <p className="text-xs text-[#45690b] font-medium mt-1">
                  Select 1 to 5 stars to update the community breakdown score.
                </p>
              </div>

              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8f5d6] hover:bg-[#c8e2a6] text-[#1b2a22] flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategoryRatings} className="space-y-5">
              <div className="space-y-4 bg-[#e8f5d6]/50 p-4 sm:p-5 rounded-2xl border border-[#c8e2a6]">
                {/* Wi-Fi Rating */}
                <div className="bg-white p-3.5 rounded-xl border border-[#c8e2a6] space-y-1.5 shadow-sm">
                  <span className="font-extrabold text-[#1b2a22] flex items-center gap-1.5 text-xs sm:text-sm">
                    <img src={wifiIcon} alt="Wi-Fi" className="w-4 h-4 object-contain" /> Wi-Fi & Speed Rating:
                  </span>
                  {renderStarPicker(categoryRatings.wifi, (r) =>
                    setCategoryRatings({ ...categoryRatings, wifi: r })
                  )}
                </div>

                {/* Outlets Rating */}
                <div className="bg-white p-3.5 rounded-xl border border-[#c8e2a6] space-y-1.5 shadow-sm">
                  <span className="font-extrabold text-[#1b2a22] flex items-center gap-1.5 text-xs sm:text-sm">
                    <img src={outletIcon} alt="Power Outlets" className="w-4 h-4 object-contain" /> Power Sockets Rating:
                  </span>
                  {renderStarPicker(categoryRatings.outlets, (r) =>
                    setCategoryRatings({ ...categoryRatings, outlets: r })
                  )}
                </div>

                {/* Quiet Atmosphere / Ambiance Rating */}
                <div className="bg-white p-3.5 rounded-xl border border-[#c8e2a6] space-y-1.5 shadow-sm">
                  <span className="font-extrabold text-[#1b2a22] flex items-center gap-1.5 text-xs sm:text-sm">
                    <img src={vibeCodingIcon} alt="Ambiance" className="w-4 h-4 object-contain" /> Ambiance & Quiet Rating:
                  </span>
                  {renderStarPicker(categoryRatings.quiet, (r) =>
                    setCategoryRatings({ ...categoryRatings, quiet: r })
                  )}
                </div>

                {/* Price & Value Rating */}
                <div className="bg-white p-3.5 rounded-xl border border-[#c8e2a6] space-y-1.5 shadow-sm">
                  <span className="font-extrabold text-[#1b2a22] flex items-center gap-1.5 text-xs sm:text-sm">
                    <img src={priceTagIcon} alt="Price & Value" className="w-4 h-4 object-contain" /> Price & Value Rating:
                  </span>
                  {renderStarPicker(categoryRatings.priceValue, (r) =>
                    setCategoryRatings({ ...categoryRatings, priceValue: r })
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-[#c8e2a6]">
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#1b2a22] font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1b5e39] hover:bg-[#154b2d] text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Category Ratings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUGGEST EDIT MODAL DIALOG POPUP (INFO, PHOTOS, AMENITIES, CONTACTS) */}
      {isSuggestEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-xl border border-[#c8e2a6] rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full my-8 text-[#1b2a22] relative space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#c8e2a6] pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#e8f5d6] text-[#1b5e39] text-xs font-extrabold rounded-full mb-2">
                  <Edit3 className="w-3.5 h-3.5 text-[#1b5e39]" />
                  <span>Suggest Spot Edits</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1b2a22]">
                  Suggest Edits for {spot.title}
                </h2>
                <p className="text-xs text-[#45690b] font-medium mt-1">
                  Upload photos, update Wi-Fi details, power sockets, contact info, and operating hours.
                </p>
              </div>

              <button
                onClick={() => setIsSuggestEditOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8f5d6] hover:bg-[#c8e2a6] text-[#1b2a22] flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEditSuggestion} className="space-y-6 text-xs sm:text-sm">
              {/* SECTION 1: Image & Photos Upload Dropzones */}
              <div className="space-y-4 bg-[#e8f5d6]/40 p-4 rounded-2xl border border-[#c8e2a6]/60">
                <h3 className="font-extrabold text-[#1b5e39] flex items-center gap-2 text-sm">
                  <ImageIcon className="w-4 h-4 text-[#84bd19]" />
                  <span>1. Upload Main Cover Image & Gallery Photos</span>
                </h3>

                {/* Cover Image Upload Area */}
                <div className="space-y-2">
                  <label className="block font-bold text-[#1b2a22]">Upload Main Cover Image File:</label>

                  <input
                    type="file"
                    accept="image/*"
                    id="cover-photo-input"
                    className="hidden"
                    onChange={handleCoverFileChange}
                  />

                  {coverPreviewUrl ? (
                    <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-[#1b5e39] bg-slate-900 group">
                      <img
                        src={coverPreviewUrl}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        📷 {coverFile ? coverFile.name : 'Selected Cover Image'}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <label
                          htmlFor="cover-photo-input"
                          className="px-3 py-1.5 bg-white text-[#1b5e39] text-xs font-bold rounded-xl shadow cursor-pointer hover:bg-emerald-50"
                        >
                          Change Cover Photo
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCoverFile(null);
                            setCoverPreviewUrl('');
                          }}
                          className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow hover:bg-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="cover-photo-input"
                      className="border-2 border-dashed border-[#76ab13]/60 hover:border-[#1b5e39] bg-white p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition hover:bg-emerald-50/50 group"
                    >
                      <UploadCloud className="w-8 h-8 text-[#76ab13] group-hover:scale-110 transition-transform mb-1" />
                      <span className="font-extrabold text-[#1b2a22] text-xs sm:text-sm">
                        Click or drag to upload Cover Photo
                      </span>
                      <span className="text-[11px] text-[#45690b] font-medium mt-0.5">
                        Supports PNG, JPG, WEBP (Max 10MB)
                      </span>
                    </label>
                  )}
                </div>

                {/* Additional Media Gallery Photos Upload (Multiple Files) */}
                <div className="space-y-2 pt-2 border-t border-[#c8e2a6]/80">
                  <label className="block font-bold text-[#1b2a22]">Upload Additional Gallery Photos (Multiple):</label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="gallery-photos-input"
                    className="hidden"
                    onChange={handleGalleryFilesChange}
                  />

                  <label
                    htmlFor="gallery-photos-input"
                    className="border-2 border-dashed border-[#76ab13]/60 hover:border-[#1b5e39] bg-white p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition hover:bg-emerald-50/50 group"
                  >
                    <FileImage className="w-7 h-7 text-[#76ab13] group-hover:scale-110 transition-transform mb-1" />
                    <span className="font-extrabold text-[#1b2a22] text-xs">
                      Click to upload photos of desk sockets, Wi-Fi speed, or seating
                    </span>
                    <span className="text-[10px] text-[#45690b] font-medium mt-0.5">
                      Select multiple images at once
                    </span>
                  </label>

                  {/* Selected Gallery Files List */}
                  {galleryFiles.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-2">
                      {galleryFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-[#c8e2a6] text-xs font-bold text-[#1b2a22] shadow-sm"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#1b5e39]" />
                          <span className="truncate max-w-[140px]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeGalleryFile(idx)}
                            className="text-rose-500 hover:text-rose-700 ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: What This Place Offers */}
              <div className="space-y-3 bg-[#e8f5d6]/40 p-4 rounded-2xl border border-[#c8e2a6]/60">
                <h3 className="font-extrabold text-[#1b5e39] flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-[#84bd19]" />
                  <span>2. What This Place Offers (Amenities & Rules)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center space-x-2.5 p-3 bg-white rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.hasWifi}
                      onChange={(e) => setEditForm({ ...editForm, hasWifi: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Wifi className="w-4 h-4 text-sky-600" />
                    <span className="font-bold">Fast Wi-Fi Available</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-white rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.hasOutlets}
                      onChange={(e) => setEditForm({ ...editForm, hasOutlets: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-bold">Desk Power Sockets</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-white rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.is247}
                      onChange={(e) => setEditForm({ ...editForm, is247: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="font-bold">Open 24/7 (Late Night)</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-white rounded-xl border border-[#c8e2a6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.needsId}
                      onChange={(e) => setEditForm({ ...editForm, needsId: e.target.checked })}
                      className="accent-[#1b5e39] w-4 h-4"
                    />
                    <Lock className="w-4 h-4 text-[#1b5e39]" />
                    <span className="font-bold">Requires Student ID</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="block font-bold text-[#1b2a22]">Measured Wi-Fi Speed (Mbps):</label>
                    <input
                      type="text"
                      value={editForm.wifiSpeed}
                      onChange={(e) => setEditForm({ ...editForm, wifiSpeed: e.target.value })}
                      placeholder="e.g. 45 Mbps"
                      className="w-full px-3.5 py-2 bg-white border border-[#c8e2a6] rounded-xl font-medium focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-[#1b2a22]">Seating Type:</label>
                    <select
                      value={editForm.seatingType}
                      onChange={(e) => setEditForm({ ...editForm, seatingType: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-[#c8e2a6] rounded-xl font-bold text-[#1b2a22] focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                    >
                      <option value="indoor">Indoor Aircon</option>
                      <option value="outdoor">Outdoor Garden</option>
                      <option value="both">Both Indoor & Outdoor</option>
                    </select>
                  </div>
                </div>

                {/* Open-Ended Custom Amenities Input */}
                <div className="space-y-1.5 pt-2 border-t border-[#c8e2a6]/80">
                  <label className="block font-bold text-[#1b2a22] flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-[#76ab13]" />
                    <span>Other Custom Amenities & Perks (Open-Ended):</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.customAmenities}
                    onChange={(e) => setEditForm({ ...editForm, customAmenities: e.target.value })}
                    placeholder="e.g. Refillable brewed coffee, extension cords provided, silent study room..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#c8e2a6] rounded-xl font-medium text-[#1b2a22] placeholder-[#45690b]/60 focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#45690b] font-medium">
                    💡 Type any custom student perk or unique feature you'd like added to this spot!
                  </p>
                </div>
              </div>

              {/* SECTION 3: Contact Information & Address */}
              <div className="space-y-3 bg-[#e8f5d6]/40 p-4 rounded-2xl border border-[#c8e2a6]/60">
                <h3 className="font-extrabold text-[#1b5e39] flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-[#84bd19]" />
                  <span>3. Contact Information & Location</span>
                </h3>

                <div className="space-y-2">
                  <label className="block font-bold text-[#1b2a22]">Address / Street Location:</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="e.g. 1521 Dapitan St, Sampaloc, Manila"
                    className="w-full px-3.5 py-2 bg-white border border-[#c8e2a6] rounded-xl font-medium focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="block font-bold text-[#1b2a22]">Website URL:</label>
                    <input
                      type="text"
                      value={editForm.websiteUrl}
                      onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-[#c8e2a6] rounded-xl font-medium focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-[#1b2a22]">Phone Number:</label>
                    <input
                      type="text"
                      value={editForm.contactPhone}
                      onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-[#c8e2a6] rounded-xl font-medium focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <label className="block font-bold text-[#1b2a22]">Operating Hours:</label>
                  <input
                    type="text"
                    value={editForm.operatingHours}
                    onChange={(e) => setEditForm({ ...editForm, operatingHours: e.target.value })}
                    placeholder="e.g. Mon-Thu 12-10 PM · Fri-Sat 12-11 PM"
                    className="w-full px-3.5 py-2 bg-white border border-[#c8e2a6] rounded-xl font-medium focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                  />
                </div>

                {/* Open-Ended Social Media Links Input */}
                <div className="space-y-1.5 pt-2 border-t border-[#c8e2a6]/80">
                  <label className="block font-bold text-[#1b2a22] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#76ab13]" />
                    <span>Social Media Handles & Online Links (Open-Ended):</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.socialMediaLinks}
                    onChange={(e) => setEditForm({ ...editForm, socialMediaLinks: e.target.value })}
                    placeholder="e.g. IG: @pahuwaycoffee · FB: facebook.com/homeroomdapitan · TikTok: @cloudscapestudy"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#c8e2a6] rounded-xl font-medium text-[#1b2a22] placeholder-[#45690b]/60 focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#45690b] font-medium">
                    💡 Add Instagram, Facebook Page, TikTok, Viber community, or Telegram links for this spot!
                  </p>
                </div>
              </div>

              {/* SECTION 4: Student Notes */}
              <div className="space-y-2">
                <label className="block font-bold text-[#1b2a22]">Additional Student Notes / Reason for Edit:</label>
                <textarea
                  rows={3}
                  value={editForm.additionalNotes}
                  onChange={(e) => setEditForm({ ...editForm, additionalNotes: e.target.value })}
                  placeholder="e.g. Power outlets were installed at corner desks, and brewed coffee refill is now ₱50..."
                  className="w-full px-3.5 py-2.5 bg-[#e8f5d6]/30 border border-[#c8e2a6] rounded-xl font-medium focus:ring-2 focus:ring-[#76ab13] focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-[#c8e2a6]">
                <button
                  type="button"
                  onClick={() => setIsSuggestEditOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#1b2a22] font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1b5e39] hover:bg-[#154b2d] text-white font-extrabold rounded-xl shadow-lg flex items-center space-x-2 transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Edits</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/60 px-4 py-2.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-[#45690b] hover:text-[#1b5e39] transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Manila Directory</span>
          </button>

          <div className="flex items-center space-x-2 cursor-pointer" onClick={onBack}>
            <img src={logoImg} alt="ALTSpaces Logo" className="w-7 h-7 object-contain rounded-xl" />
            <span className="text-sm font-extrabold text-[#1b5e39] hidden sm:inline">ALTSpaces</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1b5e39] text-white uppercase tracking-wider shadow-sm ml-2">
              {spot.category}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* 1. HERO TOP ROW */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Square Image Card */}
          <div className="md:col-span-5 h-72 md:h-80 rounded-3xl overflow-hidden border border-[#c8e2a6] shadow-md bg-white">
            <img
              src={
                spot.cover_image_url ||
                'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
              }
              alt={spot.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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
                <p className="text-xs sm:text-sm text-[#45690b] font-semibold mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="capitalize">{spot.category}</span>
                  <span>|</span>
                  <span className="truncate">{spot.address}</span>
                </p>
              </div>

              {/* Action Buttons: Vibrant Matcha Green */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => setIsSuggestEditOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#76ab13] hover:bg-[#5f8a0f] active:scale-95 text-white text-xs font-bold rounded-xl shadow transition-all duration-200"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Suggest Edit</span>
                </button>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow active:scale-95 transition-all duration-200 ${
                    isFavorited
                      ? 'bg-[#45690b] text-white'
                      : 'bg-[#76ab13] hover:bg-[#5f8a0f] text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>{isFavorited ? 'Saved Spot' : 'Favorite Spot'}</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Cards: Third Place Rating™ & What To Know? */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Black Card: Third Place Rating™ */}
              <div className="bg-[#000000] text-white p-5 rounded-3xl flex flex-col justify-between shadow-xl space-y-3 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-300/25 text-[#000000] flex items-center justify-center p-2 shadow-lg shrink-0 border border-amber-300/30">
                    <img src={sunflowerScoreIcon} alt="Sunflower Score" className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-md" />
                  </div>
                  <span className="text-5xl font-black tracking-tight text-white">
                    {spot.overall_rating ? spot.overall_rating.toFixed(1) : '4.8'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Third Place Rating™</h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Based on {spot.total_reviews || 120} Student Reviews
                  </p>
                </div>
              </div>

              {/* Light Olive Green Card: What To Know? */}
              <div className="bg-[#b5d354] text-[#1b2a22] p-5 rounded-3xl flex flex-col justify-between shadow-md space-y-2 border border-[#9ebd34] hover:scale-[1.02] transition-transform duration-300">
                <div>
                  <h3 className="text-base font-extrabold text-[#1b2a22]">What To Know?</h3>
                  <p className="text-xs text-[#1b2a22] leading-relaxed mt-1 line-clamp-3 font-semibold">
                    {spot.description}
                  </p>
                </div>
                <div className="flex items-center justify-end space-x-1 text-[10px] font-extrabold text-[#1b2a22] pt-1">
                  <Sparkles className="w-3 h-3 text-[#1b2a22]" />
                  <span>Summarized with AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN CONTENT ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN CARD: What this place offers + Larger Videos & Photos */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-white/80 p-7 rounded-3xl shadow-sm flex flex-col justify-between space-y-8 h-full">
            {/* Section A: What this place offers */}
            <div className="space-y-5">
              <h2 className="text-2xl font-extrabold text-[#1b2a22]">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base font-extrabold text-[#1b2a22]">
                <div className="flex items-center space-x-3 bg-[#e8f5d6]/40 p-3.5 rounded-2xl border border-[#c8e2a6]/60">
                  <img src={wifiIcon} alt="Wi-Fi" className="w-5 h-5 object-contain shrink-0" />
                  <span>{spot.has_wifi ? 'Fast 45 Mbps Wi-Fi' : 'No Wi-Fi'}</span>
                </div>
                <div className="flex items-center space-x-3 bg-[#e8f5d6]/40 p-3.5 rounded-2xl border border-[#c8e2a6]/60">
                  <img src={outletIcon} alt="Power Outlets" className="w-5 h-5 object-contain shrink-0" />
                  <span>{spot.has_outlets ? 'Desk Power Outlets' : 'No Outlets'}</span>
                </div>
                <div className="flex items-center space-x-3 bg-[#e8f5d6]/40 p-3.5 rounded-2xl border border-[#c8e2a6]/60">
                  <img src={priceTagIcon} alt="Price Tag" className="w-5 h-5 object-contain shrink-0" />
                  <span>{spot.is_free ? '100% Free Entry' : `Paid Spot (${spot.price_range})`}</span>
                </div>
                <div className="flex items-center space-x-3 bg-[#e8f5d6]/40 p-3.5 rounded-2xl border border-[#c8e2a6]/60">
                  <Clock className="w-5 h-5 text-black shrink-0" />
                  <span>{spot.is_24_7 ? 'Open 24/7 (Late Night)' : 'Standard Hours'}</span>
                </div>
                <div className="flex items-center space-x-3 bg-[#e8f5d6]/40 p-3.5 rounded-2xl border border-[#c8e2a6]/60">
                  <Lock className="w-5 h-5 text-[#1b5e39] shrink-0" />
                  <span>{spot.needs_student_id ? 'Requires Student ID' : 'Open to All'}</span>
                </div>
                <div className="flex items-center space-x-3 bg-[#e8f5d6]/40 p-3.5 rounded-2xl border border-[#c8e2a6]/60">
                  <img src={vibeCodingIcon} alt="Ambiance" className="w-5 h-5 object-contain shrink-0" />
                  <span className="capitalize text-sm sm:text-base font-extrabold text-[#1b2a22]">
                    {spot.indoor_outdoor ? `${spot.indoor_outdoor} Seating` : 'Indoor Aircon'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section B: Videos and Photos */}
            <div className="space-y-4 pt-4 border-t border-[#dce4e0] mt-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-[#1b2a22]">Videos and Photos</h2>
                <span className="text-xs sm:text-sm font-bold text-[#76ab13]">Media Gallery</span>
              </div>

              {/* Horizontal Scrollable Media Carousel */}
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                  {[
                    spot.cover_image_url || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                  ].map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 w-56 h-40 sm:w-64 sm:h-44 rounded-2xl overflow-hidden border border-[#c8e2a6] bg-[#eef3f0] group cursor-pointer shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                  <div className="shrink-0 w-12 h-12 my-auto rounded-full bg-[#84bd19] text-white flex items-center justify-center cursor-pointer hover:bg-[#6f9f15] hover:scale-110 transition shadow-md">
                    <ChevronRight className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN SIDEBAR CARD: Contact Info & Map */}
          <div className="lg:col-span-5 bg-[#76ab13] text-white p-7 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 h-full">
            <div className="w-full h-52 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/40 relative bg-[#5f8a0f] shadow-md shrink-0">
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'contrast(1.05)' }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(placeSearchQuery)}&z=15&output=embed`}
                allowFullScreen
              />
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wider">
                Contact Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm font-semibold text-white">
                <a
                  href={`https://maniluh.app/spot/${spot.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 text-white hover:underline transition group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span className="underline truncate">maniluh.app/spot/{spot.id}</span>
                  <ExternalLink className="w-4 h-4 shrink-0 ml-auto" />
                </a>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span>contact@{spot.id.replace('spot-', '')}.ph</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span>(02) 8323 - 3232</span>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 text-white hover:underline transition group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="truncate">Open in Google Maps ({spot.title})</span>
                  <ExternalLink className="w-4 h-4 shrink-0 ml-auto" />
                </a>

                <div className="flex items-start space-x-3 pt-1">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="leading-relaxed">
                    Mon-Thu 12-10 PM · Fri-Sat 12-11 PM · Sun 12-9 PM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MULTI-CATEGORY RATING BREAKDOWN CARD WITH DEDICATED RATE CATEGORIES BUTTON */}
        <div className="space-y-6 pt-4">
          <div className="bg-white/80 backdrop-blur-md border border-white/80 p-6 rounded-3xl shadow-sm space-y-4 text-[#1b2a22]">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#1b5e39] hover:bg-[#154b2d] text-white text-xs font-extrabold rounded-xl shadow active:scale-95 transition"
              >
                <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>Edit Category Ratings</span>
              </button>
              <span className="text-xs font-bold text-[#45690b]">
                Based on {spot.total_reviews || 120} Reviews
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#c8e2a6] pt-2">
              <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                <span className="text-xs font-bold text-[#45690b]">Wi-Fi & Speed</span>
                <div className="flex items-center space-x-2">
                  <img src={wifiIcon} alt="Wi-Fi" className="w-6 h-6 object-contain shrink-0" />
                  <span className="text-3xl font-extrabold text-[#1b2a22]">
                    {categoryRatings.wifi.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                <span className="text-xs font-bold text-[#45690b]">Power Outlets</span>
                <div className="flex items-center space-x-2">
                  <img src={outletIcon} alt="Power Outlets" className="w-6 h-6 object-contain shrink-0" />
                  <span className="text-3xl font-extrabold text-[#1b2a22]">
                    {categoryRatings.outlets.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                <span className="text-xs font-bold text-[#45690b]">Ambiance</span>
                <div className="flex items-center space-x-2">
                  <img src={vibeCodingIcon} alt="Ambiance" className="w-6 h-6 object-contain shrink-0" />
                  <span className="text-3xl font-extrabold text-[#1b2a22]">
                    {categoryRatings.quiet.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 text-center space-y-1 pt-3 sm:pt-0">
                <span className="text-xs font-bold text-[#45690b]">Price & Value</span>
                <div className="flex items-center space-x-2">
                  <img src={priceTagIcon} alt="Price Tag" className="w-6 h-6 object-contain shrink-0" />
                  <span className="text-3xl font-extrabold text-[#1b5e39]">
                    {categoryRatings.priceValue.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-white/80 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#c8e2a6]">
              <h2 className="text-xl font-extrabold text-[#1b2a22]">
                Student Reviews & Testimonials
              </h2>
              <button
                type="button"
                onClick={() => setShowDetailedRatingInputs(!showDetailedRatingInputs)}
                className="text-xs text-[#76ab13] hover:underline font-extrabold flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showDetailedRatingInputs ? 'Hide Category Ratings' : 'Rate 5 Stars Per Category'}</span>
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3">
              {/* Expandable Category Star Pickers for Student Review */}
              {showDetailedRatingInputs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#e8f5d6]/50 rounded-2xl border border-[#c8e2a6] text-xs">
                  <div className="space-y-1">
                    <span className="font-extrabold text-[#1b2a22] flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-sky-600" /> Wi-Fi Rating:
                    </span>
                    {renderStarPicker(categoryRatings.wifi, (r) => setCategoryRatings({ ...categoryRatings, wifi: r }))}
                  </div>
                  <div className="space-y-1">
                    <span className="font-extrabold text-[#1b2a22] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Power Sockets Rating:
                    </span>
                    {renderStarPicker(categoryRatings.outlets, (r) => setCategoryRatings({ ...categoryRatings, outlets: r }))}
                  </div>
                  <div className="space-y-1">
                    <span className="font-extrabold text-[#1b2a22] flex items-center gap-1">
                      <img src={vibeCodingIcon} alt="Ambiance" className="w-3.5 h-3.5 object-contain" /> Ambiance Rating:
                    </span>
                    {renderStarPicker(categoryRatings.quiet, (r) => setCategoryRatings({ ...categoryRatings, quiet: r }))}
                  </div>
                  <div className="space-y-1">
                    <span className="font-extrabold text-[#1b2a22] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" /> Price & Value Rating:
                    </span>
                    {renderStarPicker(categoryRatings.priceValue, (r) => setCategoryRatings({ ...categoryRatings, priceValue: r }))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a student review (Wi-Fi speed, outlet availability, noise level)..."
                  className="flex-1 px-4 py-2.5 bg-[#e8f5d6]/50 border border-[#c8e2a6] rounded-xl text-xs text-[#1b2a22] placeholder-[#45690b]/60 focus:outline-none focus:ring-2 focus:ring-[#76ab13]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#76ab13] hover:bg-[#5f8a0f] text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition shadow active:scale-95"
                >
                  <Send className="w-4 h-4" /> Post Review
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {currentReviews.map((rev, idx) => (
                <React.Fragment key={rev.id}>
                  {idx > 0 && <hr className="border-[#c8e2a6]" />}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#45690b]">
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

                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${rev.avatarBg}`}
                      >
                        {rev.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1b2a22]">{rev.user}</h4>
                        <p className="text-[11px] text-[#45690b] font-medium">{rev.role}</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#1b2a22] leading-relaxed font-medium pt-1">
                      {rev.comment}
                    </p>

                    <div className="flex items-center space-x-4 pt-1 text-xs text-[#45690b]">
                      <button
                        onClick={() => handleVote(rev.id, true)}
                        className="flex items-center space-x-1 hover:text-emerald-700 transition font-semibold"
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

            <div className="pt-4 border-t border-[#c8e2a6]">
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
