'use client';

import { useState, useEffect } from 'react';
import { Save, Image, MapPin, Calendar, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WeddingSettings {
  // Couple Information
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;

  // Venue Information
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  venueZip: string;
  venueCountry: string;
  googleMapsUrl: string;

  // Event Details
  ceremonyTime: string;
  receptionTime: string;
  dressCode: string;

  // Content
  welcomeMessage: string;
  storyMessage: string;
  rsvpMessage: string;

  // Images
  couplePhoto: string;
  venuePhoto: string;
  preweddingPhotos: string[];

  // Contact
  contactEmail: string;
  contactPhone: string;

  // Music
  backgroundMusicUrl: string;
  musicAutoPlay: boolean;

  // Wedding Schedule
  scheduleEvents: {
    date1: Array<{
      time: string;
      title: string;
      description: string;
      icon: string;
    }>;
    date2: Array<{
      time: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  weddingDate1?: string;
  weddingDate2?: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onSettingsSaved,
}: SettingsModalProps) {
  const [settings, setSettings] = useState<WeddingSettings>({
    brideName: '',
    groomName: '',
    weddingDate: '',
    weddingTime: '',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueState: '',
    venueZip: '',
    venueCountry: '',
    googleMapsUrl: '',
    ceremonyTime: '',
    receptionTime: '',
    dressCode: '',
    welcomeMessage: '',
    storyMessage: '',
    rsvpMessage: '',
    couplePhoto: '',
    venuePhoto: '',
    preweddingPhotos: [],
    contactEmail: '',
    contactPhone: '',

    backgroundMusicUrl: '',
    musicAutoPlay: false,

    scheduleEvents: {
      date1: [],
      date2: [],
    },
    weddingDate1: 'December 26',
    weddingDate2: 'December 27',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          ...data,
          scheduleEvents: data.scheduleEvents || { date1: [], date2: [] },
          weddingDate1: data.weddingDate1 || 'December 26',
          weddingDate2: data.weddingDate2 || 'December 27',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        onSettingsSaved();
        onClose();
      } else {
        console.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (
    field: keyof WeddingSettings,
    files: FileList | null,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!files || files.length === 0) return;

    try {
      if (field === 'preweddingPhotos') {
        // Handle multiple files for pre-wedding photos
        const uploadPromises = Array.from(files).map(async file => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          const result = await response.json();
          return result.url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        setSettings(prev => ({
          ...prev,
          preweddingPhotos: [...prev.preweddingPhotos, ...uploadedUrls],
        }));
      } else {
        // Handle single file for couple and venue photos
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        setSettings(prev => ({
          ...prev,
          [field]: result.url,
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    }

    // Clear the file input
    if (event) {
      event.target.value = '';
    }
  };

  const handleRemoveImage = (field: keyof WeddingSettings, index?: number) => {
    if (field === 'preweddingPhotos' && index !== undefined) {
      setSettings(prev => ({
        ...prev,
        preweddingPhotos: prev.preweddingPhotos.filter((_, i) => i !== index),
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 bg-slate-800 border-amber-300/30">
        <DialogHeader className="px-6 py-4 border-b border-amber-300/30 bg-slate-700/50 flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl text-amber-100">
            Wedding Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="couple" className="flex-1 flex flex-col min-h-0">
          {/* Mobile-friendly tabs */}
          <div className="px-4 py-2 bg-slate-700/30 border-b border-amber-300/20 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 h-auto bg-slate-600/50">
              <TabsTrigger
                value="couple"
                className="flex flex-col sm:flex-row items-center p-2 text-xs sm:text-sm text-amber-200/80 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 hover:text-amber-100"
              >
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Couple</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger
                value="venue"
                className="flex flex-col sm:flex-row items-center p-2 text-xs sm:text-sm text-amber-200/80 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 hover:text-amber-100"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Venue</span>
                <span className="sm:hidden">Place</span>
              </TabsTrigger>

              <TabsTrigger
                value="content"
                className="flex flex-col sm:flex-row items-center p-2 text-xs sm:text-sm text-amber-200/80 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 hover:text-amber-100"
              >
                <Image className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Content</span>
                <span className="sm:hidden">Text</span>
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="flex flex-col sm:flex-row items-center p-2 text-xs sm:text-sm text-amber-200/80 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 hover:text-amber-100"
              >
                <Image className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Photos</span>
                <span className="sm:hidden">Pics</span>
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="flex flex-col sm:flex-row items-center p-2 text-xs sm:text-sm text-amber-200/80 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 hover:text-amber-100"
              >
                <Image className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Contact</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger
                value="music"
                className="flex flex-col sm:flex-row items-center p-2 text-xs sm:text-sm text-amber-200/80 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 hover:text-amber-100"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Music</span>
                <span className="sm:hidden">Audio</span>
              </TabsTrigger>
              <TabsTrigger
                value="wedding-schedule"
                className="flex flex-col sm:flex-row items-center p-2 text-xs sm:text-sm text-amber-200/80 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 hover:text-amber-100"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Schedule</span>
                <span className="sm:hidden">Time</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-800/40 min-h-0">
              <TabsContent value="couple" className="space-y-4 mt-0">
                <h3 className="settings-section-title">Couple Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brideName" className="settings-label">
                      Bride's Name
                    </Label>
                    <Input
                      id="brideName"
                      type="text"
                      value={settings.brideName}
                      onChange={e =>
                        setSettings({ ...settings, brideName: e.target.value })
                      }
                      placeholder="Enter bride's name"
                      className="settings-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groomName" className="settings-label">
                      Groom's Name
                    </Label>
                    <Input
                      id="groomName"
                      type="text"
                      value={settings.groomName}
                      onChange={e =>
                        setSettings({ ...settings, groomName: e.target.value })
                      }
                      placeholder="Enter groom's name"
                      className="settings-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weddingDate" className="settings-label">
                      Wedding Date
                    </Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={settings.weddingDate}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          weddingDate: e.target.value,
                        })
                      }
                      className="settings-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weddingTime" className="settings-label">
                      Wedding Time
                    </Label>
                    <Input
                      id="weddingTime"
                      type="time"
                      value={settings.weddingTime}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          weddingTime: e.target.value,
                        })
                      }
                      className="settings-input"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="venue" className="space-y-4 mt-0">
                <h3 className="settings-section-title">Venue & Location</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="venueName">Venue Name</Label>
                    <Input
                      id="venueName"
                      type="text"
                      value={settings.venueName}
                      onChange={e =>
                        setSettings({ ...settings, venueName: e.target.value })
                      }
                      placeholder="Enter venue name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueAddress">Address</Label>
                      <Input
                        id="venueAddress"
                        type="text"
                        value={settings.venueAddress}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            venueAddress: e.target.value,
                          })
                        }
                        placeholder="Street address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venueCity">City</Label>
                      <Input
                        id="venueCity"
                        type="text"
                        value={settings.venueCity}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            venueCity: e.target.value,
                          })
                        }
                        placeholder="City"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueState">State/Province</Label>
                      <Input
                        id="venueState"
                        type="text"
                        value={settings.venueState}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            venueState: e.target.value,
                          })
                        }
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venueZip">ZIP/Postal Code</Label>
                      <Input
                        id="venueZip"
                        type="text"
                        value={settings.venueZip}
                        onChange={e =>
                          setSettings({ ...settings, venueZip: e.target.value })
                        }
                        placeholder="ZIP code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venueCountry">Country</Label>
                      <Input
                        id="venueCountry"
                        type="text"
                        value={settings.venueCountry}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            venueCountry: e.target.value,
                          })
                        }
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                    <Input
                      id="googleMapsUrl"
                      type="url"
                      value={settings.googleMapsUrl}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          googleMapsUrl: e.target.value,
                        })
                      }
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-0">
                <h3 className="settings-section-title">Content & Messages</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={settings.welcomeMessage}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          welcomeMessage: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Welcome message for guests..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storyMessage">Our Story Message</Label>
                    <Textarea
                      id="storyMessage"
                      value={settings.storyMessage}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          storyMessage: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Share your love story..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rsvpMessage">Response Message</Label>
                    <Textarea
                      id="rsvpMessage"
                      value={settings.rsvpMessage}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          rsvpMessage: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Message for response section..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4 mt-0">
                <h3 className="settings-section-title">Photos & Media</h3>
                <div className="space-y-6">
                  {/* Couple Photo */}
                  <div className="space-y-2">
                    <Label htmlFor="couplePhoto">Couple Photo</Label>
                    <Input
                      id="couplePhoto"
                      type="file"
                      accept="image/*"
                      onChange={e =>
                        handleImageUpload('couplePhoto', e.target.files, e)
                      }
                    />
                    {settings.couplePhoto && (
                      <div className="mt-2 relative inline-block">
                        <img
                          src={
                            settings.couplePhoto.startsWith('/api/images/')
                              ? settings.couplePhoto
                              : `/api/images/${settings.couplePhoto.split('/').pop()}`
                          }
                          alt="Couple"
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('couplePhoto')}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Venue Photo */}
                  <div className="space-y-2">
                    <Label htmlFor="venuePhoto">Venue Photo</Label>
                    <Input
                      id="venuePhoto"
                      type="file"
                      accept="image/*"
                      onChange={e =>
                        handleImageUpload('venuePhoto', e.target.files, e)
                      }
                    />
                    {settings.venuePhoto && (
                      <div className="mt-2 relative inline-block">
                        <img
                          src={
                            settings.venuePhoto.startsWith('/api/images/')
                              ? settings.venuePhoto
                              : `/api/images/${settings.venuePhoto.split('/').pop()}`
                          }
                          alt="Venue"
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('venuePhoto')}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pre-wedding Photos */}
                  <div className="space-y-2">
                    <Label htmlFor="preweddingPhotos">Pre-wedding Photos</Label>
                    <Input
                      id="preweddingPhotos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e =>
                        handleImageUpload('preweddingPhotos', e.target.files, e)
                      }
                    />
                    {settings.preweddingPhotos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">
                          {settings.preweddingPhotos.length} photo(s) uploaded
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {settings.preweddingPhotos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={
                                  photo.startsWith('/api/images/')
                                    ? photo
                                    : `/api/images/${photo.split('/').pop()}`
                                }
                                alt={`Pre-wedding ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-md border"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveImage('preweddingPhotos', index)
                                }
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                                title="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setSettings(prev => ({
                              ...prev,
                              preweddingPhotos: [],
                            }))
                          }
                          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                        >
                          Remove all photos
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-0">
                <h3 className="settings-section-title">
                  Contact & Additional Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          contactEmail: e.target.value,
                        })
                      }
                      placeholder="contact@wedding.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={settings.contactPhone}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          contactPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="music" className="space-y-4 mt-0">
                <h3 className="settings-section-title">Music Settings</h3>
                <div className="grid md:grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="backgroundMusicUrl">
                        Background Music URL
                      </Label>
                      <Input
                        id="backgroundMusicUrl"
                        value={settings.backgroundMusicUrl}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            backgroundMusicUrl: e.target.value,
                          })
                        }
                        placeholder="https://example.com/music.mp3"
                        className="settings-input"
                      />
                      <p className="text-xs text-amber-200/60">
                        Upload music file or provide a direct URL to an audio
                        file (MP3, WAV, etc.)
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="musicAutoPlay"
                        checked={settings.musicAutoPlay}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            musicAutoPlay: e.target.checked,
                          })
                        }
                        className="rounded border-amber-300/30 text-amber-500 focus:ring-amber-500/20 bg-slate-700/50"
                      />
                      <Label htmlFor="musicAutoPlay" className="text-sm">
                        Auto-play music when guests visit the invitation
                      </Label>
                    </div>
                    <p className="text-xs text-amber-200/60">
                      Note: Some browsers may block auto-play. Users can still
                      manually play music using the controls.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wedding-schedule" className="space-y-4 mt-0">
                <h3 className="settings-section-title">
                  Wedding Schedule & Times
                </h3>
                <p className="text-sm text-amber-200/70 mb-4">
                  Set main event times and manage the detailed wedding day
                  schedule events for each date.
                </p>

                {/* Main Event Times */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-md font-semibold text-amber-100 border-b border-amber-300/30 pb-2">
                    Main Event Times
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ceremonyTime" className="settings-label">
                        Ceremony Time
                      </Label>
                      <Input
                        id="ceremonyTime"
                        type="time"
                        value={settings.ceremonyTime}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            ceremonyTime: e.target.value,
                          })
                        }
                        className="settings-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receptionTime" className="settings-label">
                        Reception Time
                      </Label>
                      <Input
                        id="receptionTime"
                        type="time"
                        value={settings.receptionTime}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            receptionTime: e.target.value,
                          })
                        }
                        className="settings-input"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="dressCode" className="settings-label">
                        Dress Code
                      </Label>
                      <Input
                        id="dressCode"
                        type="text"
                        value={settings.dressCode}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            dressCode: e.target.value,
                          })
                        }
                        placeholder="e.g., Formal, Semi-formal, Casual"
                        className="settings-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Wedding Dates Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="weddingDate1" className="settings-label">
                      First Wedding Date
                    </Label>
                    <Input
                      id="weddingDate1"
                      type="text"
                      value={settings.weddingDate1 || ''}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          weddingDate1: e.target.value,
                        })
                      }
                      placeholder="e.g., December 26"
                      className="settings-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weddingDate2" className="settings-label">
                      Second Wedding Date
                    </Label>
                    <Input
                      id="weddingDate2"
                      type="text"
                      value={settings.weddingDate2 || ''}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          weddingDate2: e.target.value,
                        })
                      }
                      placeholder="e.g., December 27"
                      className="settings-input"
                    />
                  </div>
                </div>

                {/* December 26 Schedule */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-amber-100 border-b border-amber-300/30 pb-2">
                    {settings.weddingDate1 || 'First Date'} Schedule
                  </h4>
                  {(settings.scheduleEvents?.date1 || []).map(
                    (event, index) => (
                      <div
                        key={index}
                        className="border border-amber-300/30 rounded-lg p-3 sm:p-4 space-y-3 bg-slate-700/30"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm sm:text-base text-amber-100">
                            Event {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newEvents = (
                                settings.scheduleEvents?.date1 || []
                              ).filter((_, i) => i !== index);
                              setSettings({
                                ...settings,
                                scheduleEvents: {
                                  date1: newEvents,
                                  date2: settings.scheduleEvents?.date2 || [],
                                },
                              });
                            }}
                            className="text-red-600 hover:text-red-800 text-xs sm:text-sm px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label
                              htmlFor={`event-time-${index}`}
                              className="text-sm"
                            >
                              Time
                            </Label>
                            <Input
                              id={`date1-event-time-${index}`}
                              type="time"
                              value={event.time}
                              onChange={e => {
                                const newEvents = [
                                  ...settings.scheduleEvents.date1,
                                ];
                                newEvents[index] = {
                                  ...newEvents[index],
                                  time: e.target.value,
                                };
                                setSettings({
                                  ...settings,
                                  scheduleEvents: {
                                    ...settings.scheduleEvents,
                                    date1: newEvents,
                                  },
                                });
                              }}
                              className="text-sm settings-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor={`date1-event-title-${index}`}
                              className="text-sm settings-label"
                            >
                              Event Title
                            </Label>
                            <Input
                              id={`date1-event-title-${index}`}
                              type="text"
                              value={event.title}
                              onChange={e => {
                                const newEvents = [
                                  ...settings.scheduleEvents.date1,
                                ];
                                newEvents[index] = {
                                  ...newEvents[index],
                                  title: e.target.value,
                                };
                                setSettings({
                                  ...settings,
                                  scheduleEvents: {
                                    ...settings.scheduleEvents,
                                    date1: newEvents,
                                  },
                                });
                              }}
                              placeholder="e.g., Guest Gathering"
                              className="text-sm settings-input"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`date1-event-description-${index}`}
                            className="text-sm settings-label"
                          >
                            Description
                          </Label>
                          <Textarea
                            id={`date1-event-description-${index}`}
                            value={event.description}
                            onChange={e => {
                              const newEvents = [
                                ...settings.scheduleEvents.date1,
                              ];
                              newEvents[index] = {
                                ...newEvents[index],
                                description: e.target.value,
                              };
                              setSettings({
                                ...settings,
                                scheduleEvents: {
                                  ...settings.scheduleEvents,
                                  date1: newEvents,
                                },
                              });
                            }}
                            rows={2}
                            placeholder="Brief description of the event..."
                            className="text-sm settings-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`date1-event-icon-${index}`}
                            className="text-sm settings-label"
                          >
                            Icon (Emoji)
                          </Label>
                          <Input
                            id={`date1-event-icon-${index}`}
                            type="text"
                            value={event.icon}
                            onChange={e => {
                              const newEvents = [
                                ...settings.scheduleEvents.date1,
                              ];
                              newEvents[index] = {
                                ...newEvents[index],
                                icon: e.target.value,
                              };
                              setSettings({
                                ...settings,
                                scheduleEvents: {
                                  ...settings.scheduleEvents,
                                  date1: newEvents,
                                },
                              });
                            }}
                            placeholder="👥"
                            maxLength={2}
                            className="text-sm text-center settings-input"
                          />
                        </div>
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const newEvents = [
                        ...(settings.scheduleEvents?.date1 || []),
                        {
                          time: '12:00',
                          title: 'New Event',
                          description: 'Event description',
                          icon: '🎉',
                        },
                      ];
                      setSettings({
                        ...settings,
                        scheduleEvents: {
                          date1: newEvents,
                          date2: settings.scheduleEvents?.date2 || [],
                        },
                      });
                    }}
                    className="w-full border-2 border-dashed border-amber-300/50 rounded-lg p-4 text-amber-200/70 hover:border-amber-300 hover:text-amber-100 transition-colors text-sm sm:text-base"
                  >
                    + Add New Event for {settings.weddingDate1 || 'First Date'}
                  </button>
                </div>

                {/* December 27 Schedule */}
                <div className="space-y-4 mt-8">
                  <h4 className="text-md font-semibold text-amber-100 border-b border-amber-300/30 pb-2">
                    {settings.weddingDate2 || 'Second Date'} Schedule
                  </h4>
                  {(settings.scheduleEvents?.date2 || []).map(
                    (event, index) => (
                      <div
                        key={index}
                        className="border border-amber-300/30 rounded-lg p-3 sm:p-4 space-y-3 bg-slate-700/30"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm sm:text-base text-amber-100">
                            Event {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newEvents = (
                                settings.scheduleEvents?.date2 || []
                              ).filter((_, i) => i !== index);
                              setSettings({
                                ...settings,
                                scheduleEvents: {
                                  date1: settings.scheduleEvents?.date1 || [],
                                  date2: newEvents,
                                },
                              });
                            }}
                            className="text-red-600 hover:text-red-800 text-xs sm:text-sm px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label
                              htmlFor={`date2-event-time-${index}`}
                              className="text-sm settings-label"
                            >
                              Time
                            </Label>
                            <Input
                              id={`date2-event-time-${index}`}
                              type="time"
                              value={event.time}
                              onChange={e => {
                                const newEvents = [
                                  ...settings.scheduleEvents.date2,
                                ];
                                newEvents[index] = {
                                  ...newEvents[index],
                                  time: e.target.value,
                                };
                                setSettings({
                                  ...settings,
                                  scheduleEvents: {
                                    ...settings.scheduleEvents,
                                    date2: newEvents,
                                  },
                                });
                              }}
                              className="text-sm settings-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor={`date2-event-title-${index}`}
                              className="text-sm settings-label"
                            >
                              Event Title
                            </Label>
                            <Input
                              id={`date2-event-title-${index}`}
                              type="text"
                              value={event.title}
                              onChange={e => {
                                const newEvents = [
                                  ...settings.scheduleEvents.date2,
                                ];
                                newEvents[index] = {
                                  ...newEvents[index],
                                  title: e.target.value,
                                };
                                setSettings({
                                  ...settings,
                                  scheduleEvents: {
                                    ...settings.scheduleEvents,
                                    date2: newEvents,
                                  },
                                });
                              }}
                              placeholder="e.g., Guest Gathering"
                              className="text-sm settings-input"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`date2-event-description-${index}`}
                            className="text-sm settings-label"
                          >
                            Description
                          </Label>
                          <Textarea
                            id={`date2-event-description-${index}`}
                            value={event.description}
                            onChange={e => {
                              const newEvents = [
                                ...settings.scheduleEvents.date2,
                              ];
                              newEvents[index] = {
                                ...newEvents[index],
                                description: e.target.value,
                              };
                              setSettings({
                                ...settings,
                                scheduleEvents: {
                                  ...settings.scheduleEvents,
                                  date2: newEvents,
                                },
                              });
                            }}
                            rows={2}
                            placeholder="Brief description of the event..."
                            className="text-sm settings-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`date2-event-icon-${index}`}
                            className="text-sm settings-label"
                          >
                            Icon (Emoji)
                          </Label>
                          <Input
                            id={`date2-event-icon-${index}`}
                            type="text"
                            value={event.icon}
                            onChange={e => {
                              const newEvents = [
                                ...settings.scheduleEvents.date2,
                              ];
                              newEvents[index] = {
                                ...newEvents[index],
                                icon: e.target.value,
                              };
                              setSettings({
                                ...settings,
                                scheduleEvents: {
                                  ...settings.scheduleEvents,
                                  date2: newEvents,
                                },
                              });
                            }}
                            placeholder="👥"
                            maxLength={2}
                            className="text-sm text-center settings-input"
                          />
                        </div>
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const newEvents = [
                        ...(settings.scheduleEvents?.date2 || []),
                        {
                          time: '12:00',
                          title: 'New Event',
                          description: 'Event description',
                          icon: '🎉',
                        },
                      ];
                      setSettings({
                        ...settings,
                        scheduleEvents: {
                          date1: settings.scheduleEvents?.date1 || [],
                          date2: newEvents,
                        },
                      });
                    }}
                    className="w-full border-2 border-dashed border-amber-300/50 rounded-lg p-4 text-amber-200/70 hover:border-amber-300 hover:text-amber-100 transition-colors text-sm sm:text-base"
                  >
                    + Add New Event for {settings.weddingDate2 || 'Second Date'}
                  </button>
                </div>
              </TabsContent>
            </div>

            {/* Save Button - Fixed at bottom */}
            <div className="px-4 py-4 border-t border-amber-300/20 bg-slate-700/30 flex-shrink-0">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
