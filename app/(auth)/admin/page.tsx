import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  // Fetch real data from database
  const [totalGuests, attendingGuests, pendingGuests] = await Promise.all([
    prisma.guest.count(),
    prisma.guest.count({ where: { rsvpStatus: 'ATTENDING' } }),
    prisma.guest.count({ where: { rsvpStatus: 'PENDING' } }),
  ]);

  const recentGuests = await prisma.guest.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { rsvp: true },
  });

  const allGuests = await prisma.guest.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <AdminDashboard
      totalGuests={totalGuests}
      attendingGuests={attendingGuests}
      pendingGuests={pendingGuests}
      recentGuests={recentGuests}
      allGuests={allGuests}
      adminName={session.user?.name || session.user?.email || 'Admin'}
    />
  );
}
