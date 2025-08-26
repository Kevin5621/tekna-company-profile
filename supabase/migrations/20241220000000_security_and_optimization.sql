-- Migration: Security and Optimization

-- User Roles & Profiles

-- Create user roles table (maps Supabase Auth users to roles)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- This will reference Supabase Auth users.id
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user profiles table (extended info for Supabase Auth users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- This will reference Supabase Auth users.id
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies

-- Languages: Public read access
CREATE POLICY "Languages are viewable by everyone" ON languages
    FOR SELECT USING (is_active = true);

-- Companies: Public read access for published content
CREATE POLICY "Companies are viewable by everyone" ON companies
    FOR SELECT USING (is_active = true);

-- Company translations: Public read access
CREATE POLICY "Company translations are viewable by everyone" ON company_translations
    FOR SELECT USING (true);

-- Categories: Public read access
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (is_active = true);

-- Tags: Public read access
CREATE POLICY "Tags are viewable by everyone" ON tags
    FOR SELECT USING (true);

-- Posts: Public read access for published posts only
CREATE POLICY "Published posts are viewable by everyone" ON posts
    FOR SELECT USING (status = 'published' AND is_active = true);

-- Post translations: Public read access for published posts
CREATE POLICY "Post translations are viewable for published posts" ON post_translations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_translations.post_id 
            AND posts.status = 'published' 
            AND posts.is_active = true
        )
    );

-- Post tags: Public read access for published posts
CREATE POLICY "Post tags are viewable for published posts" ON post_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_tags.post_id 
            AND posts.status = 'published' 
            AND posts.is_active = true
        )
    );

-- Projects: Public read access for active projects
CREATE POLICY "Active projects are viewable by everyone" ON projects
    FOR SELECT USING (is_active = true);

-- Project translations: Public read access for active projects
CREATE POLICY "Project translations are viewable for active projects" ON project_translations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_translations.project_id 
            AND projects.is_active = true
        )
    );

-- Project images: Public read access for active projects
CREATE POLICY "Project images are viewable for active projects" ON project_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_images.project_id 
            AND projects.is_active = true
        )
    );

-- Newsletter subscriptions: Public insert only (for signup)
CREATE POLICY "Newsletter subscriptions can be created by anyone" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

-- Admin Access Policies

-- User roles: Users can view their own role, super admins can manage all
CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to view user_roles (needed for auth check)
CREATE POLICY "Authenticated users can view user roles" ON user_roles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Super admins can manage all user roles" ON user_roles
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role = 'super_admin' 
        AND ur.is_active = true
    ));

-- User profiles: Users can view/edit their own profile, super admins can manage all
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to view user_profiles (needed for auth check)
CREATE POLICY "Authenticated users can view user profiles" ON user_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all user profiles" ON user_profiles
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role = 'super_admin' 
        AND ur.is_active = true
    ));

-- Content Management Policies

-- Companies: Only admins can manage
CREATE POLICY "Admins can manage companies" ON companies
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin') 
        AND ur.is_active = true
    ));

-- Languages: Only admins can manage
CREATE POLICY "Admins can manage languages" ON languages
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin') 
        AND ur.is_active = true
    ));

-- Company translations: Only admins can manage
CREATE POLICY "Admins can manage company translations" ON company_translations
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin') 
        AND ur.is_active = true
    ));

-- Categories: Only admins can manage
CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin', 'editor') 
        AND ur.is_active = true
    ));

-- Tags: Only admins can manage
CREATE POLICY "Admins can manage tags" ON tags
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin', 'editor') 
        AND ur.is_active = true
    ));

-- Posts: Admins and editors can manage
CREATE POLICY "Admins and editors can manage posts" ON posts
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin', 'editor') 
        AND ur.is_active = true
    ));

-- Post translations: Admins and editors can manage
CREATE POLICY "Admins and editors can manage post translations" ON post_translations
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin', 'editor') 
        AND ur.is_active = true
    ));

-- Post tags: Admins and editors can manage
CREATE POLICY "Admins and editors can manage post tags" ON post_tags
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin', 'editor') 
        AND ur.is_active = true
    ));

-- Projects: Admins and editors can manage
CREATE POLICY "Admins and editors can manage projects" ON projects
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin', 'editor') 
        AND ur.is_active = true
    ));

-- Project translations: Admins and editors can manage
CREATE POLICY "Admins and editors can manage project translations" ON project_translations
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin', 'editor') 
        AND ur.is_active = true
    ));

-- Project images: Admins and editors can manage
CREATE POLICY "Admins and editors can manage project images" ON project_images
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'admin', 'editor') 
        AND ur.is_active = true
    ));

-- Newsletter subscriptions: Only super admins can view/manage
CREATE POLICY "Super admins can view newsletter subscriptions" ON newsletter_subscriptions
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role = 'super_admin' 
        AND ur.is_active = true
    ));

CREATE POLICY "Super admins can manage newsletter subscriptions" ON newsletter_subscriptions
    FOR ALL USING (EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role = 'super_admin' 
        AND ur.is_active = true
    ));

-- Search & Filtering Functions

-- Full-text search for posts
CREATE INDEX idx_posts_search ON posts USING GIN (
    to_tsvector('english', title || ' ' || COALESCE(excerpt, ''))
);

-- Full-text search for projects
CREATE INDEX idx_projects_search ON projects USING GIN (
    to_tsvector('english', name)
);

-- Full-text search for post translations
CREATE INDEX idx_post_translations_search ON post_translations USING GIN (
    to_tsvector('english', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, ''))
);

-- Full-text search for project translations
CREATE INDEX idx_project_translations_search ON project_translations USING GIN (
    to_tsvector('english', description || ' ' || COALESCE(short_description, ''))
);

-- Pagination Functions

-- Function to get paginated posts with search
CREATE OR REPLACE FUNCTION get_paginated_posts(
    search_query TEXT DEFAULT '',
    category_id UUID DEFAULT NULL,
    status_filter TEXT DEFAULT 'published',
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10,
    language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    author_name TEXT,
    status TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_posts AS (
        SELECT 
            p.id,
            p.title,
            p.excerpt,
            p.featured_image_url,
            p.author_name,
            p.status,
            p.published_at,
            p.is_featured,
            COUNT(*) OVER() as total_count
        FROM posts p
        LEFT JOIN post_translations pt ON p.id = pt.post_id
        LEFT JOIN languages l ON pt.language_id = l.id
        WHERE p.is_active = true
        AND (search_query = '' OR 
             to_tsvector('english', p.title || ' ' || COALESCE(p.excerpt, '')) @@ plainto_tsquery('english', search_query) OR
             to_tsvector('english', pt.title || ' ' || COALESCE(pt.content, '') || ' ' || COALESCE(pt.excerpt, '')) @@ plainto_tsquery('english', search_query))
        AND (category_id IS NULL OR p.category_id = category_id)
        AND (status_filter = 'all' OR p.status = status_filter)
        AND (language_code = 'all' OR l.code = language_code)
    )
    SELECT 
        fp.id,
        fp.title,
        fp.excerpt,
        fp.featured_image_url,
        fp.author_name,
        fp.status,
        fp.published_at,
        fp.is_featured,
        fp.total_count
    FROM filtered_posts fp
    ORDER BY fp.published_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get paginated projects with search
CREATE OR REPLACE FUNCTION get_paginated_projects(
    search_query TEXT DEFAULT '',
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10,
    language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    project_url TEXT,
    featured_image_url TEXT,
    description TEXT,
    short_description TEXT,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_projects AS (
        SELECT 
            p.id,
            p.name,
            p.slug,
            p.project_url,
            p.featured_image_url,
            pt.description,
            pt.short_description,
            COUNT(*) OVER() as total_count
        FROM projects p
        LEFT JOIN project_translations pt ON p.id = pt.project_id
        LEFT JOIN languages l ON pt.language_id = l.id
        WHERE p.is_active = true
        AND (search_query = '' OR 
             to_tsvector('english', p.name) @@ plainto_tsquery('english', search_query) OR
             to_tsvector('english', pt.description || ' ' || COALESCE(pt.short_description, '')) @@ plainto_tsquery('english', search_query))
        AND (language_code = 'all' OR l.code = language_code)
    )
    SELECT 
        fp.id,
        fp.name,
        fp.slug,
        fp.project_url,
        fp.featured_image_url,
        fp.description,
        fp.short_description,
        fp.total_count
    FROM filtered_projects fp
    ORDER BY fp.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for Updated At

-- Create triggers for new tables
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initial Super Admin User Role

-- Performance Indexes

-- User roles indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_roles_is_active ON user_roles(is_active);

-- User profiles indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Newsletter subscriptions indexes
CREATE INDEX idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_subscriptions_is_active ON newsletter_subscriptions(is_active);
CREATE INDEX idx_newsletter_subscriptions_subscribed_at ON newsletter_subscriptions(subscribed_at);

-- Performance indexes for search
CREATE INDEX idx_posts_status_published_at ON posts(status, published_at) WHERE status = 'published';
CREATE INDEX idx_post_translations_language_id ON post_translations(language_id);
CREATE INDEX idx_project_translations_language_id ON project_translations(language_id);
