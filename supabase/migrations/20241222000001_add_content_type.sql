-- Add content_type field to posts table
ALTER TABLE posts 
ADD COLUMN content_type VARCHAR(10) DEFAULT 'markdown' CHECK (content_type IN ('html', 'markdown'));

-- Update existing posts to have content_type = 'markdown'
UPDATE posts SET content_type = 'markdown' WHERE content_type IS NULL;

-- Make content_type NOT NULL after setting default values
ALTER TABLE posts 
ALTER COLUMN content_type SET NOT NULL;

-- Add index for better performance
CREATE INDEX idx_posts_content_type ON posts(content_type);
