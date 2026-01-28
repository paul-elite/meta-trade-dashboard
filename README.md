# MetaTrade Dashboard

A modern digital wallet dashboard built with Next.js 14, Tailwind CSS, and Supabase.

## Features

- User authentication (signup, login, logout)
- Dashboard with balance overview and statistics
- Deposit funds via multiple payment methods
- Withdraw funds to bank or card
- Transaction history with filtering
- Account settings management
- Responsive design for all devices
- Dark mode interface

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **State Management:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd meta-trade-dashboard
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Get your project URL and anon key from **Settings > API**

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, signup)
│   ├── (dashboard)/      # Dashboard pages
│   │   ├── dashboard/    # Main dashboard
│   │   ├── deposit/      # Deposit page
│   │   ├── withdraw/     # Withdraw page
│   │   ├── transactions/ # Transaction history
│   │   └── settings/     # Account settings
│   └── page.tsx          # Landing page
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── providers/        # Context providers
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase/         # Supabase client
│   └── utils.ts          # Utility functions
├── store/                # Zustand store
└── types/                # TypeScript types
```

## Deployment to Supabase

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the environment variables
4. Deploy

### Deploy to Supabase Hosting

1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref your-project-ref`
3. Deploy: `supabase functions deploy`

## Database Schema

The database includes three main tables:

- **profiles:** User profile information
- **wallets:** User wallet with balance
- **transactions:** Transaction history (deposits, withdrawals, transfers)

Row Level Security (RLS) policies ensure users can only access their own data.

## License

MIT
