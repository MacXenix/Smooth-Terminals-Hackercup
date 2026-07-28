import React from 'react';
import { Eye } from 'lucide-react';

interface PanoramaViewerProps {
  imageUrl: string;
  title: string;
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl, title }) => {
  const pannellumEmbedUrl = `https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${encodeURIComponent(
    imageUrl
  )}&autoLoad=true&title=${encodeURIComponent(title)}`;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#7a9a8b]/40 bg-[#0f1714] shadow-xl">
      <div className="bg-[#1a2621] px-4 py-2.5 flex items-center justify-between border-b border-[#2a3a32]">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-[#7a9a8b] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">
            360° Interactive Virtual Tour
          </span>
        </div>
        <span className="text-[10px] text-[#8aa899] bg-[#0f1714] px-2 py-0.5 rounded border border-[#2a3a32]">
          Drag to inspect room
        </span>
      </div>

      <div className="relative h-64 sm:h-72 w-full bg-[#0f1714]">
        <iframe
          src={pannellumEmbedUrl}
          title={`360 Panorama View for ${title}`}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
};
