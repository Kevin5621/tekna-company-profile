-- Seed data for blog testing
-- This will create some sample blog posts for testing

-- First, let's insert the default language if it doesn't exist
INSERT INTO languages (code, name, is_default, is_active) 
VALUES ('en', 'English', true, true)
ON CONFLICT (code) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, color, is_active, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Technology', 'technology', 'Articles about latest technology trends', '#3B82F6', true, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Web Development', 'web-development', 'Web development tutorials and tips', '#10B981', true, 2),
('550e8400-e29b-41d4-a716-446655440003', 'AI & Machine Learning', 'ai-machine-learning', 'Artificial Intelligence and ML articles', '#8B5CF6', true, 3)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    color = EXCLUDED.color,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- Insert sample posts
INSERT INTO posts (id, title, slug, excerpt, featured_image_url, author_name, category_id, status, published_at, is_featured, view_count, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'The Future of Web Development in 2024', 'future-web-dev-2024', 'Explore the latest trends and technologies that will shape web development in 2024 and beyond.', NULL, 'Jane Smith', '550e8400-e29b-41d4-a716-446655440002', 'published', '2025-08-21 10:00:00+00', true, 125, true),
('550e8400-e29b-41d4-a716-446655440012', 'How AI is Transforming Business Operations', 'ai-business-operations', 'Discover how artificial intelligence is revolutionizing the way businesses operate and make decisions.', NULL, 'John Doe', '550e8400-e29b-41d4-a716-446655440003', 'published', '2025-08-20 14:30:00+00', false, 89, true),
('550e8400-e29b-41d4-a716-446655440013', 'Building Scalable Web Applications', 'scalable-web-apps', 'Learn the best practices for building web applications that can handle growth and increased traffic.', NULL, 'Mike Johnson', '550e8400-e29b-41d4-a716-446655440002', 'published', '2025-08-19 09:15:00+00', false, 67, true)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    featured_image_url = EXCLUDED.featured_image_url,
    author_name = EXCLUDED.author_name,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    published_at = EXCLUDED.published_at,
    is_featured = EXCLUDED.is_featured,
    view_count = EXCLUDED.view_count,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Get the language ID for English
DO $$
DECLARE
    english_lang_id UUID;
BEGIN
    SELECT id INTO english_lang_id FROM languages WHERE code = 'en';
    
    -- Insert sample post translations
    INSERT INTO post_translations (post_id, language_id, title, content, excerpt, meta_title, meta_description, meta_keywords) VALUES
    ('550e8400-e29b-41d4-a716-446655440011', english_lang_id, 'The Future of Web Development in 2024', 
     '<h2>Introduction</h2><p>Web development is evolving at an unprecedented pace. As we move through 2024, new technologies and methodologies are reshaping how we build and deploy web applications.</p><h2>Key Trends</h2><p>Some of the most significant trends include:</p><ul><li>Server-side rendering with frameworks like Next.js</li><li>Edge computing and CDN optimization</li><li>WebAssembly for performance-critical applications</li><li>AI-powered development tools</li></ul><h2>Conclusion</h2><p>The future of web development is bright, with exciting opportunities for developers who stay current with these emerging technologies.</p>', 
     'Explore the latest trends and technologies that will shape web development in 2024 and beyond.', 
    'The Future of Web Development in 2024 | Tekna', 
     'Discover the latest web development trends for 2024, including server-side rendering, edge computing, WebAssembly, and AI-powered development tools.', 
     'web development, 2024 trends, Next.js, edge computing, WebAssembly, AI development'),
    ('550e8400-e29b-41d4-a716-446655440012', english_lang_id, 'How AI is Transforming Business Operations', 
     '<h2>The AI Revolution</h2><p>Artificial Intelligence is no longer a futuristic concept – it''s here, and it''s transforming how businesses operate across all industries.</p><h2>Key Applications</h2><p>AI is being implemented in various business areas:</p><ul><li>Customer service automation</li><li>Predictive analytics for decision making</li><li>Supply chain optimization</li><li>Quality control and monitoring</li></ul><h2>Implementation Strategies</h2><p>Successful AI implementation requires careful planning, proper data management, and employee training to ensure smooth adoption and maximum benefit.</p>', 
     'Discover how artificial intelligence is revolutionizing the way businesses operate and make decisions.', 
    'How AI is Transforming Business Operations | Tekna', 
     'Learn how artificial intelligence is revolutionizing business operations through automation, predictive analytics, and intelligent decision-making systems.', 
     'artificial intelligence, business operations, automation, predictive analytics, AI implementation'),
    ('550e8400-e29b-41d4-a716-446655440013', english_lang_id, 'Building Scalable Web Applications', 
     '<h2>Understanding Scalability</h2><p>Scalability is crucial for modern web applications. As your user base grows, your application must be able to handle increased load without compromising performance.</p><h2>Best Practices</h2><p>Here are key strategies for building scalable applications:</p><ul><li>Microservices architecture</li><li>Database optimization and sharding</li><li>Caching strategies</li><li>Load balancing</li><li>CDN implementation</li></ul><h2>Monitoring and Optimization</h2><p>Continuous monitoring and performance optimization are essential for maintaining scalability as your application grows.</p>', 
     'Learn the best practices for building web applications that can handle growth and increased traffic.', 
    'Building Scalable Web Applications | Tekna', 
     'Master the art of building scalable web applications with microservices, database optimization, caching strategies, and performance monitoring.', 
     'scalable web applications, microservices, database optimization, caching, load balancing, performance')
    ON CONFLICT (post_id, language_id) DO NOTHING;
END $$;
