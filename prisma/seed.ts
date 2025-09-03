import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash admin password
  const hashedPassword = await bcrypt.hash('admin123', 12);

  // Create admin user
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@wedding.com' },
    update: {},
    create: {
      email: 'admin@wedding.com',
      password: hashedPassword,
      name: 'Wedding Admin',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create sample guests
  const guests = await Promise.all([
    prisma.guest.upsert({
      where: { uniqueLink: 'john-smith-001' },
      update: {},
      create: {
        name: 'John Smith',
        email: 'john@example.com',
        uniqueLink: 'john-smith-001',
      },
    }),
    prisma.guest.upsert({
      where: { uniqueLink: 'jane-doe-002' },
      update: {},
      create: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        uniqueLink: 'jane-doe-002',
      },
    }),
    prisma.guest.upsert({
      where: { uniqueLink: 'bob-johnson-003' },
      update: {},
      create: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        uniqueLink: 'bob-johnson-003',
      },
    }),
  ]);

  console.log('✅ Sample guests created:', guests.length);

  // Create sample RSVPs
  const rsvps = await Promise.all([
    prisma.rSVP.upsert({
      where: { guestId: guests[0].id },
      update: {},
      create: {
        guestId: guests[0].id,
        attending: true,
        dietaryRestrictions: 'Vegetarian',
        plusOne: true,
        plusOneName: 'Sarah Smith',
        message: 'Looking forward to celebrating with you!',
      },
    }),
    prisma.rSVP.upsert({
      where: { guestId: guests[1].id },
      update: {},
      create: {
        guestId: guests[1].id,
        attending: false,
        message: 'Sorry, I have a prior commitment.',
      },
    }),
  ]);

  console.log('✅ Sample RSVPs created:', rsvps.length);

  // Create wedding settings
  const weddingSettings = await prisma.weddingSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      brideName: 'Jane',
      groomName: 'John',
      weddingDate: '2024-12-25',
      weddingTime: '14:00:00',
      ceremonyTime: '14:00:00',
      receptionTime: '16:00:00',
      venueName: 'Grand Ballroom',
      venueAddress: '123 Main Street',
      venueCity: 'New York',
      venueState: 'NY',
      venueZip: '10001',
      venueCountry: 'USA',
      googleMapsUrl: 'https://maps.google.com/example',
      dressCode: 'Formal',
      welcomeMessage: 'Welcome to our special day! We are so excited to celebrate with you.',
      storyMessage: 'Our love story began when we met at college. After years of friendship, we realized we were meant to be together.',
      rsvpMessage: '',
      couplePhoto: '/placeholder-couple.jpg',
      venuePhoto: '/placeholder-venue.jpg',
      preweddingPhotos: [],
      contactEmail: 'contact@wedding.com',
      contactPhone: '555-123-4567',
      accommodationInfo: 'Hotel recommendations will be provided closer to the date.',
      transportationInfo: 'Parking is available at the venue. Shuttle service will be provided from the hotel.',
      giftInfo: 'Your presence is the greatest gift. If you wish to give something, a contribution to our honeymoon fund would be appreciated.',
      scheduleEvents: { date1: [], date2: [] },
      weddingDate1: 'December 26',
      weddingDate2: 'December 27'
    }
  });

  console.log('✅ Wedding settings created');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
