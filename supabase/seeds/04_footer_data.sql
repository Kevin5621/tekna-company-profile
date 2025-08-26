-- Seed data for footer and contact information
-- This file contains initial data for footer sections, links, social media, and contact info

-- Insert default language if not exists
INSERT INTO languages (code, name, is_default, is_active) 
VALUES ('id', 'Indonesian', true, true)
ON CONFLICT (code) DO NOTHING;

-- Main seeding block
DO $$
DECLARE
    lang_id UUID;
    tek_company_id UUID;
    services_section_id UUID;
    company_section_id UUID;
    support_section_id UUID;
    newsletter_id UUID;
BEGIN
    -- Get Indonesian language ID
    SELECT l.id INTO lang_id FROM languages l WHERE l.code = 'id' LIMIT 1;
    
    -- Insert default company if not exists
    INSERT INTO companies (name, slug, email, phone, address, website, industry, is_active)
    VALUES (
        'Tekna',
        'tekna',
        'hello@tekna.co.id',
        '+62 21 1234 5678',
        'Jl. Sudirman No. 123, Jakarta Pusat 10250, Indonesia',
        'www.tekna.co.id',
        'Technology',
        true
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        website = EXCLUDED.website,
        industry = EXCLUDED.industry
    RETURNING id INTO tek_company_id;
    
    -- If company already exists, get its ID
    IF tek_company_id IS NULL THEN
        SELECT c.id INTO tek_company_id FROM companies c WHERE c.slug = 'tekna' LIMIT 1;
    END IF;
    
    -- Insert company translation
    INSERT INTO company_translations (company_id, language_id, description, mission, vision, short_description)
    VALUES (
        tek_company_id,
        lang_id,
        'Kami adalah partner teknologi terpercaya yang membantu bisnis berkembang melalui solusi digital inovatif dan berkualitas tinggi.',
        'Memberikan solusi teknologi terbaik untuk membantu bisnis berkembang dan berinovasi.',
        'Menjadi perusahaan teknologi terdepan yang menciptakan dampak positif melalui inovasi digital.',
        'Partner teknologi terpercaya untuk solusi digital inovatif.'
    )
    ON CONFLICT (company_id, language_id) DO UPDATE SET
        description = EXCLUDED.description,
        mission = EXCLUDED.mission,
        vision = EXCLUDED.vision,
        short_description = EXCLUDED.short_description;

    -- Insert footer sections
    INSERT INTO footer_sections (name, slug, sort_order, is_active) 
    SELECT 'Layanan Kami', 'services', 1, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_sections WHERE slug = 'services');
    
    INSERT INTO footer_sections (name, slug, sort_order, is_active) 
    SELECT 'Perusahaan', 'company', 2, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_sections WHERE slug = 'company');
    
    INSERT INTO footer_sections (name, slug, sort_order, is_active) 
    SELECT 'Bantuan', 'support', 3, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_sections WHERE slug = 'support');
    
    -- Get section IDs
    SELECT fs.id INTO services_section_id FROM footer_sections fs WHERE fs.slug = 'services' LIMIT 1;
    SELECT fs.id INTO company_section_id FROM footer_sections fs WHERE fs.slug = 'company' LIMIT 1;
    SELECT fs.id INTO support_section_id FROM footer_sections fs WHERE fs.slug = 'support' LIMIT 1;

    -- Insert footer links for Services
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT services_section_id, 'Web Development', '/services/web-development', 'Globe', false, 1, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = services_section_id AND url = '/services/web-development');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT services_section_id, 'Mobile Apps', '/services/mobile-apps', 'Smartphone', false, 2, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = services_section_id AND url = '/services/mobile-apps');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT services_section_id, 'IoT Solutions', '/services/iot-solutions', 'Cpu', false, 3, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = services_section_id AND url = '/services/iot-solutions');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT services_section_id, 'UI/UX Design', '/services/ui-ux-design', 'Palette', false, 4, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = services_section_id AND url = '/services/ui-ux-design');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT services_section_id, 'Cloud Services', '/services/cloud-services', 'Cloud', false, 5, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = services_section_id AND url = '/services/cloud-services');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT services_section_id, 'Digital Marketing', '/services/digital-marketing', 'TrendingUp', false, 6, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = services_section_id AND url = '/services/digital-marketing');

    -- Insert footer links for Company
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT company_section_id, 'Tentang Kami', '/about', 'Info', false, 1, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = company_section_id AND url = '/about');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT company_section_id, 'Tim Kami', '/team', 'Users', false, 2, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = company_section_id AND url = '/team');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT company_section_id, 'Karir', '/careers', 'Briefcase', false, 3, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = company_section_id AND url = '/careers');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT company_section_id, 'Blog', '/blog', 'FileText', false, 4, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = company_section_id AND url = '/blog');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT company_section_id, 'Portfolio', '/portfolio', 'FolderOpen', false, 5, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = company_section_id AND url = '/portfolio');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT company_section_id, 'Testimonial', '/testimonials', 'MessageSquare', false, 6, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = company_section_id AND url = '/testimonials');

    -- Insert footer links for Support
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT support_section_id, 'Hubungi Kami', '/contact', 'Mail', false, 1, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = support_section_id AND url = '/contact');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT support_section_id, 'FAQ', '/faq', 'HelpCircle', false, 2, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = support_section_id AND url = '/faq');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT support_section_id, 'Dokumentasi', '/documentation', 'Book', false, 3, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = support_section_id AND url = '/documentation');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT support_section_id, 'Status Layanan', '/status', 'Activity', false, 4, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = support_section_id AND url = '/status');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT support_section_id, 'Kebijakan Privasi', '/privacy', 'Shield', false, 5, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = support_section_id AND url = '/privacy');
    
    INSERT INTO footer_links (footer_section_id, title, url, icon, is_external, sort_order, is_active)
    SELECT support_section_id, 'Syarat & Ketentuan', '/terms', 'FileCheck', false, 6, true
    WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE footer_section_id = support_section_id AND url = '/terms');

    -- Insert social media links
    INSERT INTO social_media (platform, icon, url, color, sort_order, is_active)
    SELECT 'Facebook', 'Facebook', 'https://facebook.com/tekna', '#1877F2', 1, true
    WHERE NOT EXISTS (SELECT 1 FROM social_media WHERE platform = 'Facebook');
    
    INSERT INTO social_media (platform, icon, url, color, sort_order, is_active)
    SELECT 'Twitter', 'Twitter', 'https://twitter.com/tekna', '#1DA1F2', 2, true
    WHERE NOT EXISTS (SELECT 1 FROM social_media WHERE platform = 'Twitter');
    
    INSERT INTO social_media (platform, icon, url, color, sort_order, is_active)
    SELECT 'Instagram', 'Instagram', 'https://instagram.com/tekna', '#E4405F', 3, true
    WHERE NOT EXISTS (SELECT 1 FROM social_media WHERE platform = 'Instagram');
    
    INSERT INTO social_media (platform, icon, url, color, sort_order, is_active)
    SELECT 'LinkedIn', 'Linkedin', 'https://linkedin.com/company/tekna', '#0A66C2', 4, true
    WHERE NOT EXISTS (SELECT 1 FROM social_media WHERE platform = 'LinkedIn');
    
    INSERT INTO social_media (platform, icon, url, color, sort_order, is_active)
    SELECT 'YouTube', 'Youtube', 'https://youtube.com/@tekna', '#FF0000', 5, true
    WHERE NOT EXISTS (SELECT 1 FROM social_media WHERE platform = 'YouTube');

    -- Insert contact information
    INSERT INTO contact_info (company_id, type, icon, label, value, href, sort_order, is_active)
    SELECT tek_company_id, 'address', 'MapPin', 'Kantor Pusat', 'Jl. Sudirman No. 123, Jakarta Pusat 10250, Indonesia', null, 1, true
    WHERE NOT EXISTS (SELECT 1 FROM contact_info WHERE company_id = tek_company_id AND type = 'address');
    
    INSERT INTO contact_info (company_id, type, icon, label, value, href, sort_order, is_active)
    SELECT tek_company_id, 'phone', 'Phone', 'Telepon', '+62 21 1234 5678', 'tel:+622112345678', 2, true
    WHERE NOT EXISTS (SELECT 1 FROM contact_info WHERE company_id = tek_company_id AND type = 'phone');
    
    INSERT INTO contact_info (company_id, type, icon, label, value, href, sort_order, is_active)
    SELECT tek_company_id, 'email', 'Mail', 'Email', 'hello@tekna.co.id', 'mailto:hello@tekna.co.id', 3, true
    WHERE NOT EXISTS (SELECT 1 FROM contact_info WHERE company_id = tek_company_id AND type = 'email');
    
    INSERT INTO contact_info (company_id, type, icon, label, value, href, sort_order, is_active)
    SELECT tek_company_id, 'website', 'Globe', 'Website', 'www.tekna.co.id', 'https://tekna.co.id', 4, true
    WHERE NOT EXISTS (SELECT 1 FROM contact_info WHERE company_id = tek_company_id AND type = 'website');

    -- Insert newsletter settings (assuming single row table)
    INSERT INTO newsletter_settings (title, description, success_message, button_text, placeholder_text, is_active) 
    SELECT 'Newsletter', 'Dapatkan update terbaru tentang teknologi dan tips bisnis.', 'Terima kasih! Anda telah berlangganan newsletter kami.', 'Subscribe', 'Email Anda', true
    WHERE NOT EXISTS (SELECT 1 FROM newsletter_settings);
    
    -- Get newsletter settings ID
    SELECT ns.id INTO newsletter_id FROM newsletter_settings ns LIMIT 1;

    -- Insert newsletter settings translation
    INSERT INTO newsletter_settings_translations (newsletter_settings_id, language_id, title, description, success_message, button_text, placeholder_text)
    SELECT newsletter_id, lang_id, 'Newsletter', 'Dapatkan update terbaru tentang teknologi dan tips bisnis.', '✓ Terima kasih! Anda telah berlangganan newsletter kami.', 'Subscribe', 'Email Anda'
    WHERE NOT EXISTS (SELECT 1 FROM newsletter_settings_translations WHERE newsletter_settings_id = newsletter_id AND language_id = lang_id);

END $$;