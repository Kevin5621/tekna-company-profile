-- Migration: Fix Content Management RLS Policies
-- Description: Add proper RLS policies for authenticated users with admin/editor roles
-- Created: 2025-01-03

-- =====================================================
-- DROP EXISTING ADMIN POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage about us" ON about_us;
DROP POLICY IF EXISTS "Admins can manage FAQs" ON faqs;
DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;
DROP POLICY IF EXISTS "Admins can manage about us translations" ON about_us_translations;
DROP POLICY IF EXISTS "Admins can manage FAQ translations" ON faq_translations;
DROP POLICY IF EXISTS "Admins can manage team member translations" ON team_member_translations;

-- =====================================================
-- AUTHENTICATED USER POLICIES
-- =====================================================

-- About Us: Authenticated users with admin/editor roles can manage
CREATE POLICY "Authenticated users can manage about us" ON about_us
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'editor')
            AND ur.is_active = true
        )
    );

-- FAQs: Authenticated users with admin/editor roles can manage
CREATE POLICY "Authenticated users can manage FAQs" ON faqs
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'editor')
            AND ur.is_active = true
        )
    );

-- Team members: Authenticated users with admin/editor roles can manage
CREATE POLICY "Authenticated users can manage team members" ON team_members
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'editor')
            AND ur.is_active = true
        )
    );

-- About Us translations: Authenticated users with admin/editor roles can manage
CREATE POLICY "Authenticated users can manage about us translations" ON about_us_translations
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'editor')
            AND ur.is_active = true
        )
    );

-- FAQ translations: Authenticated users with admin/editor roles can manage
CREATE POLICY "Authenticated users can manage FAQ translations" ON faq_translations
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'editor')
            AND ur.is_active = true
        )
    );

-- Team member translations: Authenticated users with admin/editor roles can manage
CREATE POLICY "Authenticated users can manage team member translations" ON team_member_translations
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'editor')
            AND ur.is_active = true
        )
    );

-- =====================================================
-- ADDITIONAL POLICIES FOR BETTER ACCESS CONTROL
-- =====================================================

-- Allow authenticated users to read all content (including inactive) for management
CREATE POLICY "Authenticated users can read all about us" ON about_us
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all FAQs" ON faqs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all team members" ON team_members
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all about us translations" ON about_us_translations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all FAQ translations" ON faq_translations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all team member translations" ON team_member_translations
    FOR SELECT USING (auth.role() = 'authenticated');
