import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');
    const uniqueLink = searchParams.get('uniqueLink');

    if (guestId) {
      const guest = await prisma.guest.findUnique({
        where: { id: guestId },
        include: { rsvp: true },
      });

      if (!guest) {
        return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
      }

      return NextResponse.json(guest);
    }

    if (uniqueLink) {
      const guest = await prisma.guest.findUnique({
        where: { uniqueLink },
        include: { rsvp: true },
      });

      if (!guest) {
        return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
      }

      return NextResponse.json(guest);
    }

    // Get all guests (for admin dashboard)
    const guests = await prisma.guest.findMany({
      include: { rsvp: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate unique link from name
    const uniqueLink = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    const guest = await prisma.guest.create({
      data: {
        name,
        email: email || null,
        uniqueLink,
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
