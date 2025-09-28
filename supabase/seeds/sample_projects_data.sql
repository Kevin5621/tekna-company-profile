-- Sample data seeding for projects feature testing
-- Created: 2025-09-27

-- First ensure we have a default language
INSERT INTO languages (code, name, is_default, is_active) VALUES 
('en', 'English', true, true),
('id', 'Indonesian', false, true)
ON CONFLICT (code) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (
  name,
  slug,
  project_url,
  description,
  featured_image_url,
  is_featured,
  is_active,
  sort_order
) VALUES 
(
  'Smart IoT Dashboard',
  'smart-iot-dashboard',
  'https://iot-dashboard.tekna.co.id',
  'A comprehensive IoT monitoring system that provides real-time data visualization and analytics for industrial applications.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
  true,
  true,
  1
),
(
  'Mobile ERP Application',
  'mobile-erp-application',
  'https://erp-mobile.tekna.co.id',
  'Enterprise Resource Planning mobile application designed for seamless business operations management on the go.',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
  true,
  true,
  2
),
(
  'E-Commerce Platform',
  'e-commerce-platform',
  'https://shop-demo.tekna.co.id',
  'Modern e-commerce platform with advanced features including inventory management, payment integration, and analytics.',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
  true,
  true,
  3
),
(
  'Warehouse Management System',
  'warehouse-management-system',
  null,
  'Advanced warehouse management system with barcode scanning, inventory tracking, and automated reporting capabilities.',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
  false,
  true,
  4
),
(
  'Customer Portal Web App',
  'customer-portal-web-app',
  'https://portal-demo.tekna.co.id',
  'Self-service customer portal enabling users to manage their accounts, view orders, and access support resources.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  false,
  true,
  5
)
ON CONFLICT (slug) DO NOTHING;

-- Get language IDs for translations
DO $$
DECLARE
  en_lang_id UUID;
  id_lang_id UUID;
  project_id UUID;
BEGIN
  -- Get language IDs
  SELECT id INTO en_lang_id FROM languages WHERE code = 'en';
  SELECT id INTO id_lang_id FROM languages WHERE code = 'id';
  
  -- Smart IoT Dashboard translations
  SELECT id INTO project_id FROM projects WHERE slug = 'smart-iot-dashboard';
  IF project_id IS NOT NULL THEN
    INSERT INTO project_translations (project_id, language_id, description, short_description, meta_title, meta_description)
    VALUES (
      project_id,
      en_lang_id,
      'Our Smart IoT Dashboard is a cutting-edge solution that transforms how businesses monitor and manage their connected devices. Built with modern web technologies, this platform provides real-time data visualization, predictive analytics, and automated alerting systems. The dashboard features an intuitive interface that allows users to easily track device performance, monitor environmental conditions, and analyze usage patterns across multiple locations.',
      'Comprehensive IoT monitoring with real-time analytics and visualization',
      'Smart IoT Dashboard - Real-time Monitoring Solution',
      'Advanced IoT dashboard for real-time device monitoring, data visualization, and predictive analytics. Perfect for industrial applications and smart building management.'
    ),
    (
      project_id,
      id_lang_id,
      'Dashboard IoT Cerdas kami adalah solusi canggih yang mengubah cara bisnis memantau dan mengelola perangkat terhubung mereka. Dibangun dengan teknologi web modern, platform ini menyediakan visualisasi data real-time, analitik prediktif, dan sistem peringatan otomatis.',
      'Sistem monitoring IoT komprehensif dengan analitik real-time',
      'Dashboard IoT Cerdas - Solusi Monitoring Real-time',
      'Dashboard IoT canggih untuk monitoring perangkat real-time, visualisasi data, dan analitik prediktif.'
    )
    ON CONFLICT (project_id, language_id) DO NOTHING;
  END IF;

  -- Mobile ERP Application translations
  SELECT id INTO project_id FROM projects WHERE slug = 'mobile-erp-application';
  IF project_id IS NOT NULL THEN
    INSERT INTO project_translations (project_id, language_id, description, short_description, meta_title, meta_description)
    VALUES (
      project_id,
      en_lang_id,
      'This mobile ERP application revolutionizes business operations by bringing enterprise-level functionality to smartphones and tablets. Designed for modern businesses that need flexibility and mobility, the app includes modules for inventory management, sales tracking, financial reporting, and human resources. With offline capabilities and seamless synchronization, teams can work efficiently regardless of connectivity.',
      'Mobile ERP solution for seamless business operations management',
      'Mobile ERP Application - Enterprise Management on Mobile',
      'Comprehensive mobile ERP application for inventory, sales, finance, and HR management. Works offline with seamless synchronization.'
    ),
    (
      project_id,
      id_lang_id,
      'Aplikasi ERP mobile ini merevolusi operasi bisnis dengan menghadirkan fungsionalitas tingkat enterprise ke smartphone dan tablet. Dirancang untuk bisnis modern yang membutuhkan fleksibilitas dan mobilitas.',
      'Solusi ERP mobile untuk manajemen operasi bisnis yang mulus',
      'Aplikasi ERP Mobile - Manajemen Enterprise di Mobile',
      'Aplikasi ERP mobile komprehensif untuk manajemen inventori, penjualan, keuangan, dan SDM.'
    )
    ON CONFLICT (project_id, language_id) DO NOTHING;
  END IF;

  -- E-Commerce Platform translations
  SELECT id INTO project_id FROM projects WHERE slug = 'e-commerce-platform';
  IF project_id IS NOT NULL THEN
    INSERT INTO project_translations (project_id, language_id, description, short_description, meta_title, meta_description)
    VALUES (
      project_id,
      en_lang_id,
      'Our e-commerce platform is a comprehensive solution designed for businesses looking to establish or expand their online presence. Built with scalability in mind, it features advanced inventory management, multiple payment gateways, shipping integrations, and powerful analytics. The platform supports multi-vendor marketplaces, subscription services, and digital product sales.',
      'Modern e-commerce platform with advanced features and analytics',
      'E-Commerce Platform - Complete Online Store Solution',
      'Feature-rich e-commerce platform with inventory management, payment integration, and comprehensive analytics for online businesses.'
    ),
    (
      project_id,
      id_lang_id,
      'Platform e-commerce kami adalah solusi komprehensif untuk bisnis yang ingin membangun atau mengembangkan kehadiran online mereka. Dibangun dengan skalabilitas, platform ini mendukung multi-vendor marketplace dan layanan berlangganan.',
      'Platform e-commerce modern dengan fitur canggih dan analitik',
      'Platform E-Commerce - Solusi Toko Online Lengkap',
      'Platform e-commerce lengkap dengan manajemen inventori, integrasi pembayaran, dan analitik komprehensif.'
    )
    ON CONFLICT (project_id, language_id) DO NOTHING;
  END IF;

END $$;

-- Insert sample project images
DO $$
DECLARE
  project_id UUID;
BEGIN
  -- Smart IoT Dashboard images
  SELECT id INTO project_id FROM projects WHERE slug = 'smart-iot-dashboard';
  IF project_id IS NOT NULL THEN
    INSERT INTO project_images (project_id, image_url, alt_text, caption, sort_order)
    VALUES 
    (project_id, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'Dashboard Overview', 'Main dashboard interface showing real-time data', 1),
    (project_id, 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800', 'Analytics View', 'Advanced analytics and reporting features', 2),
    (project_id, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'Device Management', 'IoT device management interface', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Mobile ERP images
  SELECT id INTO project_id FROM projects WHERE slug = 'mobile-erp-application';
  IF project_id IS NOT NULL THEN
    INSERT INTO project_images (project_id, image_url, alt_text, caption, sort_order)
    VALUES 
    (project_id, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', 'Mobile Dashboard', 'ERP mobile dashboard interface', 1),
    (project_id, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800', 'Inventory Management', 'Mobile inventory tracking features', 2)
    ON CONFLICT DO NOTHING;
  END IF;

  -- E-Commerce Platform images  
  SELECT id INTO project_id FROM projects WHERE slug = 'e-commerce-platform';
  IF project_id IS NOT NULL THEN
    INSERT INTO project_images (project_id, image_url, alt_text, caption, sort_order)
    VALUES 
    (project_id, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', 'Store Front', 'E-commerce storefront design', 1),
    (project_id, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800', 'Admin Panel', 'E-commerce admin dashboard', 2),
    (project_id, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'Analytics Dashboard', 'Sales analytics and reporting', 3)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;