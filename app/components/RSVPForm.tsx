"use client"

import { useState } from "react"

interface Guest {
  id: string
  name: string
  uniqueLink: string
  rsvp?: {
    attending: boolean
    guestCount?: number
  } | null
}

interface RSVPFormProps {
  guest: Guest
}

export default function RSVPForm({ guest }: RSVPFormProps) {
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guestCount, setGuestCount] = useState<number>(
    guest.rsvp?.guestCount ?? 1
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestId: guest.id,
          attending,
          guestCount: attending ? guestCount : 0,
        }),
      })

      if (response.ok) {
        setMessage("RSVP updated successfully!")
        setShowForm(false)
        // Refresh the page after a short delay to show updated status
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setMessage("Failed to update RSVP. Please try again.")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (guest.rsvp && !showForm && !isSubmitting && !message) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-700/50 rounded-lg border border-amber-300/30">
          <p className="text-amber-200/80 mb-2">
            <strong>RSVP Status:</strong> {guest.rsvp.attending ? "Attending" : "Not Attending"}
          </p>
          {guest.rsvp.attending && guest.rsvp.guestCount && (
            <p className="text-amber-200/70 text-sm">
              Guest Count: {guest.rsvp.guestCount}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setAttending(null) // Reset to null so user can make a new selection
            setGuestCount(guest.rsvp?.guestCount ?? 1)
            setShowForm(true)
          }}
          className="bg-amber-600 hover:bg-amber-700 text-slate-900 px-6 py-2 rounded-full text-sm font-semibold transition-colors"
        >
          Update RSVP
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-amber-100">RSVP</h4>
          {guest.rsvp && (
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-amber-200/70 hover:text-amber-200 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
        
        {/* Current Status Reference */}
        {guest.rsvp && (
          <div className="p-3 bg-slate-700/30 rounded-lg border border-amber-300/20 mb-4">
            <p className="text-sm text-amber-200/70">
              <strong>Current Status:</strong> {guest.rsvp.attending ? "Attending" : "Not Attending"}
              {guest.rsvp.attending && guest.rsvp.guestCount && ` (${guest.rsvp.guestCount} guest${guest.rsvp.guestCount > 1 ? 's' : ''})`}
            </p>
          </div>
        )}
        
        {/* Attending/Not Attending Selection */}
        <div className="space-y-3">
          <div className="flex justify-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="attending"
                value="true"
                checked={attending === true}
                onChange={() => setAttending(true)}
                className="w-4 h-4 text-amber-500 bg-slate-700 border-amber-300 focus:ring-amber-500"
              />
              <span className="text-amber-200/80">Attending</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="attending"
                value="false"
                checked={attending === false}
                onChange={() => setAttending(false)}
                className="w-4 h-4 text-amber-500 bg-slate-700 border-amber-300 focus:ring-amber-500"
              />
              <span className="text-amber-200/80">Not Attending</span>
            </label>
          </div>
        </div>

        {/* Guest Count (only show if attending) */}
        {attending === true && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-amber-200/80">
              Number of Guests
            </label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              className="w-full max-w-xs mx-auto bg-slate-700/50 border border-amber-300/30 rounded-lg px-3 py-2 text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num} className="bg-slate-700">
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        {attending !== null && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-xs mx-auto bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 px-8 py-3 rounded-full text-lg font-semibold transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit RSVP"}
          </button>
        )}

        {/* Message */}
        {message && (
          <div className={`text-center text-sm ${
            message.includes("successfully") 
              ? "text-green-400" 
              : "text-red-400"
          }`}>
            {message}
          </div>
        )}
      </div>
    </form>
  )
}
