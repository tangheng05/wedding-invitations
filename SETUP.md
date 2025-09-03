# 🚀 Quick Setup Guide

## 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/wedding_invitation?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key-here"
```

## 2. Database Setup

### Option A: Local PostgreSQL
1. Install PostgreSQL
2. Create database: `createdb wedding_invitation`
3. Update DATABASE_URL in `.env`

### Option B: Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string to `.env`

## 3. Google Maps Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Maps JavaScript API
4. Create API key
5. Add to `.env` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## 4. Install & Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with sample data
pnpm db:seed

# Start development server
pnpm dev
```

## 5. Test the App

- **Guest Page**: Visit `/john-smith-001`
- **RSVP Form**: Click "RSVP Now" button
- **Admin Login**: Visit `/login`
  - Email: `admin@wedding.com`
  - Password: `admin123`
- **Admin Dashboard**: Visit `/admin`
- **QR Codes**: Generate and download from admin dashboard
- **Maps**: Interactive venue location with directions

## 6. Sample Data

The seed script creates:
- Admin user: `admin@wedding.com` / `admin123`
- 3 sample guests with unique links
- 2 sample RSVPs

## 🎯 Next Steps

Ready to implement:
- Advanced Features (Dietary restrictions, Plus-ones)
- Performance Optimization
- Testing & Deployment
