'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import ElasticSlider from '@/components/ui/ElasticSlider';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicPlayerProps {
  musicUrl?: string;
  autoPlay?: boolean;
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  musicUrl,
  autoPlay = false,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlayPending, setAutoPlayPending] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (autoPlay && musicUrl && audioRef.current) {
      setAutoPlayPending(true);

      const handleFirstInteraction = async () => {
        if (audioRef.current && !isPlaying) {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
            setAutoPlayPending(false);
          } catch (error) {
            console.log(
              'Auto-play failed, user can manually start music:',
              error
            );
            setAutoPlayPending(false);
          }
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction, {
        once: true,
      });
      document.addEventListener('keydown', handleFirstInteraction, {
        once: true,
      });
      document.addEventListener('touchstart', handleFirstInteraction, {
        once: true,
      });

      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, [musicUrl, autoPlay, isPlaying]);

  const handlePlay = async () => {
    if (audioRef.current && musicUrl) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
          setAutoPlayPending(false);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setAutoPlayPending(false);
      }
    }
  };

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!musicUrl) {
    return null;
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          preload="auto"
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />

        {/* Mobile Layout */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              /* Compact Mobile View - Only Play Button */
              <motion.div
                key="compact"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: autoPlayPending ? [1, 1.05, 1] : 1,
                    transition: autoPlayPending
                      ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 0.2 },
                  }}
                  onClick={() => setIsExpanded(true)}
                  className="bg-amber-500/90 hover:bg-amber-600 text-slate-900 p-2.5 rounded-full shadow-lg backdrop-blur-sm border border-amber-300/30"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </motion.button>
              </motion.div>
            ) : (
              /* Expanded Mobile View */
              <motion.div
                key="expanded"
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-72 max-w-[calc(100vw-2rem)]"
              >
                <div className="bg-slate-800/95 backdrop-blur-md border border-amber-300/40 rounded-2xl p-4 shadow-2xl">
                  {/* Header with close button */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          scale: autoPlayPending ? [1, 1.05, 1] : 1,
                          transition: autoPlayPending
                            ? {
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }
                            : { duration: 0.2 },
                        }}
                        onClick={handlePlay}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 p-2.5 rounded-full shadow-lg transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </motion.button>

                      <div className="flex-1 min-w-0">
                        <p className="text-amber-100 text-sm font-medium truncate">
                          Wedding Music
                        </p>
                        <p className="text-amber-200/70 text-xs">
                          {autoPlayPending
                            ? 'Click to start'
                            : isPlaying
                              ? 'Now Playing'
                              : 'Paused'}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsExpanded(false)}
                      className="text-amber-200/60 hover:text-amber-100 p-1.5 rounded-full hover:bg-amber-500/20 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
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
                    </motion.button>
                  </div>

                  {/* Volume Controls */}
                  <div className="space-y-3 pt-3 border-t border-amber-300/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleMute}
                          className="text-amber-200 hover:text-amber-100 p-1.5 rounded-full hover:bg-amber-500/20 transition-colors"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </motion.button>
                        <span className="text-amber-100 text-sm font-medium">
                          Volume
                        </span>
                      </div>
                      <span className="text-amber-200/80 text-sm font-medium">
                        {Math.round(volume)}%
                      </span>
                    </div>

                    {/* Integrated Volume Slider */}
                    <div className="px-1">
                      <ElasticSlider
                        value={volume}
                        startingValue={0}
                        maxValue={100}
                        isStepped={true}
                        stepSize={5}
                        onChange={handleVolumeChange}
                        leftIcon={
                          <VolumeX className="w-3 h-3 text-amber-400" />
                        }
                        rightIcon={
                          <Volume2 className="w-3 h-3 text-amber-400" />
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop View - Always Full */}
        <div className="hidden md:block">
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl p-4 shadow-xl">
            {/* Main Controls */}
            <div className="flex items-center gap-3 mb-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: autoPlayPending ? [1, 1.05, 1] : 1,
                  transition: autoPlayPending
                    ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.2 },
                }}
                onClick={handlePlay}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 p-3 rounded-full shadow-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </motion.button>

              <div className="flex-1 min-w-0">
                <p className="text-amber-100 text-sm font-medium truncate">
                  Wedding Music
                </p>
                <p className="text-amber-200/70 text-xs">
                  {autoPlayPending
                    ? 'Click anywhere to start music'
                    : isPlaying
                      ? 'Now Playing'
                      : 'Paused'}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className="text-amber-200 hover:text-amber-100 p-2 rounded-full hover:bg-amber-500/20 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </motion.button>

              <span className="text-amber-200/80 text-xs font-medium min-w-[3rem] text-right">
                {Math.round(volume)}%
              </span>
            </div>

            {/* Volume Slider */}
            <div className="px-1 border-t border-amber-300/20 pt-3">
              <ElasticSlider
                value={volume}
                startingValue={0}
                maxValue={100}
                isStepped={true}
                stepSize={5}
                onChange={handleVolumeChange}
                leftIcon={<VolumeX className="w-4 h-4 text-amber-400" />}
                rightIcon={<Volume2 className="w-4 h-4 text-amber-400" />}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
