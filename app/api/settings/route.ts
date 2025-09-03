import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get the first (and only) settings record
    const settings = await prisma.weddingSettings.findFirst();
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
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
        accommodationInfo: '',
        transportationInfo: '',
        giftInfo: '',
        scheduleEvents: { date1: [], date2: [] },
        weddingDate1: 'December 26',
        weddingDate2: 'December 27'
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    // If there's a database error (like table doesn't exist), return default settings
    return NextResponse.json({
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
        accommodationInfo: '',
        transportationInfo: '',
        giftInfo: '',
        scheduleEvents: { date1: [], date2: [] },
        weddingDate1: 'December 26',
        weddingDate2: 'December 27'
      });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  try {
    
    // Upsert settings (create if doesn't exist, update if it does)
    const settings = await prisma.weddingSettings.upsert({
      where: { id: 'main' }, // Use a fixed ID for the main settings
      update: {
        brideName: body.brideName || '',
        groomName: body.groomName || '',
        weddingDate: body.weddingDate || '',
        weddingTime: body.weddingTime || '',
        venueName: body.venueName || '',
        venueAddress: body.venueAddress || '',
        venueCity: body.venueCity || '',
        venueState: body.venueState || '',
        venueZip: body.venueZip || '',
        venueCountry: body.venueCountry || '',
        googleMapsUrl: body.googleMapsUrl || '',
        ceremonyTime: body.ceremonyTime || '',
        receptionTime: body.receptionTime || '',
        dressCode: body.dressCode || '',
        welcomeMessage: body.welcomeMessage || '',
        storyMessage: body.storyMessage || '',
        rsvpMessage: body.rsvpMessage || '',
        couplePhoto: body.couplePhoto || '',
        venuePhoto: body.venuePhoto || '',
        preweddingPhotos: body.preweddingPhotos || [],
        contactEmail: body.contactEmail || '',
        contactPhone: body.contactPhone || '',
        accommodationInfo: body.accommodationInfo || '',
        transportationInfo: body.transportationInfo || '',
        giftInfo: body.giftInfo || '',
        scheduleEvents: body.scheduleEvents || []
      } as any,
      create: {
        id: 'main',
        brideName: body.brideName || '',
        groomName: body.groomName || '',
        weddingDate: body.weddingDate || '',
        weddingTime: body.weddingTime || '',
        venueName: body.venueName || '',
        venueAddress: body.venueAddress || '',
        venueCity: body.venueCity || '',
        venueState: body.venueState || '',
        venueZip: body.venueZip || '',
        venueCountry: body.venueCountry || '',
        googleMapsUrl: body.googleMapsUrl || '',
        ceremonyTime: body.ceremonyTime || '',
        receptionTime: body.receptionTime || '',
        dressCode: body.dressCode || '',
        welcomeMessage: body.welcomeMessage || '',
        storyMessage: body.storyMessage || '',
        rsvpMessage: body.rsvpMessage || '',
        couplePhoto: body.couplePhoto || '',
        venuePhoto: body.venuePhoto || '',
        preweddingPhotos: body.preweddingPhotos || [],
        contactEmail: body.contactEmail || '',
        contactPhone: body.contactPhone || '',
        accommodationInfo: body.accommodationInfo || '',
        transportationInfo: body.transportationInfo || '',
        giftInfo: body.giftInfo || '',
        scheduleEvents: body.scheduleEvents || []
      } as any,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    // If there's a database error (like table doesn't exist), try to create the table first
    try {
      // This will create the table if it doesn't exist
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS wedding_settings (
        id VARCHAR(255) PRIMARY KEY,
        bride_name TEXT NOT NULL,
        groom_name TEXT NOT NULL,
        wedding_date TEXT NOT NULL,
        wedding_time TEXT NOT NULL,
        venue_name TEXT NOT NULL,
        venue_address TEXT NOT NULL,
        venue_city TEXT NOT NULL,
        venue_state TEXT NOT NULL,
        venue_zip TEXT NOT NULL,
        venue_country TEXT NOT NULL,
        google_maps_url TEXT NOT NULL,
        ceremony_time TEXT NOT NULL,
        reception_time TEXT NOT NULL,
        dress_code TEXT NOT NULL,
        welcome_message TEXT NOT NULL,
        story_message TEXT NOT NULL,
        rsvp_message TEXT NOT NULL,
        couple_photo TEXT NOT NULL,
        venue_photo TEXT NOT NULL,
        prewedding_photos TEXT[] NOT NULL,
        contact_email TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        accommodation_info TEXT NOT NULL,
        transportation_info TEXT NOT NULL,
        gift_info TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
      
      // Now try to create the settings again
      const settings = await prisma.weddingSettings.create({
        data: {
          id: 'main',
          brideName: body.brideName || '',
          groomName: body.groomName || '',
          weddingDate: body.weddingDate || '',
          weddingTime: body.weddingTime || '',
          venueName: body.venueName || '',
          venueAddress: body.venueAddress || '',
          venueCity: body.venueCity || '',
          venueState: body.venueState || '',
          venueZip: body.venueZip || '',
          venueCountry: body.venueCountry || '',
          googleMapsUrl: body.googleMapsUrl || '',
          ceremonyTime: body.ceremonyTime || '',
          receptionTime: body.receptionTime || '',
          dressCode: body.dressCode || '',
          welcomeMessage: body.welcomeMessage || '',
          storyMessage: body.storyMessage || '',
          rsvpMessage: body.rsvpMessage || '',
          couplePhoto: body.couplePhoto || '',
          venuePhoto: body.venuePhoto || '',
          preweddingPhotos: body.preweddingPhotos || [],
          contactEmail: body.contactEmail || '',
          contactPhone: body.contactPhone || '',
          accommodationInfo: body.accommodationInfo || '',
          transportationInfo: body.transportationInfo || '',
          giftInfo: body.giftInfo || '',
          scheduleEvents: body.scheduleEvents || []
        } as any,
      });
      
      return NextResponse.json(settings);
    } catch (createError) {
      console.error('Error creating table or settings:', createError);
      return NextResponse.json(
        { error: 'Failed to create settings table' },
        { status: 500 }
      );
    }
  }
}
