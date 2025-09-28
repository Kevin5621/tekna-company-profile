-- Migration: Add Project Detail Fields
-- Description: Add additional fields for project details
-- Created: 2025-09-27

-- Add new columns to projects table for detail information
ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_date VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_duration VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_size VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_status VARCHAR(50) DEFAULT 'completed';

-- Add comment for documentation
COMMENT ON COLUMN projects.technologies IS 'Technologies used in the project (comma-separated)';
COMMENT ON COLUMN projects.client_name IS 'Client or company name for the project';
COMMENT ON COLUMN projects.project_date IS 'Project completion or start date';
COMMENT ON COLUMN projects.project_duration IS 'Duration of the project';
COMMENT ON COLUMN projects.team_size IS 'Size of the team that worked on the project';
COMMENT ON COLUMN projects.project_status IS 'Current status of the project (completed, in-progress, on-hold, etc.)';

-- Update the updated_at timestamp trigger to include new columns
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_projects_updated_at_trigger ON projects;
CREATE TRIGGER update_projects_updated_at_trigger
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_projects_updated_at();