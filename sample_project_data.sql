-- Sample data for testing project details functionality
-- Run this to insert some sample projects

-- First, let's ensure we have languages
INSERT INTO languages (id, name, code, is_default, is_active) VALUES
  ('00000000-0000-0000-0000-000000000001', 'English', 'en', true, true),
  ('00000000-0000-0000-0000-000000000002', 'Indonesian', 'id', false, true)
ON CONFLICT (code) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, slug, description, featured_image_url, is_featured, is_active, sort_order) VALUES
  (
    '10000000-0000-0000-0000-000000000001', 
    'E-Commerce Platform', 
    'e-commerce-platform',
    'A modern e-commerce platform built with Next.js and React. Features include product catalog, shopping cart, payment integration, and admin dashboard.',
    '/images/projects/ecommerce-platform.jpg',
    true,
    true,
    1
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'IoT Monitoring Dashboard',
    'iot-monitoring-dashboard', 
    'Real-time IoT device monitoring dashboard with data visualization, alerts, and device management capabilities.',
    '/images/projects/iot-dashboard.jpg',
    true,
    true,
    2
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Mobile Banking App',
    'mobile-banking-app',
    'Secure mobile banking application with biometric authentication, transaction history, and real-time notifications.',
    '/images/projects/mobile-banking.jpg',
    false,
    true,
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  featured_image_url = EXCLUDED.featured_image_url,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

-- Insert translations for the projects
INSERT INTO project_translations (id, project_id, language_id, description, short_description, meta_title, meta_description) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'A comprehensive e-commerce platform designed for modern businesses. Built using cutting-edge technologies including Next.js, React, and TypeScript. Features a responsive design, advanced product filtering, secure payment processing, and an intuitive admin dashboard for inventory management.',
    'Modern e-commerce platform with advanced features and secure payment processing.',
    'E-Commerce Platform - Modern Online Store Solution',
    'Discover our cutting-edge e-commerce platform built with Next.js and React. Perfect for businesses looking to establish a strong online presence.'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'An advanced IoT monitoring solution that provides real-time insights into device performance and environmental data. Features include customizable dashboards, automated alerts, data analytics, and comprehensive reporting tools for better decision making.',
    'Real-time IoT monitoring with advanced analytics and customizable dashboards.',
    'IoT Monitoring Dashboard - Real-time Device Analytics',
    'Monitor your IoT devices in real-time with our advanced dashboard featuring analytics, alerts, and comprehensive reporting.'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'A secure and user-friendly mobile banking application that puts financial control in your customers hands. Features biometric authentication, real-time transaction monitoring, budget tracking, and seamless money transfers.',
    'Secure mobile banking with biometric authentication and real-time features.',
    'Mobile Banking App - Secure Financial Management',
    'Experience secure mobile banking with biometric authentication, real-time transactions, and comprehensive financial management tools.'
  )
ON CONFLICT (project_id, language_id) DO UPDATE SET
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();

-- Insert some sample images for the projects
INSERT INTO project_images (id, project_id, image_url, alt_text, caption, sort_order) VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '/images/projects/ecommerce-home.jpg',
    'E-commerce platform homepage',
    'Homepage with featured products and promotions',
    1
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '/images/projects/ecommerce-product.jpg',
    'Product detail page',
    'Detailed product view with specifications',
    2
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    '/images/projects/iot-dashboard-main.jpg',
    'IoT dashboard main view',
    'Main dashboard showing device status and analytics',
    1
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000003',
    '/images/projects/banking-app-login.jpg',
    'Banking app login screen',
    'Secure biometric login interface',
    1
  )
ON CONFLICT (id) DO NOTHING;