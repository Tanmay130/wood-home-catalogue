'use client';

import React, { useState, useEffect } from 'react';
import { MediaItem } from '@/app/lib/catalogue';

interface MediaModalProps {
  media: MediaItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function MediaModal({ media, onClose, onNext, onPrev }: MediaModalProps) {
  const [rotation, setRotation] = useState<number>(0);

  // Reset rotation when navigating between items
  useEffect(() => {
    setRotation(0);
  }, [media?.url]);

  if (!media) return null;

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      {/* Top Controls Bar */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        {/* Rotate Button */}
        <button
          onClick={handleRotate}
          className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/30"
          title="Rotate Image"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Rotate</span>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
          title="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Previous Button */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-50 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/30"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Media Content Area */}
      <div className="relative flex max-h-[85vh] max-w-[85vw] items-center justify-center overflow-hidden">
        {media.type === 'video' ? (
          <video
            src={media.url}
            controls
            autoPlay
            style={{ transform: `rotate(${rotation}deg)` }}
            className="max-h-[80vh] max-w-[80vw] object-contain transition-transform duration-300 ease-in-out"
          />
        ) : (
          <img
            src={media.url}
            alt={media.title}
            style={{ transform: `rotate(${rotation}deg)` }}
            className="max-h-[80vh] max-w-[80vw] object-contain transition-transform duration-300 ease-in-out"
          />
        )}
      </div>

      {/* Next Button */}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 z-50 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/30"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}