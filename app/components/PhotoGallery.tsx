'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

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

// Custom Image component with error handling
function SafeImage({ src, alt, className, ...props }: { src: string; alt: string; className?: string; [key: string]: any }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Convert URL to API endpoint if needed
  const getImageUrl = (url: string) => {
    if (!url || url.trim() === '') return '';
    if (url.startsWith('/api/images/')) return url;
    if (url.startsWith('/uploads/')) return `/api/images/${url.split('/').pop()}`;
    return url;
  };

  const imageUrl = getImageUrl(src);

  if (hasError || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-slate-700/50 ${className}`}>
        <div className="text-center text-amber-200/50">
          <Heart className="w-8 h-8 mx-auto mb-2" />
          <p className="text-xs">No image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50">
          <div className="text-center text-amber-200/50">
            <Heart className="w-6 h-6 mx-auto mb-2 animate-pulse" />
            <p className="text-xs">Loading...</p>
          </div>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}

export default function PhotoGallery({ photos, title = "Our Love Story" }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    } else {
      const newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  };

  return (
    <div className="w-full">
      {title && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-serif text-amber-100 mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{title}</h3>
          <div className="flex items-center justify-center">
            <Heart className="w-5 h-5 text-amber-300 mx-2" />
            <span className="text-amber-200/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">Capturing our journey together</span>
            <Heart className="w-5 h-5 text-amber-300 mx-2" />
          </div>
        </div>
      )}

      {/* Show message if no photos */}
      {photos.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-amber-300/50 mx-auto mb-4" />
          <p className="text-amber-200/70 text-lg">Photos coming soon!</p>
          <p className="text-amber-200/50 text-sm mt-2">We're excited to share our journey with you</p>
        </div>
      ) : (
        /* Photo Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => openLightbox(photo, index)}
          >
            <div className="aspect-square relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
              <SafeImage
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              
              {/* Photo Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium">{photo.caption}</p>
                {photo.date && (
                  <p className="text-white/80 text-xs">{photo.date}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="max-w-4xl bg-slate-800/95 border border-amber-300/30 p-0 backdrop-blur-sm">
          <DialogTitle className="sr-only">Photo Gallery - {selectedPhoto?.caption || 'Wedding Photo'}</DialogTitle>
          {selectedPhoto && (
            <div className="relative">

              {/* Navigation Buttons */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigatePhoto('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-200 hover:text-amber-100 hover:bg-amber-500/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigatePhoto('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-200 hover:text-amber-100 hover:bg-amber-500/20 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Photo Display */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center p-6"
              >
                <div className="relative max-w-full max-h-[70vh]">
                  <SafeImage
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    className="w-full h-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                  />
                </div>
                
                {/* Photo Info */}
                <div className="mt-4 text-amber-100">
                  <h4 className="text-xl font-semibold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{selectedPhoto.caption}</h4>
                  {selectedPhoto.date && (
                    <p className="text-amber-200/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">{selectedPhoto.date}</p>
                  )}
                  <p className="text-sm text-amber-200/60 mt-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                    {currentIndex + 1} of {photos.length}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
