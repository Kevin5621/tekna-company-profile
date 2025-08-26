-- Seed data for simple partners system
-- Description: Simple partner data with logo, name and description
-- Created: 2025-08-26

-- Insert sample partners
INSERT INTO partners (
    name, logo_url, description, website, sort_order, is_active
) VALUES
(
    'TechCorp Solutions',
    '/logo.webp',
    'Leading technology solutions provider specializing in enterprise software development',
    'https://techcorp.example.com',
    1,
    true
),
(
    'InnovateTech',
    '/logo.webp',
    'Innovation-driven software company focused on cutting-edge technologies',
    'https://innovatetech.example.com',
    2,
    true
),
(
    'Global Manufacturing',
    '/logo.webp',
    'International manufacturing leader with expertise in industrial automation',
    'https://globalmanufacturing.example.com',
    3,
    true
),
(
    'Digital Dynamics',
    '/logo.webp',
    'Digital transformation experts helping businesses modernize operations',
    'https://digitaldynamics.example.com',
    4,
    true
),
(
    'Cloud Systems',
    '/logo.webp',
    'Cloud infrastructure specialists providing scalable and secure solutions',
    'https://cloudsystems.example.com',
    5,
    true
),
(
    'Smart Solutions',
    '/logo.webp',
    'AI-powered business solutions for process automation and data insights',
    'https://smartsolutions.example.com',
    6,
    true
);
