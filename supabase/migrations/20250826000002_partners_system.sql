-- Migration: Add Simple Partners System
-- Description: Add simple partners table for logo, title, and description
-- Created: 2025-08-26

-- =====================================================
-- SIMPLE PARTNERS SYSTEM
-- =====================================================

-- Partners table (simplified)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- simplified: keep only logo (image) and timestamps
    logo_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- indexes removed: partners now only stores logos and timestamps

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Partners policies: allow anyone to select logos, management restricted
CREATE POLICY "Anyone can view partners (logos)" ON partners
    FOR SELECT USING (true);

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
