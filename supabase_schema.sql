-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (Tier 1: Identity)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  photo_url TEXT,
  user_type TEXT DEFAULT 'traveller' CHECK (user_type IN ('traveller', 'manager', 'admin', 'support')),
  email_verified BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (Tier 2: Persona)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  bio TEXT,
  socials JSONB DEFAULT '{}',
  language TEXT,
  phone_number TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  phone_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'suspended', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Business Managers Table
CREATE TABLE IF NOT EXISTS business_managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'manager' CHECK (role IN ('owner', 'manager', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, user_id)
);

-- Listings Table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('stay', 'experience', 'coworking', 'other')),
  gender_policy TEXT,
  internal_label TEXT,
  public_title TEXT NOT NULL,
  total_inventory INTEGER DEFAULT 1,
  max_occupancy_adults INTEGER DEFAULT 2,
  max_occupancy_children INTEGER DEFAULT 0,
  bed_configuration JSONB,
  bathroom_type TEXT DEFAULT 'private',
  base_nightly_rate NUMERIC(10, 2) DEFAULT 0,
  weekend_markup BOOLEAN DEFAULT false,
  extra_guest_charge TEXT DEFAULT '0',
  cancellation_policy TEXT DEFAULT 'flexible',
  amenities TEXT[] DEFAULT '{}',
  view_from_room TEXT,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  photos TEXT[] DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

-- RLS Policies for Profiles
CREATE POLICY "Users can view their own persona" ON profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own persona" ON profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own persona" ON profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for Businesses
CREATE POLICY "Owners can view their own businesses" ON businesses
  FOR SELECT TO authenticated
  USING (owner_user_id = auth.uid());

CREATE POLICY "Managers can view assigned businesses" ON businesses
  FOR SELECT TO authenticated
  USING (
    id IN (SELECT business_id FROM business_managers WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert their businesses" ON businesses
  FOR INSERT WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Users can update their businesses" ON businesses
  FOR UPDATE USING (owner_user_id = auth.uid());

-- RLS Policies for Business Managers
CREATE POLICY "Users can view their own manager membership" ON business_managers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Owners can view all managers of their business" ON business_managers
  FOR SELECT TO authenticated
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid())
  );

CREATE POLICY "Only owners can modify team" ON business_managers
  FOR ALL TO authenticated
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid())
  )
  WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid())
  );

-- RLS Policies for Listings
CREATE POLICY "Anyone can view published listings" ON listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Team can manage listings" ON listings
  FOR ALL TO authenticated
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_user_id = auth.uid()
      UNION
      SELECT business_id FROM business_managers WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_listings_business ON listings(business_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_business_managers_user ON business_managers(user_id);

-- Function to create user record on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, photo_url, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'photo_url',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'traveller')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert business_managers for imported businesses (owner role)
INSERT INTO business_managers (business_id, user_id, role)
SELECT id, owner_user_id, 'owner'
FROM businesses
ON CONFLICT (business_id, user_id) DO NOTHING;

-- ==========================================
-- FLIGHT FARE INTELLIGENCE ENGINE (PHASE 1)
-- ==========================================

-- FareTrend Enum
CREATE TYPE fare_trend AS ENUM ('UP', 'DOWN', 'STABLE');

-- Routes Table (Flight Intelligence)
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_airport TEXT NOT NULL,
  destination_airport TEXT NOT NULL,
  UNIQUE(source_airport, destination_airport)
);

-- Fare Snapshots Table (Time-Series Data)
CREATE TABLE IF NOT EXISTS fare_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  departure_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ,
  price NUMERIC(10, 2) NOT NULL,
  provider TEXT DEFAULT 'amadeus',
  trend fare_trend DEFAULT 'STABLE',
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for Flight Intelligence
CREATE INDEX IF NOT EXISTS idx_fare_snapshots_route ON fare_snapshots(route_id);
CREATE INDEX IF NOT EXISTS idx_fare_snapshots_departure ON fare_snapshots(departure_date);
CREATE INDEX IF NOT EXISTS idx_fare_snapshots_fetched ON fare_snapshots(fetched_at);

-- Enable RLS
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fare_snapshots ENABLE ROW LEVEL SECURITY;

-- Analytics data is globally readable for authenticated users
CREATE POLICY "Authenticated users can view routes" ON routes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view fare snapshots" ON fare_snapshots
  FOR SELECT TO authenticated USING (true);
