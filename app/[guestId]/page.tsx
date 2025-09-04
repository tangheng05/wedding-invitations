import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import Image from "next/image"
import Link from "next/link"
import { ButterflySwarm } from "../components/Butterfly"

interface GuestPageProps {
  params: { guestId: string }
}

export default async function GuestPage({ params }: GuestPageProps) {
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

  // Extract couple initials for monogram
  const brideInitial = settings.brideName.charAt(0)
  const groomInitial = settings.groomName.charAt(0)
  const coupleInitials = `${brideInitial}${groomInitial}`

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/background/background.mobile.jpg" alt="Enchanted Garden" fill className="object-cover" priority />
        {/* Enhanced overlay for mystical atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-800/30 to-slate-900/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20"></div>
      </div>

      {/* Floating magical elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
        {/* Glowing orbs */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-amber-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-32 right-16 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-48 left-20 w-1 h-1 bg-amber-200 rounded-full opacity-50 animate-pulse delay-500"></div>
        <div className="absolute top-64 right-24 w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-pulse delay-1500"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-80 animate-pulse delay-700"></div>
        <div className="absolute bottom-56 right-1/3 w-1 h-1 bg-yellow-200 rounded-full opacity-60 animate-pulse delay-300"></div>
      </div>

      {/* Butterflies overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
        <ButterflySwarm count={12} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6">
        {/* Top Section with Monogram */}
        <div className="text-center pt-8">
          {/* Monogram Circle */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-amber-300/60 bg-slate-800/40 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl font-serif text-amber-200 font-bold">
                {settings.brideName.charAt(0)}{settings.groomName.charAt(0)}
              </span>
            </div>

            {/* Khmer Title */}
            <div className="mb-4">
              <p className="text-lg text-amber-200/90 font-medium tracking-wide">សូមគោរពអញ្ជើញ</p>
            </div>
          </div>

          {/* Guest Name Section */}
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-serif text-amber-100 mb-3 drop-shadow-lg tracking-wide">
              {guest.name}
            </h2>
          </div>
        </div>

        {/* Center Section with Main Button */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Main Invitation Button */}
            <Link href={`/${guestId}/invitation`} className="group relative inline-block">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-300/40 hover:border-amber-300/60 text-amber-200 px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-lg font-medium text-amber-200 mb-1">បើកធៀប</div>
                  <div className="text-sm text-amber-100/80">Open Invitation</div>
                </div>
              </div>
            </Link>

            {/* Decorative dots */}
            <div className="mt-8 flex justify-center space-x-3">
              <div className="w-2 h-2 bg-amber-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="w-2 h-2 bg-amber-200 rounded-full opacity-70 animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-amber-300 rounded-full opacity-60 animate-pulse delay-300"></div>
            </div>
          </div>
        </div>

        {/* Bottom Section with Couple Names */}
        <div className="text-center pb-8">
          {/* Instruction Text */}
          <div className="mb-6">
            <p className="text-sm text-amber-200/80 mb-2">អក្រង់ដើម្បីបើកធៀបអេឡិចត្រូនិច</p>
            <p className="text-xs text-amber-100/70">Touch to open the electronic invitation</p>
          </div>

          {/* Couple Names Card */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-amber-300/30 rounded-2xl p-6 max-w-sm mx-auto">
            <div className="space-y-3">
              <h3 className="text-xl font-serif text-amber-200 tracking-wide">{settings.brideName}</h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-8 h-px bg-amber-300/50"></div>
                <span className="text-amber-200 text-lg">&</span>
                <div className="w-8 h-px bg-amber-300/50"></div>
              </div>
              <h3 className="text-xl font-serif text-amber-200 tracking-wide">{settings.groomName}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
