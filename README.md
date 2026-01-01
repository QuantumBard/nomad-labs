# Nomad Labs 🏕️

Nomad Labs is a premium, state-of-the-art platform designed for the modern digital nomad. It bridges the gap between high-end lodging and the professional traveler, offering a curated experience for both travelers and property managers.

## 🏗️ Technical Architecture (3-Layer Model)

The application follows a strict 3-layer data architecture to ensure scalability, security, and clear separation of concerns:

1.  **Tier 1: Identity (Users)**
    - **Source**: `users` table
    - **Purpose**: Stores the core digital identity (Email, Display Name, Role, Join Date) and mirrors the Supabase Auth state.
2.  **Tier 2: Persona (Profiles)**
    - **Source**: `profiles` table
    - **Purpose**: Stores the optional, rich "Persona" data (Bio, Languages, Social Links, Phone, Preferences).
3.  **Tier 3: Entities (Businesses / Listings)**
    - **Source**: `businesses` & `listings` tables
    - **Purpose**: Professional property management entities and their associated stays/listings.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS 4, Vanilla CSS (for custom premium aesthetics)
- **State Management**: Redux Toolkit (thunks for async Supabase interactions)
- **Backend/Database**: Supabase (Auth, PostgreSQL with RLS, Storage)
- **Animations**: GSAP, Lucide React icons
- **Types**: TypeScript (Strict mode)

## ✨ Core Features

- **Premium Onboarding**: Automatic role detection and identity synchronization during signup.
- **Profile Sanctuary**: A high-end user dashboard to manage digital identity and extended persona with "View" and "Edit" modes.
- **Host Dashboard**: Complete management suite for property managers to handle businesses and listings.
- **Secure Authentication**: Google & Email/Password auth powered by Supabase, protected by Row-Level Security (RLS).
- **Global Router Guard**: Intelligent redirection logic ensuring protected routes (Onboarding, Dashboards) are only accessible to authenticated users.

## 🛠️ Getting Started

### 1. Prerequisites

- Node.js 20+
- A Supabase Project

### 2. Environment Variables

Create a `.env` file in the root and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup (SQL Editor)

The project requires specific SQL triggers to sync Auth metadata to the `users` table.

```sql
-- Example Trigger for User Sync
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, user_type)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_type')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. Installation & Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🚢 Deployment

The easiest way to deploy is via [Vercel](https://vercel.com). Ensure your environment variables are configured in the Vercel dashboard.

---

Built with ❤️ by the Nomad Labs Team.
