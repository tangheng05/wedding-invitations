'use client';

import React, { useState } from 'react';
import RollingGallery from './RollingGallery';

interface Photo {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  date?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  title?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  title = 'Photo Gallery',
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );

  // Extract image URLs for the rolling gallery
  const imageUrls = photos.map(photo => {
    // Handle both API and direct URLs
    if (photo.src.startsWith('/api/images/')) {
      return photo.src;
    } else if (photo.src.startsWith('/uploads/')) {
      return `/api/images/${photo.src.split('/').pop()}`;
    } else {
      return photo.src;
    }
  });

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const goToNext = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    }
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(
        selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1
      );
    }
  };

  return (
    <div className="text-center">
      {title && (
        <>
          <h3 className="text-2xl font-serif text-amber-100 mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {title}
          </h3>
          <p className="text-amber-200/80 mb-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            Capturing our journey together
          </p>
        </>
      )}

      {/* Beautiful Rolling Gallery */}
      <div>
        <RollingGallery
          autoplay={true}
          pauseOnHover={true}
          images={imageUrls}
        />
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-amber-300 z-10 bg-black/50 rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <img
                src={
                  photos[selectedPhotoIndex].src.startsWith('/api/images/')
                    ? photos[selectedPhotoIndex].src
                    : `/api/images/${photos[selectedPhotoIndex].src.split('/').pop()}`
                }
                alt={photos[selectedPhotoIndex].alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
                onClick={e => e.stopPropagation()}
              />

              <div className="mt-4 text-white">
                <h4 className="text-lg font-semibold">
                  {photos[selectedPhotoIndex].caption}
                </h4>
                {photos[selectedPhotoIndex].date && (
                  <p className="text-sm text-gray-300 mt-1">
                    {photos[selectedPhotoIndex].date}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  {selectedPhotoIndex + 1} of {photos.length}
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-300 bg-black/50 rounded-full p-3 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-300 bg-black/50 rounded-full p-3 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
