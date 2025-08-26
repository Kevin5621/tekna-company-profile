-- Migration: Add Simple Partners System
-- Description: Add simple partners table for logo, title, and description
-- Created: 2025-08-26

-- =====================================================
-- SIMPLE PARTNERS SYSTEM
-- =====================================================

-- Partners table (simplified)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description VARCHAR(500),
    website VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_partners_active ON partners(is_active);
CREATE INDEX idx_partners_sort_order ON partners(sort_order);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Partners policies
CREATE POLICY "Anyone can view active partners" ON partners
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and editors can manage partners" ON partners
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp trigger for partners
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_partners_updated_at();
