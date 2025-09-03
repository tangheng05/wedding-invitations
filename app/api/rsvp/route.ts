import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestId, attending, guestCount, dietaryRestrictions, plusOne, plusOneName, message } = body;

    if (!guestId || attending === undefined) {
      return NextResponse.json(
        { error: 'Guest ID and attendance status are required' },
        { status: 400 }
      );
    }

    // Convert string values to proper types
    const attendingBoolean = attending === 'yes' || attending === true || attending === 'true';
    const plusOneBoolean = plusOne === 'yes' || plusOne === true || plusOne === 'true';
    const guestCountNumber = guestCount ? parseInt(guestCount) : (attendingBoolean ? 1 : 0);

    // Check if guest exists
    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
    });

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // Create or update RSVP
    const rsvp = await prisma.rSVP.upsert({
      where: { guestId },
      update: {
        attending: attendingBoolean,
        guestCount: guestCountNumber,
        dietaryRestrictions,
        plusOne: plusOneBoolean,
        plusOneName,
        message,
        updatedAt: new Date(),
      },
      create: {
        guestId,
        attending: attendingBoolean,
        guestCount: guestCountNumber,
        dietaryRestrictions,
        plusOne: plusOneBoolean,
        plusOneName,
        message,
      },
    });

    // Update guest RSVP status
    const rsvpStatus = attendingBoolean ? 'ATTENDING' : 'NOT_ATTENDING';
    await prisma.guest.update({
      where: { id: guestId },
      data: { rsvpStatus },
    });

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');

    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    const rsvp = await prisma.rSVP.findUnique({
      where: { guestId },
      include: { guest: true },
    });

    if (!rsvp) {
      return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });
    }

    return NextResponse.json(rsvp);
  } catch (error) {
    console.error('Error fetching RSVP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
