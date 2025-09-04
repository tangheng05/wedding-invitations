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
        backgroundMusicUrl: '',
        musicAutoPlay: false,
        scheduleEvents: { date1: [], date2: [] },
        weddingDate1: 'December 26',
        weddingDate2: 'December 27',
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
      backgroundMusicUrl: '',
      musicAutoPlay: false,
      scheduleEvents: { date1: [], date2: [] },
      weddingDate1: 'December 26',
      weddingDate2: 'December 27',
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
        backgroundMusicUrl: body.backgroundMusicUrl || '',
        musicAutoPlay: body.musicAutoPlay || false,
        scheduleEvents: body.scheduleEvents || { date1: [], date2: [] },
        weddingDate1: body.weddingDate1,
        weddingDate2: body.weddingDate2,
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
        backgroundMusicUrl: body.backgroundMusicUrl || '',
        musicAutoPlay: body.musicAutoPlay || false,
        scheduleEvents: body.scheduleEvents || { date1: [], date2: [] },
        weddingDate1: body.weddingDate1 || 'December 26',
        weddingDate2: body.weddingDate2 || 'December 27',
      } as any,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to save settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
