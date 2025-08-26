-- Career tables migration with simplified RLS policies
-- Created: 2025-08-25

-- Create career_categories table
CREATE TABLE career_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text, -- lucide-react icon name
  color text, -- hex color or tailwind class
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_locations table
CREATE TABLE career_locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  address text,
  city text NOT NULL,
  state text,
  country text NOT NULL DEFAULT 'Indonesia',
  timezone text DEFAULT 'Asia/Jakarta',
  is_remote boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_types table
CREATE TABLE career_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL, -- Full-time, Part-time, Contract, Internship
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_levels table
CREATE TABLE career_levels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL, -- Entry Level, Mid Level, Senior Level, Executive
  slug text NOT NULL UNIQUE,
  description text,
  years_min integer DEFAULT 0,
  years_max integer,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_positions table (main job postings)
CREATE TABLE career_positions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  category_id uuid REFERENCES career_categories(id) ON DELETE SET NULL,
  location_id uuid REFERENCES career_locations(id) ON DELETE SET NULL,
  type_id uuid REFERENCES career_types(id) ON DELETE SET NULL,
  level_id uuid REFERENCES career_levels(id) ON DELETE SET NULL,
  
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text, -- Brief job summary
  description text NOT NULL, -- Full job description (markdown)
  requirements text, -- Job requirements (markdown)
  benefits text, -- Benefits and perks (markdown)
  
  salary_min bigint, -- Salary range minimum
  salary_max bigint, -- Salary range maximum
  salary_currency text DEFAULT 'IDR',
  salary_type text DEFAULT 'monthly', -- monthly, yearly, hourly
  
  application_deadline timestamptz,
  start_date timestamptz,
  
  remote_allowed boolean DEFAULT false,
  travel_required boolean DEFAULT false,
  travel_percentage integer DEFAULT 0,
  
  featured boolean DEFAULT false,
  urgent boolean DEFAULT false,
  status text DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closed', 'filled')),
  
  views_count integer DEFAULT 0,
  applications_count integer DEFAULT 0,
  
  seo_title text,
  seo_description text,
  seo_keywords text,
  
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  is_active boolean DEFAULT true,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_skills table (for skill requirements)
CREATE TABLE career_skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  category text, -- technical, soft, language, certification
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create junction table for position skills
CREATE TABLE career_position_skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id uuid REFERENCES career_positions(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES career_skills(id) ON DELETE CASCADE,
  level text DEFAULT 'required' CHECK (level IN ('required', 'preferred', 'nice-to-have')),
  proficiency text CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(position_id, skill_id)
);

-- Create career_applications table
CREATE TABLE career_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id uuid REFERENCES career_positions(id) ON DELETE CASCADE,
  
  -- Applicant information
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  linkedin_url text,
  portfolio_url text,
  github_url text,
  
  -- Application details
  cover_letter text,
  resume_url text, -- URL to stored resume file
  additional_documents jsonb, -- array of document URLs
  
  -- Application status
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'interview_scheduled', 'interview_completed', 'offered', 'accepted', 'rejected', 'withdrawn')),
  notes text, -- Internal notes
  
  -- Metadata
  source text, -- where the application came from
  applied_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_application_activities table (for tracking application progress)
CREATE TABLE career_application_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES career_applications(id) ON DELETE CASCADE,
  
  activity_type text NOT NULL, -- status_change, note_added, interview_scheduled, etc.
  old_status text,
  new_status text,
  description text,
  notes text,
  
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_career_positions_company_id ON career_positions(company_id);
CREATE INDEX idx_career_positions_category_id ON career_positions(category_id);
CREATE INDEX idx_career_positions_location_id ON career_positions(location_id);
CREATE INDEX idx_career_positions_type_id ON career_positions(type_id);
CREATE INDEX idx_career_positions_level_id ON career_positions(level_id);
CREATE INDEX idx_career_positions_status ON career_positions(status);
CREATE INDEX idx_career_positions_featured ON career_positions(featured);
CREATE INDEX idx_career_positions_published_at ON career_positions(published_at);
CREATE INDEX idx_career_positions_slug ON career_positions(slug);

CREATE INDEX idx_career_applications_position_id ON career_applications(position_id);
CREATE INDEX idx_career_applications_status ON career_applications(status);
CREATE INDEX idx_career_applications_email ON career_applications(email);
CREATE INDEX idx_career_applications_applied_at ON career_applications(applied_at);

CREATE INDEX idx_career_position_skills_position_id ON career_position_skills(position_id);
CREATE INDEX idx_career_position_skills_skill_id ON career_position_skills(skill_id);

-- Create updated_at triggers
CREATE TRIGGER update_career_categories_updated_at
  BEFORE UPDATE ON career_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_locations_updated_at
  BEFORE UPDATE ON career_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_types_updated_at
  BEFORE UPDATE ON career_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_levels_updated_at
  BEFORE UPDATE ON career_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_positions_updated_at
  BEFORE UPDATE ON career_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_skills_updated_at
  BEFORE UPDATE ON career_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_applications_updated_at
  BEFORE UPDATE ON career_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Functions for view counting
CREATE OR REPLACE FUNCTION increment_position_views(position_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE career_positions 
  SET views_count = views_count + 1 
  WHERE id = position_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update application count
CREATE OR REPLACE FUNCTION public.increment_applications_count()
RETURNS TRIGGER AS $BODY$
BEGIN
  UPDATE public.career_positions
  SET applications_count = applications_count + 1
  WHERE id = NEW.position_id;
  RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update applications count when new application is created
CREATE TRIGGER on_application_created_increment_count
  AFTER INSERT ON public.career_applications
  FOR EACH ROW EXECUTE FUNCTION public.increment_applications_count();

-- Simplified RLS Policies (not too strict)
-- Enable RLS on all career tables
ALTER TABLE career_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_position_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_application_activities ENABLE ROW LEVEL SECURITY;

-- Simple policies: Allow public read access, authenticated users can insert applications
-- Career Categories - Public read, admin write
CREATE POLICY "Career categories public read" ON career_categories FOR SELECT USING (true);
CREATE POLICY "Career categories admin write" ON career_categories FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Career Locations - Public read, admin write
CREATE POLICY "Career locations public read" ON career_locations FOR SELECT USING (true);
CREATE POLICY "Career locations admin write" ON career_locations FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Career Types - Public read, admin write
CREATE POLICY "Career types public read" ON career_types FOR SELECT USING (true);
CREATE POLICY "Career types admin write" ON career_types FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Career Levels - Public read, admin write
CREATE POLICY "Career levels public read" ON career_levels FOR SELECT USING (true);
CREATE POLICY "Career levels admin write" ON career_levels FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Career Positions - Public read published, admin write
CREATE POLICY "Career positions public read" ON career_positions FOR SELECT USING (
  is_active = true AND status = 'open' AND published_at IS NOT NULL
);
CREATE POLICY "Career positions admin write" ON career_positions FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Career Skills - Public read, admin write
CREATE POLICY "Career skills public read" ON career_skills FOR SELECT USING (true);
CREATE POLICY "Career skills admin write" ON career_skills FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Career Position Skills - Public read, admin write
CREATE POLICY "Career position skills public read" ON career_position_skills FOR SELECT USING (true);
CREATE POLICY "Career position skills admin write" ON career_position_skills FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Career Applications - Anyone can submit, admin can manage
CREATE POLICY "Career applications public insert" ON career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Career applications public read" ON career_applications FOR SELECT USING (true);
CREATE POLICY "Career applications admin manage" ON career_applications FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Career Application Activities - Admin only
CREATE POLICY "Career application activities admin only" ON career_application_activities FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);