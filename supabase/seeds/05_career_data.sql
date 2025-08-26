-- Career system seed data
-- Created: 2025-08-25

-- Insert career categories
INSERT INTO career_categories (name, slug, description, icon, color, sort_order, is_active) VALUES
('Engineering', 'engineering', 'Software development and technical roles', 'Code', '#3B82F6', 1, true),
('Design', 'design', 'UI/UX design and creative roles', 'Palette', '#EC4899', 2, true),
('Product', 'product', 'Product management and strategy roles', 'Target', '#10B981', 3, true),
('Marketing', 'marketing', 'Digital marketing and growth roles', 'Megaphone', '#F59E0B', 4, true),
('Sales', 'sales', 'Business development and sales roles', 'TrendingUp', '#EF4444', 5, true),
('Operations', 'operations', 'Business operations and support roles', 'Settings', '#8B5CF6', 6, true),
('Finance', 'finance', 'Financial planning and accounting roles', 'Calculator', '#06B6D4', 7, true),
('Human Resources', 'human-resources', 'People and talent management roles', 'Users', '#84CC16', 8, true);

-- Insert career locations
INSERT INTO career_locations (name, slug, address, city, state, country, timezone, is_remote, sort_order, is_active) VALUES
('Jakarta Office', 'jakarta', 'Jl. Sudirman No. 123, SCBD', 'Jakarta', 'DKI Jakarta', 'Indonesia', 'Asia/Jakarta', false, 1, true),
('Bandung Office', 'bandung', 'Jl. Braga No. 45', 'Bandung', 'West Java', 'Indonesia', 'Asia/Jakarta', false, 2, true),
('Surabaya Office', 'surabaya', 'Jl. Pemuda No. 67', 'Surabaya', 'East Java', 'Indonesia', 'Asia/Jakarta', false, 3, true),
('Remote Indonesia', 'remote-indonesia', '', 'Remote', '', 'Indonesia', 'Asia/Jakarta', true, 4, true),
('Remote Global', 'remote-global', '', 'Remote', '', 'Global', 'UTC', true, 5, true);

-- Insert career types
INSERT INTO career_types (name, slug, description, sort_order, is_active) VALUES
('Full-time', 'full-time', 'Full-time permanent position with benefits', 1, true),
('Part-time', 'part-time', 'Part-time position with flexible hours', 2, true),
('Contract', 'contract', 'Fixed-term contract position', 3, true),
('Internship', 'internship', 'Learning opportunity for students and graduates', 4, true),
('Freelance', 'freelance', 'Project-based freelance work', 5, true);

-- Insert career levels
INSERT INTO career_levels (name, slug, description, years_min, years_max, sort_order, is_active) VALUES
('Entry Level', 'entry-level', 'For fresh graduates and beginners', 0, 2, 1, true),
('Mid Level', 'mid-level', 'For professionals with some experience', 2, 5, 2, true),
('Senior Level', 'senior-level', 'For experienced professionals and team leads', 5, 10, 3, true),
('Principal/Staff', 'principal-staff', 'For technical experts and senior individual contributors', 8, 15, 4, true),
('Management', 'management', 'For people managers and team leaders', 3, null, 5, true),
('Executive', 'executive', 'For C-level and VP positions', 10, null, 6, true);

-- Insert career skills
INSERT INTO career_skills (name, slug, category, description, sort_order, is_active) VALUES
-- Technical skills
('JavaScript', 'javascript', 'technical', 'Programming language for web development', 1, true),
('TypeScript', 'typescript', 'technical', 'Typed superset of JavaScript', 2, true),
('React', 'react', 'technical', 'JavaScript library for building user interfaces', 3, true),
('Next.js', 'nextjs', 'technical', 'React framework for production', 4, true),
('Node.js', 'nodejs', 'technical', 'JavaScript runtime for server-side development', 5, true),
('Python', 'python', 'technical', 'Programming language for various applications', 6, true),
('Java', 'java', 'technical', 'Object-oriented programming language', 7, true),
('Go', 'go', 'technical', 'Programming language developed by Google', 8, true),
('PostgreSQL', 'postgresql', 'technical', 'Advanced open source relational database', 9, true),
('MongoDB', 'mongodb', 'technical', 'NoSQL document database', 10, true),
('Docker', 'docker', 'technical', 'Containerization platform', 11, true),
('Kubernetes', 'kubernetes', 'technical', 'Container orchestration platform', 12, true),
('AWS', 'aws', 'technical', 'Amazon Web Services cloud platform', 13, true),
('Git', 'git', 'technical', 'Version control system', 14, true),
('REST APIs', 'rest-apis', 'technical', 'Representational State Transfer APIs', 15, true),
('GraphQL', 'graphql', 'technical', 'Query language for APIs', 16, true),

-- Design skills
('Figma', 'figma', 'technical', 'Design and prototyping tool', 17, true),
('Adobe Creative Suite', 'adobe-creative-suite', 'technical', 'Professional design software suite', 18, true),
('UI Design', 'ui-design', 'technical', 'User interface design', 19, true),
('UX Design', 'ux-design', 'technical', 'User experience design', 20, true),
('Prototyping', 'prototyping', 'technical', 'Creating interactive prototypes', 21, true),
('User Research', 'user-research', 'technical', 'Understanding user needs and behaviors', 22, true),

-- Soft skills
('Communication', 'communication', 'soft', 'Effective verbal and written communication', 23, true),
('Leadership', 'leadership', 'soft', 'Leading teams and driving results', 24, true),
('Problem Solving', 'problem-solving', 'soft', 'Analytical thinking and solution finding', 25, true),
('Team Collaboration', 'team-collaboration', 'soft', 'Working effectively in teams', 26, true),
('Project Management', 'project-management', 'soft', 'Planning and executing projects', 27, true),
('Agile/Scrum', 'agile-scrum', 'soft', 'Agile development methodologies', 28, true),
('Critical Thinking', 'critical-thinking', 'soft', 'Objective analysis and evaluation', 29, true),
('Adaptability', 'adaptability', 'soft', 'Flexibility in changing environments', 30, true),

-- Language skills
('English', 'english', 'language', 'English language proficiency', 31, true),
('Indonesian', 'indonesian', 'language', 'Indonesian language proficiency', 32, true),
('Mandarin', 'mandarin', 'language', 'Mandarin Chinese language proficiency', 33, true),

-- Marketing/Business skills
('Digital Marketing', 'digital-marketing', 'technical', 'Online marketing strategies and execution', 34, true),
('SEO/SEM', 'seo-sem', 'technical', 'Search engine optimization and marketing', 35, true),
('Content Marketing', 'content-marketing', 'technical', 'Creating and distributing valuable content', 36, true),
('Social Media Marketing', 'social-media-marketing', 'technical', 'Social platform marketing strategies', 37, true),
('Data Analysis', 'data-analysis', 'technical', 'Analyzing data to derive insights', 38, true),
('Business Development', 'business-development', 'soft', 'Growing business opportunities', 39, true),
('Sales', 'sales', 'soft', 'Selling products and services', 40, true);

-- Get company ID for Tekna
DO $$
DECLARE
    tekna_company_id uuid;
    engineering_category_id uuid;
    design_category_id uuid;
    product_category_id uuid;
    marketing_category_id uuid;
    jakarta_location_id uuid;
    remote_location_id uuid;
    fulltime_type_id uuid;
    internship_type_id uuid;
    mid_level_id uuid;
    senior_level_id uuid;
    entry_level_id uuid;
BEGIN
    -- Get IDs for foreign key references
    SELECT id INTO tekna_company_id FROM companies WHERE slug = 'tekna';
    SELECT id INTO engineering_category_id FROM career_categories WHERE slug = 'engineering';
    SELECT id INTO design_category_id FROM career_categories WHERE slug = 'design';
    SELECT id INTO product_category_id FROM career_categories WHERE slug = 'product';
    SELECT id INTO marketing_category_id FROM career_categories WHERE slug = 'marketing';
    SELECT id INTO jakarta_location_id FROM career_locations WHERE slug = 'jakarta';
    SELECT id INTO remote_location_id FROM career_locations WHERE slug = 'remote-indonesia';
    SELECT id INTO fulltime_type_id FROM career_types WHERE slug = 'full-time';
    SELECT id INTO internship_type_id FROM career_types WHERE slug = 'internship';
    SELECT id INTO entry_level_id FROM career_levels WHERE slug = 'entry-level';
    SELECT id INTO mid_level_id FROM career_levels WHERE slug = 'mid-level';
    SELECT id INTO senior_level_id FROM career_levels WHERE slug = 'senior-level';

    -- Insert sample career positions
    INSERT INTO career_positions (
        company_id, category_id, location_id, type_id, level_id,
        title, slug, summary, description, requirements, benefits,
        salary_min, salary_max, salary_currency, salary_type,
        application_deadline, remote_allowed, featured, status,
        seo_title, seo_description, seo_keywords,
        is_active, published_at
    ) VALUES
    (
        tekna_company_id, engineering_category_id, jakarta_location_id, fulltime_type_id, senior_level_id,
        'Senior Full Stack Developer', 'senior-full-stack-developer',
        'Join our engineering team to build scalable web applications using modern technologies.',
        '# Senior Full Stack Developer

We are looking for an experienced Full Stack Developer to join our growing engineering team. You will be responsible for developing and maintaining our web applications using React, Next.js, and Node.js.

## What You''ll Do
- Develop and maintain web applications using React and Next.js
- Build robust backend APIs using Node.js and PostgreSQL
- Collaborate with design and product teams
- Mentor junior developers
- Participate in code reviews and architecture decisions

## Tech Stack
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- Infrastructure: Docker, AWS, Vercel
- Tools: Git, GitHub, Linear, Figma',
        '## Requirements
- 5+ years of experience in full stack development
- Strong proficiency in JavaScript/TypeScript
- Experience with React and Next.js
- Experience with Node.js and Express
- Knowledge of PostgreSQL or similar databases
- Experience with Git and version control
- Strong problem-solving skills
- Excellent communication skills

## Preferred Qualifications
- Experience with cloud platforms (AWS, GCP, Azure)
- Knowledge of Docker and containerization
- Experience with testing frameworks
- Contributions to open source projects',
        '## What We Offer
- Competitive salary and equity package
- Health insurance coverage
- Flexible working hours
- Remote work options
- Professional development budget
- Modern office in Jakarta SCBD
- Free meals and snacks
- Team building activities
- Learning and development opportunities',
        15000000, 25000000, 'IDR', 'monthly',
        '2025-09-30 23:59:59+07'::timestamptz, true, true, 'open',
        'Senior Full Stack Developer - React, Next.js, Node.js | Tekna',
        'Join Tekna as a Senior Full Stack Developer. Work with React, Next.js, Node.js, and PostgreSQL to build scalable web applications.',
        'full stack developer, react, nextjs, nodejs, typescript, postgresql, jakarta, tekna',
        true, now()
    ),
    (
        tekna_company_id, design_category_id, remote_location_id, fulltime_type_id, mid_level_id,
        'UI/UX Designer', 'ui-ux-designer',
        'Create beautiful and intuitive user experiences for our digital products.',
        '# UI/UX Designer

We are seeking a talented UI/UX Designer to join our design team. You will be responsible for creating user-centered designs that are both beautiful and functional.

## What You''ll Do
- Design user interfaces for web and mobile applications
- Conduct user research and usability testing
- Create wireframes, prototypes, and high-fidelity designs
- Collaborate with product managers and developers
- Maintain and evolve our design system
- Present design concepts to stakeholders

## Design Process
- User research and persona development
- Information architecture and user flows
- Wireframing and prototyping in Figma
- Visual design and interaction design
- Usability testing and iteration',
        '## Requirements
- 3+ years of experience in UI/UX design
- Proficiency in Figma and design tools
- Strong portfolio showcasing web and mobile designs
- Understanding of user-centered design principles
- Experience with user research and testing
- Knowledge of HTML/CSS is a plus
- Excellent communication and presentation skills

## Preferred Qualifications
- Degree in Design, HCI, or related field
- Experience with design systems
- Knowledge of accessibility guidelines
- Experience with motion design
- Understanding of frontend development',
        '## What We Offer
- Competitive salary package
- Health insurance coverage
- Flexible remote work policy
- Latest design tools and software
- Professional development opportunities
- Creative freedom and autonomy
- Collaborative team environment
- Modern equipment and workspace
- Conference and workshop allowances',
        10000000, 18000000, 'IDR', 'monthly',
        '2025-10-15 23:59:59+07'::timestamptz, true, true, 'open',
        'UI/UX Designer - Remote Opportunity | Tekna',
        'Join Tekna as a UI/UX Designer. Create beautiful user experiences with full remote flexibility.',
        'ui ux designer, figma, user research, prototyping, remote, tekna',
        true, now()
    ),
    (
        tekna_company_id, engineering_category_id, jakarta_location_id, internship_type_id, entry_level_id,
        'Frontend Developer Intern', 'frontend-developer-intern',
        'Learn and grow as a frontend developer while working on real projects.',
        '# Frontend Developer Intern

Join our engineering team as a Frontend Developer Intern and gain hands-on experience building modern web applications. This is a great opportunity for students or recent graduates to learn from experienced developers.

## What You''ll Do
- Work on frontend features using React and Next.js
- Learn modern development practices and tools
- Participate in code reviews and team meetings
- Collaborate with designers and backend developers
- Contribute to our component library
- Learn about testing and deployment processes

## Learning Opportunities
- Mentorship from senior developers
- Exposure to modern frontend technologies
- Understanding of software development lifecycle
- Experience with real-world projects
- Professional development workshops',
        '## Requirements
- Currently studying Computer Science or related field, or recent graduate
- Basic knowledge of HTML, CSS, and JavaScript
- Some experience with React (projects, tutorials, or coursework)
- Eagerness to learn and grow
- Good communication skills
- Ability to work full-time for 3-6 months

## Preferred Qualifications
- Personal projects or portfolio showcasing frontend skills
- Familiarity with TypeScript
- Knowledge of Git and version control
- Understanding of responsive design
- Interest in modern web technologies',
        '## What We Offer
- Internship allowance
- Mentorship from experienced developers
- Hands-on experience with modern technologies
- Potential for full-time offer upon completion
- Learning and development opportunities
- Flexible learning schedule
- Modern office environment
- Free meals during office days
- Certificate of completion',
        3000000, 5000000, 'IDR', 'monthly',
        '2025-09-15 23:59:59+07'::timestamptz, false, false, 'open',
        'Frontend Developer Intern - React, Next.js | Tekna',
        'Start your career as a Frontend Developer Intern at Tekna. Learn React, Next.js with experienced mentors.',
        'frontend developer intern, react, nextjs, javascript, internship, tekna',
        true, now()
    ),
    (
        tekna_company_id, product_category_id, jakarta_location_id, fulltime_type_id, mid_level_id,
        'Product Manager', 'product-manager',
        'Drive product strategy and execution for our digital products.',
        '# Product Manager

We are looking for a Product Manager to join our product team and help shape the future of our digital products. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.

## What You''ll Do
- Define product strategy and roadmap
- Gather and prioritize product requirements
- Work with engineering and design teams
- Analyze user feedback and market research
- Define and track key product metrics
- Coordinate product launches and releases
- Communicate with stakeholders across the organization

## Product Focus Areas
- Web and mobile applications
- User experience optimization
- Data-driven product decisions
- Growth and user acquisition
- Feature development and enhancement',
        '## Requirements
- 3+ years of product management experience
- Experience with web and mobile products
- Strong analytical and problem-solving skills
- Excellent communication and leadership skills
- Experience with agile development methodologies
- Data-driven decision making approach
- Technical understanding to work with engineering teams

## Preferred Qualifications
- Experience with B2B or B2C digital products
- Knowledge of UX/UI design principles
- Experience with analytics tools (Google Analytics, Mixpanel, etc.)
- Technical background or CS degree
- Experience with A/B testing and experimentation',
        '## What We Offer
- Competitive salary and equity
- Health insurance and wellness benefits
- Professional development budget
- Flexible working arrangements
- Modern office in Jakarta
- Product management tools and resources
- Opportunity to shape product direction
- Collaborative team environment
- Career growth opportunities',
        12000000, 20000000, 'IDR', 'monthly',
        '2025-10-31 23:59:59+07'::timestamptz, true, false, 'open',
        'Product Manager - Digital Products | Tekna',
        'Join Tekna as a Product Manager to drive strategy and execution for innovative digital products.',
        'product manager, digital products, strategy, agile, analytics, tekna',
        true, now()
    ),
    (
        tekna_company_id, marketing_category_id, remote_location_id, fulltime_type_id, mid_level_id,
        'Digital Marketing Specialist', 'digital-marketing-specialist',
        'Drive growth through digital marketing strategies and campaigns.',
        '# Digital Marketing Specialist

Join our marketing team to drive growth through innovative digital marketing strategies. You will be responsible for developing and executing marketing campaigns across various digital channels.

## What You''ll Do
- Develop and execute digital marketing campaigns
- Manage social media presence and content
- Optimize SEO and SEM strategies
- Create and manage content marketing initiatives
- Analyze campaign performance and ROI
- Collaborate with design and product teams
- Stay updated with digital marketing trends

## Channels and Platforms
- Social media marketing (LinkedIn, Instagram, Twitter)
- Search engine marketing (Google Ads, SEO)
- Email marketing and automation
- Content marketing and blogging
- Influencer and partnership marketing',
        '## Requirements
- 2+ years of digital marketing experience
- Experience with Google Ads and Google Analytics
- Strong understanding of SEO/SEM principles
- Social media marketing experience
- Content creation and copywriting skills
- Data analysis and reporting skills
- Creative thinking and problem-solving abilities

## Preferred Qualifications
- Experience with marketing automation tools
- Knowledge of email marketing platforms
- Experience with design tools (Canva, Adobe Creative Suite)
- Understanding of conversion optimization
- Experience in B2B or tech marketing',
        '## What We Offer
- Competitive salary package
- Performance-based bonuses
- Health insurance coverage
- Remote work flexibility
- Marketing tools and software access
- Professional development opportunities
- Creative freedom in campaigns
- Data-driven work environment
- Growth opportunities',
        8000000, 15000000, 'IDR', 'monthly',
        '2025-11-30 23:59:59+07'::timestamptz, true, false, 'open',
        'Digital Marketing Specialist - Remote | Tekna',
        'Join Tekna as a Digital Marketing Specialist. Drive growth through innovative digital campaigns with remote flexibility.',
        'digital marketing, seo, sem, social media, content marketing, remote, tekna',
        true, now()
    );

END $$;
