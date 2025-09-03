import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import CountdownTimer from "@/app/components/CountdownTimer"
import PhotoGallery from "@/app/components/PhotoGallery"
import VenueMap from "@/app/components/VenueMap"
import WeddingSchedule from "@/app/components/WeddingSchedule"
import RSVPForm from "../../components/RSVPForm"

interface InvitationPageProps {
  params: { guestId: string }
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { guestId } = await params
  
  // Fetch guest data from database
  const guest = await prisma.guest.findUnique({
    where: { uniqueLink: guestId },
    include: { rsvp: true },
  })

  if (!guest) {
    notFound()
  }

  // Fetch wedding settings from database
  const settings = await prisma.weddingSettings.findFirst()

  if (!settings) {
    throw new Error("Wedding settings not found")
  }
  
  const weddingDate = new Date(settings.weddingDate)
  const venueAddress = `${settings.venueAddress}, ${settings.venueCity}, ${settings.venueState} ${settings.venueZip}, ${settings.venueCountry}`
  // Convert string array to Photo objects
  const galleryPhotos = (settings.preweddingPhotos || []).map((photo, index) => ({
    id: `photo-${index}`,
    src: photo,
    alt: `Pre-wedding photo ${index + 1}`,
    caption: `Our Journey Together (${index + 1})`
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href={`/${guestId}`}
          className="bg-slate-800/80 backdrop-blur-sm border border-amber-300/40 text-amber-200 px-4 py-2 rounded-full shadow-lg hover:bg-slate-700/80 transition-all duration-300 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Landing</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Monogram */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-amber-300/60 bg-slate-800/40 backdrop-blur-sm flex items-center justify-center">
            <span className="text-3xl font-serif text-amber-200 font-bold">
              {settings.brideName?.[0]}{settings.groomName?.[0]}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-amber-100 mb-4 tracking-wide">Wedding Invitation</h1>
          <p className="text-xl text-amber-200/80">Dear {guest.name}, we would be honored by your presence</p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
          <CountdownTimer weddingDate={weddingDate} />
        </div>

        {/* Couple Photo */}
        {settings.couplePhoto && (
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8 text-center">
            <img
              src={settings.couplePhoto || "/placeholder.svg"}
              alt={`${settings.brideName} and ${settings.groomName}`}
              className="w-48 h-48 object-cover rounded-full mx-auto mb-6 shadow-lg border-4 border-amber-300/40"
            />
            <h2 className="text-3xl font-serif text-amber-100 mb-4 tracking-wide">
              {settings.brideName} & {settings.groomName}
            </h2>
            <p className="text-lg text-amber-200/80">Request the pleasure of your company</p>
            <p className="text-lg text-amber-200/80">as we celebrate our wedding</p>
          </div>
        )}

        {/* Welcome Message */}
        {settings.welcomeMessage && (
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-serif text-amber-100 mb-4">Welcome</h3>
              <p className="text-lg text-amber-200/80 leading-relaxed">{settings.welcomeMessage}</p>
            </div>
          </div>
        )}

        {/* Event Details */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-amber-100 mb-2">When</h3>
              <p className="text-lg text-amber-200/80">
                {weddingDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-amber-200/70">
                {new Date(`2000-01-01T${settings.weddingTime}`).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              {settings.ceremonyTime && (
                <p className="text-sm text-amber-200/60 mt-1">
                  Ceremony:{" "}
                  {new Date(`2000-01-01T${settings.ceremonyTime}`).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}
              {settings.receptionTime && (
                <p className="text-sm text-amber-200/60">
                  Reception:{" "}
                  {new Date(`2000-01-01T${settings.receptionTime}`).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-amber-100 mb-2">Where</h3>
              <p className="text-lg text-amber-200/80">{settings.venueName}</p>
              <p className="text-amber-200/70">{venueAddress}</p>
            </div>
          </div>

          {/* Dress Code */}
          {settings.dressCode && (
            <div className="text-center mb-6">
              <p className="text-sm text-amber-200/70">
                <strong>Dress Code:</strong> {settings.dressCode}
              </p>
            </div>
          )}

          {/* RSVP Section */}
          <div className="text-center">
            <RSVPForm guest={guest} />
          </div>
        </div>

        {/* Our Story */}
        {settings.storyMessage && (
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-serif text-amber-100 mb-4">Our Story</h3>
              <p className="text-lg text-amber-200/80 leading-relaxed">{settings.storyMessage}</p>
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {galleryPhotos.length > 0 && (
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
            <PhotoGallery photos={galleryPhotos} title="Our Love Story" />
          </div>
        )}

        {/* Venue Map Section */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
          <VenueMap 
            venue={settings.venueName} 
            address={venueAddress} 
            coordinates={{ 
              lat: 40.7128, // Default to NYC coordinates - should be replaced with actual venue coordinates
              lng: -74.006 
            }} 
          />
          {settings.googleMapsUrl && (
            <div className="mt-4 text-center">
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
        <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
          <WeddingSchedule 
            scheduleEvents={(settings as any).scheduleEvents || { date1: [], date2: [] }} 
            weddingDate1={(settings as any).weddingDate1}
            weddingDate2={(settings as any).weddingDate2}
          />
        </div>

        {/* Additional Information */}
        {(settings.accommodationInfo || settings.transportationInfo || settings.giftInfo) && (
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-serif text-amber-100 mb-6 text-center">Additional Information</h3>
            <div className="grid md:grid-cols-1 gap-6">
              {settings.accommodationInfo && (
                <div>
                  <h4 className="text-lg font-semibold text-amber-100 mb-2">Accommodation</h4>
                  <p className="text-amber-200/80">{settings.accommodationInfo}</p>
                </div>
              )}
              {settings.transportationInfo && (
                <div>
                  <h4 className="text-lg font-semibold text-amber-100 mb-2">Transportation</h4>
                  <p className="text-amber-200/80">{settings.transportationInfo}</p>
                </div>
              )}
              {settings.giftInfo && (
                <div>
                  <h4 className="text-lg font-semibold text-amber-100 mb-2">Gifts</h4>
                  <p className="text-amber-200/80">{settings.giftInfo}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {(settings.contactEmail || settings.contactPhone) && (
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-serif text-amber-100 mb-6 text-center">Contact Us</h3>
            <div className="text-center space-y-2">
              {settings.contactEmail && (
                <p className="text-lg text-amber-200/80">
                  <strong>Email:</strong> {settings.contactEmail}
                </p>
              )}
              {settings.contactPhone && (
                <p className="text-lg text-amber-200/80">
                  <strong>Phone:</strong> {settings.contactPhone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* QR Code Section */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/30 rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-serif text-amber-100 mb-4">Quick Access</h3>
            <p className="text-amber-200/80 mb-6">Scan this QR code to easily access your invitation anytime</p>
            <div className="inline-block p-4 bg-slate-700/50 rounded-lg border border-amber-300/30">
              <img
                src={`/api/qr/${guest.id}`}
                alt={`QR Code for ${guest.name}`}
                className="w-32 h-32"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-amber-200/60 mt-3">
              Share this page: <span className="font-mono text-xs break-all">{guest.uniqueLink}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-amber-200/70">
          <p>We can't wait to celebrate with you!</p>
          {settings.rsvpMessage && <p className="mt-2 text-sm">{settings.rsvpMessage}</p>}
        </div>
      </div>
    </div>
  )
}
