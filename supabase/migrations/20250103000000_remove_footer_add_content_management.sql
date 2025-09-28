-- Migration: Remove Footer System and Add Content Management
-- Description: Remove footer database tables and add new content management tables
-- Created: 2025-01-02

-- =====================================================
-- DROP FOOTER TABLES
-- =====================================================

-- Drop footer related tables
DROP TABLE IF EXISTS footer_section_translations CASCADE;
DROP TABLE IF EXISTS footer_link_translations CASCADE;
DROP TABLE IF EXISTS footer_links CASCADE;
DROP TABLE IF EXISTS footer_sections CASCADE;
DROP TABLE IF EXISTS social_media CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS contact_info_translations CASCADE;
DROP TABLE IF EXISTS newsletter_settings CASCADE;
DROP TABLE IF EXISTS newsletter_settings_translations CASCADE;

-- =====================================================
-- CONTENT MANAGEMENT TABLES
-- =====================================================

-- About Us content table
CREATE TABLE about_us (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    email VARCHAR(255),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    github_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRANSLATIONS FOR CONTENT MANAGEMENT
-- =====================================================

-- About Us translations
CREATE TABLE about_us_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_us_id UUID NOT NULL REFERENCES about_us(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(about_us_id, language_id)
);

-- FAQ translations
CREATE TABLE faq_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faq_id UUID NOT NULL REFERENCES faqs(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(faq_id, language_id)
);

-- Team member translations
CREATE TABLE team_member_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_member_id, language_id)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_translations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ POLICIES
-- =====================================================

-- About Us: Public read access
CREATE POLICY "About us content is viewable by everyone" ON about_us
    FOR SELECT USING (is_active = true);

-- FAQs: Public read access
CREATE POLICY "FAQs are viewable by everyone" ON faqs
    FOR SELECT USING (is_active = true);

-- Team members: Public read access
CREATE POLICY "Team members are viewable by everyone" ON team_members
    FOR SELECT USING (is_active = true);

-- About Us translations: Public read access
CREATE POLICY "About us translations are viewable by everyone" ON about_us_translations
    FOR SELECT USING (true);

-- FAQ translations: Public read access
CREATE POLICY "FAQ translations are viewable by everyone" ON faq_translations
    FOR SELECT USING (true);

-- Team member translations: Public read access
CREATE POLICY "Team member translations are viewable by everyone" ON team_member_translations
    FOR SELECT USING (true);

-- =====================================================
-- ADMIN MANAGEMENT POLICIES
-- =====================================================

-- Admins can manage about us
CREATE POLICY "Admins can manage about us" ON about_us
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Admins can manage FAQs
CREATE POLICY "Admins can manage FAQs" ON faqs
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Admins can manage team members
CREATE POLICY "Admins can manage team members" ON team_members
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Admins can manage about us translations
CREATE POLICY "Admins can manage about us translations" ON about_us_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Admins can manage FAQ translations
CREATE POLICY "Admins can manage FAQ translations" ON faq_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Admins can manage team member translations
CREATE POLICY "Admins can manage team member translations" ON team_member_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_about_us_sort_order ON about_us(sort_order);
CREATE INDEX idx_about_us_slug ON about_us(slug);
CREATE INDEX idx_faqs_sort_order ON faqs(sort_order);
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_team_members_sort_order ON team_members(sort_order);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_about_us_updated_at BEFORE UPDATE ON about_us FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_us_translations_updated_at BEFORE UPDATE ON about_us_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_translations_updated_at BEFORE UPDATE ON faq_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_member_translations_updated_at BEFORE UPDATE ON team_member_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
