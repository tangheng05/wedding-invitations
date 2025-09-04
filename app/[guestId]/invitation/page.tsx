import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import CountdownTimer from '@/app/components/CountdownTimer';
import PhotoGallery from '@/app/components/PhotoGallery';
import VenueMap from '@/app/components/VenueMap';
import WeddingSchedule from '@/app/components/WeddingSchedule';
import RSVPForm from '../../components/RSVPForm';
import { ButterflySwarm } from '@/app/components/Butterfly';
import MusicPlayer from '../../../components/MusicPlayer';

interface InvitationPageProps {
  params: { guestId: string };
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { guestId } = await params;

  // Fetch guest data from database
  const guest = await prisma.guest.findUnique({
    where: { uniqueLink: guestId },
    include: { rsvp: true },
  });

  if (!guest) {
    notFound();
  }

  // Fetch wedding settings from database
  const settings = await prisma.weddingSettings.findFirst();

  if (!settings) {
    throw new Error('Wedding settings not found');
  }

  const weddingDate = new Date(settings.weddingDate);
  const venueAddress = `${settings.venueAddress}, ${settings.venueCity}, ${settings.venueState} ${settings.venueZip}, ${settings.venueCountry}`;
  // Convert string array to Photo objects
  const galleryPhotos = (settings.preweddingPhotos || []).map(
    (photo, index) => ({
      id: `photo-${index}`,
      src: photo,
      alt: `Pre-wedding photo ${index + 1}`,
      caption: `Our Journey Together (${index + 1})`,
    })
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/background/background-mobile2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-[2px]"></div>

      {/* Butterfly animations */}
      <ButterflySwarm count={12} />
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href={`/${guestId}`}
          className="bg-slate-800/80 backdrop-blur-sm border border-amber-300/40 text-amber-200 px-3 py-2 rounded-full shadow-lg hover:bg-slate-700/80 transition-all duration-300 flex items-center space-x-2 text-sm"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Back to Landing</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      {/* Music Player */}
      {(settings as any).backgroundMusicUrl && (
        <div className="fixed bottom-4 left-4 md:left-auto md:right-4 z-[100]">
          <MusicPlayer
            musicUrl={(settings as any).backgroundMusicUrl}
            autoPlay={(settings as any).musicAutoPlay}
            className="w-80 max-w-[calc(100vw-2rem)]"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Monogram */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-amber-300/60 bg-slate-800/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <span className="text-3xl font-serif text-amber-200 font-bold">
              {settings.brideName?.[0]}
              {settings.groomName?.[0]}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-amber-100 mb-4 tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
            Wedding Invitation
          </h1>
          <p className="text-xl text-amber-200/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Dear {guest.name}, we would be honored by your presence
          </p>
        </div>

        {/* Couple Photo & Countdown */}
        {settings.couplePhoto && (
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8 text-center">
            <img
              src={
                settings.couplePhoto.startsWith('/api/images/')
                  ? settings.couplePhoto
                  : `/api/images/${settings.couplePhoto.split('/').pop()}`
              }
              alt={`${settings.brideName} and ${settings.groomName}`}
              className="w-48 h-48 object-cover rounded-full mx-auto mb-6 shadow-lg border-4 border-amber-300/40"
            />
            <h2 className="text-3xl font-serif text-amber-100 mb-4 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {settings.brideName} & {settings.groomName}
            </h2>
            <p className="text-lg text-amber-200/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              Request the pleasure of your company
            </p>
            <p className="text-lg text-amber-200/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              as we celebrate our wedding
            </p>
          </div>
        )}

        {/* Welcome Message & Event Details */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
          {/* Welcome Section */}
          {settings.welcomeMessage && (
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif text-amber-100 mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                Welcome
              </h3>
              <p className="text-lg text-amber-200/80 leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {settings.welcomeMessage}
              </p>
            </div>
          )}

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-amber-100 mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                When
              </h3>
              <p className="text-lg text-amber-200/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {weddingDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-amber-200/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {new Date(
                  `2000-01-01T${settings.weddingTime}`
                ).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-amber-100 mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                Where
              </h3>
              <p className="text-lg text-amber-200/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {settings.venueName}
              </p>
              <p className="text-amber-200/70 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {venueAddress}
              </p>
            </div>
          </div>

          {/* Response Section */}
          <div className="text-center">
            <RSVPForm guest={guest} />
          </div>
        </div>

        {/* Our Story with Photo Gallery */}
        {(settings.storyMessage ||
          (galleryPhotos.length > 0 &&
            galleryPhotos.some(
              photo => photo.src && photo.src.trim() !== ''
            ))) && (
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-serif text-amber-100 mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                Our Story
              </h3>
              {settings.storyMessage && (
                <p className="text-lg text-amber-200/80 leading-relaxed mb-8 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                  {settings.storyMessage}
                </p>
              )}

              {/* Photo Gallery */}
              {galleryPhotos.length > 0 &&
                galleryPhotos.some(
                  photo => photo.src && photo.src.trim() !== ''
                ) && (
                  <div>
                    <PhotoGallery
                      photos={galleryPhotos.filter(
                        photo => photo.src && photo.src.trim() !== ''
                      )}
                      title=""
                    />
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Location & Wedding Schedule */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
          {/* Venue Map Section */}
          <div className="mb-8">
            <VenueMap
              venue={settings.venueName}
              address={venueAddress}
              coordinates={{
                lat: 40.7128, // Default to NYC coordinates - should be replaced with actual venue coordinates
                lng: -74.006,
              }}
            />
            {settings.googleMapsUrl && (
              <div className="text-center">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Wedding Schedule Section */}
          <div>
            <WeddingSchedule
              scheduleEvents={
                (settings as any).scheduleEvents || { date1: [], date2: [] }
              }
              weddingDate1={(settings as any).weddingDate1}
              weddingDate2={(settings as any).weddingDate2}
            />
          </div>
        </div>

        {/* Additional Information removed */}

        {/* Quick Access + Contact (single card near bottom) */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            {/* Countdown Timer */}
            <div className="mb-8">
              <h3 className="text-2xl font-serif text-amber-100 mb-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                Countdown to Our Special Day together
              </h3>
              <CountdownTimer weddingDate={weddingDate} />
            </div>

            {/* Divider between countdown and QR */}
            <div className="my-8 flex items-center justify-center">
              <div className="h-px w-24 bg-amber-300/30" />
              <span className="mx-3 text-amber-200/60 text-sm">•</span>
              <div className="h-px w-24 bg-amber-300/30" />
            </div>

            {/* Quick Access */}
            <h3 className="text-2xl font-serif text-amber-100 mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              Quick Access
            </h3>
            <p className="text-amber-200/80 mb-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              Scan this QR code to easily access your invitation anytime
            </p>
            <div className="inline-block p-4 bg-slate-700/50 rounded-lg border border-amber-300/30 shadow-lg">
              <img
                src={`/api/qr/${guest.id}`}
                alt={`QR Code for ${guest.name}`}
                className="w-32 h-32"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-amber-200/60 mt-3 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              Share this page:{' '}
              <span className="font-mono text-xs break-all">
                {guest.uniqueLink}
              </span>
            </p>

            {/* Divider */}
            {(settings.contactEmail || settings.contactPhone) && (
              <div className="my-8 flex items-center justify-center">
                <div className="h-px w-24 bg-amber-300/30" />
                <span className="mx-3 text-amber-200/60 text-sm">Contact</span>
                <div className="h-px w-24 bg-amber-300/30" />
              </div>
            )}

            {/* Contact Us */}
            {(settings.contactEmail || settings.contactPhone) && (
              <div className="text-center space-y-2">
                <h4 className="text-xl font-serif text-amber-100 mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Contact Us
                </h4>
                {settings.contactEmail && (
                  <p className="text-lg text-amber-200/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                    <strong>Email:</strong> {settings.contactEmail}
                  </p>
                )}
                {settings.contactPhone && (
                  <p className="text-lg text-amber-200/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                    <strong>Phone:</strong> {settings.contactPhone}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-amber-200/70">
          <p className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            We can't wait to celebrate with you!
          </p>
          {settings.rsvpMessage && (
            <p className="mt-2 text-sm drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              {settings.rsvpMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
