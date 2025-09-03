# 💒 Wedding Invitation App

A modern, personalized wedding invitation web application built with Next.js 15, React 19, Tailwind CSS, and PostgreSQL.

## ✨ Features

- **Personalized Guest Pages**: Each guest gets a unique, personalized invitation
- **RSVP Management**: Easy RSVP submission with dietary restrictions and plus-one handling
- **Admin Dashboard**: Complete guest management and RSVP tracking
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Database Integration**: PostgreSQL with Prisma ORM for data persistence
- **Performance Optimized**: Built with Next.js 15 for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wedding-invitation
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/wedding_invitation?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Push schema to database
   pnpm db:push
   
   # Seed with sample data
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── (auth)/              # Admin authentication routes
│   ├── login/           # Admin login page
│   └── admin/           # Admin dashboard
├── (guest)/             # Guest-facing routes
│   ├── [guestId]/       # Personalized guest pages
│   └── rsvp/            # RSVP form
├── api/                 # API endpoints
│   ├── auth/            # Authentication APIs
│   ├── guests/          # Guest management APIs
│   └── rsvp/            # RSVP APIs
├── components/          # Reusable UI components
├── lib/                 # Utility functions and database
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## 🗄️ Database Schema

### Models

- **Guest**: Guest information and unique links
- **RSVP**: RSVP responses with dietary restrictions
- **AdminUser**: Admin authentication

### Key Features

- Unique guest links for personalized invitations
- RSVP status tracking
- Dietary restrictions and plus-one management
- Optimized indexes for performance

## 🎯 Usage

### For Guests

1. **Access Invitation**: Visit `/guest-unique-link`
2. **View Details**: See personalized wedding information
3. **Submit RSVP**: Fill out the RSVP form with preferences

### For Admins

1. **Login**: Access `/login` with admin credentials
2. **Dashboard**: View guest statistics and RSVP status
3. **Manage Guests**: Add, edit, and track guest information

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio

### Code Quality

- **ESLint**: TypeScript and Next.js rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Authentication secret key
- `NEXTAUTH_URL`: Your application URL

## 📊 Performance

- **Lighthouse Score**: Target >90 for all categories
- **Core Web Vitals**: Optimized for best user experience
- **Database**: Indexed queries for fast response times
- **Caching**: Next.js built-in caching strategies

## 🔒 Security

- **Authentication**: NextAuth.js for admin access
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection**: Protected with Prisma ORM
- **Environment Variables**: Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for special moments**
