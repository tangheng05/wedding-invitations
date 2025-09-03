import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Update guest
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedGuest = await prisma.guest.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        relationship: body.relationship || null,
        rsvpStatus: body.rsvpStatus,
        plusOne: body.plusOne,
        plusOneName: body.plusOneName || null,
      },
    });

    return NextResponse.json(updatedGuest);
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json(
      { error: 'Failed to update guest' },
      { status: 500 }
    );
  }
}

// Delete guest
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete related RSVP first
    await prisma.rSVP.deleteMany({
      where: { guestId: id },
    });

    // Delete the guest
    await prisma.guest.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    );
  }
}
