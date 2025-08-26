-- Migration: Footer and Contact Settings
-- Description: Add tables for footer content, social media links, and contact information
-- Created: 2025-08-25

-- =====================================================
-- FOOTER AND CONTACT SETTINGS
-- =====================================================

-- Footer sections table (for organizing footer links)
CREATE TABLE footer_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer links table
CREATE TABLE footer_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    footer_section_id UUID NOT NULL REFERENCES footer_sections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    icon VARCHAR(50), -- lucide icon name
    is_external BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media links table
CREATE TABLE social_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL, -- facebook, twitter, instagram, linkedin, youtube, etc
    icon VARCHAR(50) NOT NULL, -- lucide icon name
    url VARCHAR(500) NOT NULL,
    color VARCHAR(7), -- hex color for hover effect
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact information table (extends company table)
CREATE TABLE contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- phone, email, address, website, etc
    icon VARCHAR(50) NOT NULL, -- lucide icon name
    label VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    href VARCHAR(500), -- for clickable contacts (mailto:, tel:, etc)
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, type)
);

-- Newsletter settings table
CREATE TABLE newsletter_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL DEFAULT 'Newsletter',
    description TEXT,
    success_message VARCHAR(500) DEFAULT 'Terima kasih! Anda telah berlangganan newsletter kami.',
    button_text VARCHAR(100) DEFAULT 'Subscribe',
    placeholder_text VARCHAR(255) DEFAULT 'Email Anda',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRANSLATIONS FOR FOOTER CONTENT
-- =====================================================

-- Footer section translations
CREATE TABLE footer_section_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    footer_section_id UUID NOT NULL REFERENCES footer_sections(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(footer_section_id, language_id)
);

-- Footer link translations
CREATE TABLE footer_link_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    footer_link_id UUID NOT NULL REFERENCES footer_links(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(footer_link_id, language_id)
);

-- Contact info translations
CREATE TABLE contact_info_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_info_id UUID NOT NULL REFERENCES contact_info(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contact_info_id, language_id)
);

-- Newsletter settings translations
CREATE TABLE newsletter_settings_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    newsletter_settings_id UUID NOT NULL REFERENCES newsletter_settings(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    success_message VARCHAR(500),
    button_text VARCHAR(100),
    placeholder_text VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(newsletter_settings_id, language_id)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE footer_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_section_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_link_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_settings_translations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ POLICIES
-- =====================================================

-- Footer sections: Public read access
CREATE POLICY "Footer sections are viewable by everyone" ON footer_sections
    FOR SELECT USING (is_active = true);

-- Footer links: Public read access
CREATE POLICY "Footer links are viewable by everyone" ON footer_links
    FOR SELECT USING (is_active = true);

-- Social media: Public read access
CREATE POLICY "Social media links are viewable by everyone" ON social_media
    FOR SELECT USING (is_active = true);

-- Contact info: Public read access
CREATE POLICY "Contact info is viewable by everyone" ON contact_info
    FOR SELECT USING (is_active = true);

-- Newsletter settings: Public read access
CREATE POLICY "Newsletter settings are viewable by everyone" ON newsletter_settings
    FOR SELECT USING (is_active = true);

-- Footer section translations: Public read access
CREATE POLICY "Footer section translations are viewable by everyone" ON footer_section_translations
    FOR SELECT USING (true);

-- Footer link translations: Public read access
CREATE POLICY "Footer link translations are viewable by everyone" ON footer_link_translations
    FOR SELECT USING (true);

-- Contact info translations: Public read access
CREATE POLICY "Contact info translations are viewable by everyone" ON contact_info_translations
    FOR SELECT USING (true);

-- Newsletter settings translations: Public read access
CREATE POLICY "Newsletter settings translations are viewable by everyone" ON newsletter_settings_translations
    FOR SELECT USING (true);

-- =====================================================
-- ADMIN MANAGEMENT POLICIES
-- =====================================================

-- Admins can manage footer sections
CREATE POLICY "Admins can manage footer sections" ON footer_sections
    FOR ALL USING (auth.role() = 'authenticated');

-- Admins can manage footer links
CREATE POLICY "Admins can manage footer links" ON footer_links
    FOR ALL USING (auth.role() = 'authenticated');

-- Admins can manage social media
CREATE POLICY "Admins can manage social media" ON social_media
    FOR ALL USING (auth.role() = 'authenticated');

-- Admins can manage contact info
CREATE POLICY "Admins can manage contact info" ON contact_info
    FOR ALL USING (auth.role() = 'authenticated');

-- Admins can manage newsletter settings
CREATE POLICY "Admins can manage newsletter settings" ON newsletter_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Admins can manage footer section translations
CREATE POLICY "Admins can manage footer section translations" ON footer_section_translations
    FOR ALL USING (auth.role() = 'authenticated');

-- Admins can manage footer link translations
CREATE POLICY "Admins can manage footer link translations" ON footer_link_translations
    FOR ALL USING (auth.role() = 'authenticated');

-- Admins can manage contact info translations
CREATE POLICY "Admins can manage contact info translations" ON contact_info_translations
    FOR ALL USING (auth.role() = 'authenticated');

-- Admins can manage newsletter settings translations
CREATE POLICY "Admins can manage newsletter settings translations" ON newsletter_settings_translations
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_footer_sections_sort_order ON footer_sections(sort_order);
CREATE INDEX idx_footer_links_section_id ON footer_links(footer_section_id);
CREATE INDEX idx_footer_links_sort_order ON footer_links(sort_order);
CREATE INDEX idx_social_media_sort_order ON social_media(sort_order);
CREATE INDEX idx_contact_info_company_id ON contact_info(company_id);
CREATE INDEX idx_contact_info_sort_order ON contact_info(sort_order);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_footer_sections_updated_at BEFORE UPDATE ON footer_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_links_updated_at BEFORE UPDATE ON footer_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_media_updated_at BEFORE UPDATE ON social_media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_settings_updated_at BEFORE UPDATE ON newsletter_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_section_translations_updated_at BEFORE UPDATE ON footer_section_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_link_translations_updated_at BEFORE UPDATE ON footer_link_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_info_translations_updated_at BEFORE UPDATE ON contact_info_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_settings_translations_updated_at BEFORE UPDATE ON newsletter_settings_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
