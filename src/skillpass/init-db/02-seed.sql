-- Seed data for SkillPass database
-- This will be executed after table creation

-- Clear existing data first
DELETE FROM endorsements;
DELETE FROM skills;
DELETE FROM user_profiles;

-- Insert demo users
INSERT INTO "user_profiles" (
    "id", "wallet_address", "display_name", "bio", "avatar", "website", "twitter", "linkedin",
    "reputation_score", "total_skills", "total_endorsements", "verified_skills", "last_active", "joined_at"
) VALUES 
(
    'demo_user_1',
    '0x1234567890123456789012345678901234567890',
    'Sarah Chen',
    'Senior React Developer with 5+ years experience building scalable web applications. Passionate about clean code and modern frontend architecture.',
    NULL,
    'https://sarahchen.dev',
    'sarahchen_dev',
    'sarah-chen-dev',
    980,
    3,
    12,
    3,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '180 days'
),
(
    'demo_user_2',
    '0x2345678901234567890123456789012345678901',
    'Mike Johnson',
    'ML Engineer specializing in computer vision and NLP. Published researcher with multiple patents in AI/ML space.',
    NULL,
    'https://mike-ai.com',
    'mike_ml_engineer',
    'mike-johnson-ai',
    960,
    2,
    8,
    2,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '240 days'
),
(
    'demo_user_3',
    '0x3456789012345678901234567890123456789012',
    'Emma Wilson',
    'UX Designer focused on creating inclusive and accessible digital experiences. Design systems expert.',
    NULL,
    'https://emmawilson.design',
    'emma_ux_design',
    'emma-wilson-ux',
    940,
    2,
    10,
    2,
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '120 days'
),
(
    'demo_user_4',
    '0x4567890123456789012345678901234567890123',
    'David Kim',
    'DevOps Engineer with expertise in cloud infrastructure, CI/CD, and container orchestration.',
    NULL,
    'https://davidkim.cloud',
    'david_devops',
    'david-kim-devops',
    930,
    2,
    7,
    2,
    NOW() - INTERVAL '12 hours',
    NOW() - INTERVAL '90 days'
),
(
    'demo_user_5',
    '0x5678901234567890123456789012345678901234',
    'Lisa Rodriguez',
    'Product Manager with a track record of launching successful B2B SaaS products. Former startup founder.',
    NULL,
    'https://lisarodriguez.pm',
    'lisa_pm',
    'lisa-rodriguez-pm',
    910,
    2,
    6,
    1,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '200 days'
),
(
    'demo_user_6',
    '0x6789012345678901234567890123456789012345',
    'Alex Thompson',
    'Smart Contract Developer building DeFi protocols. Ethereum and Solana expert with security audit experience.',
    NULL,
    'https://alexthompson.blockchain',
    'alex_blockchain',
    'alex-thompson-blockchain',
    890,
    2,
    5,
    1,
    NOW() - INTERVAL '1 week',
    NOW() - INTERVAL '150 days'
);

-- Insert demo skills
INSERT INTO "skills" (
    "id", "user_id", "wallet_address", "category", "name", "description",
    "evidence", "total_staked", "endorsement_count", "verified", "status"
) VALUES 
(
    'skill_1',
    'demo_user_1',
    '0x1234567890123456789012345678901234567890',
    'Frontend',
    'React Development',
    'Expert-level React development with hooks, context, and performance optimization',
    '{"portfolio": "https://github.com/sarahchen/react-portfolio", "certifications": ["React Professional"], "testimonials": ["Built entire frontend for 50k+ user platform"]}',
    500,
    4,
    true,
    'verified'
),
(
    'skill_2',
    'demo_user_1',
    '0x1234567890123456789012345678901234567890',
    'Frontend',
    'TypeScript',
    'Advanced TypeScript patterns, generics, and type system architecture',
    '{"portfolio": "https://github.com/sarahchen/typescript-utils", "experience": "5+ years", "projects": ["Type-safe API client library"]}',
    300,
    3,
    true,
    'verified'
),
(
    'skill_3',
    'demo_user_2',
    '0x2345678901234567890123456789012345678901',
    'AI/ML',
    'Machine Learning',
    'Deep learning, computer vision, and NLP with PyTorch and TensorFlow',
    '{"publications": ["CVPR 2023", "NeurIPS 2022"], "patents": 3, "models": ["Image classification with 99.2% accuracy"]}',
    750,
    5,
    true,
    'verified'
),
(
    'skill_4',
    'demo_user_2',
    '0x2345678901234567890123456789012345678901',
    'AI/ML',
    'Python',
    'Advanced Python for data science, ML pipelines, and backend development',
    '{"github": "https://github.com/mikejohnson/ml-toolkit", "experience": "8+ years", "frameworks": ["FastAPI", "Django", "PyTorch"]}',
    400,
    3,
    true,
    'verified'
),
(
    'skill_5',
    'demo_user_3',
    '0x3456789012345678901234567890123456789012',
    'Design',
    'UX Design',
    'User-centered design, research, prototyping, and design systems',
    '{"portfolio": "https://emmawilson.design/portfolio", "tools": ["Figma", "Sketch", "Principle"], "achievements": ["Increased user engagement by 40%"]}',
    450,
    4,
    true,
    'verified'
),
(
    'skill_6',
    'demo_user_3',
    '0x3456789012345678901234567890123456789012',
    'Design',
    'Design Systems',
    'Scalable design system architecture and component libraries',
    '{"systems": ["Built design system for 10+ products"], "tools": ["Figma", "Storybook"], "impact": ["Reduced design debt by 60%"]}',
    350,
    3,
    true,
    'verified'
);

-- Insert endorsements
INSERT INTO "endorsements" (
    "id", "skill_id", "endorser_id", "endorser_wallet", "staked_amount", "evidence", "active"
) VALUES 
('end_1', 'skill_1', 'demo_user_2', '0x2345678901234567890123456789012345678901', 150, 'Worked with Sarah on a complex React application. Her code quality and architecture decisions were exceptional.', true),
('end_2', 'skill_1', 'demo_user_3', '0x3456789012345678901234567890123456789012', 100, 'Sarah''s React expertise helped our team deliver a pixel-perfect, performant frontend ahead of schedule.', true),
('end_3', 'skill_1', 'demo_user_4', '0x4567890123456789012345678901234567890123', 120, 'Outstanding React developer. Clean, maintainable code and excellent problem-solving skills.', true),
('end_4', 'skill_1', 'demo_user_5', '0x5678901234567890123456789012345678901234', 80, 'Sarah built our entire customer dashboard using React. The user feedback has been overwhelmingly positive.', true),

('end_5', 'skill_2', 'demo_user_2', '0x2345678901234567890123456789012345678901', 100, 'Sarah''s TypeScript skills are top-notch. She created type-safe patterns that prevented countless runtime errors.', true),
('end_6', 'skill_2', 'demo_user_4', '0x4567890123456789012345678901234567890123', 120, 'Excellent TypeScript architecture. Her type definitions made our codebase much more maintainable.', true),
('end_7', 'skill_2', 'demo_user_6', '0x6789012345678901234567890123456789012345', 80, 'Impressive TypeScript expertise, especially with advanced patterns and generic types.', true),

('end_8', 'skill_3', 'demo_user_1', '0x1234567890123456789012345678901234567890', 250, 'Mike''s ML models achieved production-ready accuracy faster than any other engineer I''ve worked with.', true),
('end_9', 'skill_3', 'demo_user_3', '0x3456789012345678901234567890123456789012', 200, 'Collaborated with Mike on an ML project. His expertise in computer vision is remarkable.', true),
('end_10', 'skill_3', 'demo_user_4', '0x4567890123456789012345678901234567890123', 150, 'Mike''s ML pipeline architecture is production-grade. Scalable and well-documented.', true),
('end_11', 'skill_3', 'demo_user_5', '0x5678901234567890123456789012345678901234', 100, 'Working with Mike on our AI product was a game-changer. His models significantly improved our metrics.', true),
('end_12', 'skill_3', 'demo_user_6', '0x6789012345678901234567890123456789012345', 50, 'Solid ML engineering skills. Mike delivered a production-ready model in record time.', true),

('end_13', 'skill_4', 'demo_user_1', '0x1234567890123456789012345678901234567890', 150, 'Mike''s Python code is clean, efficient, and well-tested. Great API design skills.', true),
('end_14', 'skill_4', 'demo_user_3', '0x3456789012345678901234567890123456789012', 120, 'Excellent Python developer. Mike''s FastAPI implementation was flawless.', true),
('end_15', 'skill_4', 'demo_user_6', '0x6789012345678901234567890123456789012345', 130, 'Strong Python skills, especially for data processing and ML pipelines.', true),

('end_16', 'skill_5', 'demo_user_1', '0x1234567890123456789012345678901234567890', 180, 'Emma''s UX research and design dramatically improved our user engagement metrics.', true),
('end_17', 'skill_5', 'demo_user_2', '0x2345678901234567890123456789012345678901', 150, 'Outstanding UX designer. Emma''s user research insights were invaluable to our product strategy.', true),
('end_18', 'skill_5', 'demo_user_4', '0x4567890123456789012345678901234567890123', 80, 'Emma''s design thinking approach solved complex UX challenges elegantly.', true),
('end_19', 'skill_5', 'demo_user_5', '0x5678901234567890123456789012345678901234', 40, 'Great UX design skills. Emma''s prototypes helped us validate product concepts quickly.', true),

('end_20', 'skill_6', 'demo_user_1', '0x1234567890123456789012345678901234567890', 120, 'Emma''s design system reduced our development time significantly. Well-structured and comprehensive.', true),
('end_21', 'skill_6', 'demo_user_2', '0x2345678901234567890123456789012345678901', 100, 'Excellent design system architecture. Emma''s component library is developer-friendly and scalable.', true),
('end_22', 'skill_6', 'demo_user_4', '0x4567890123456789012345678901234567890123', 130, 'Emma''s design system implementation is top-tier. Clean, consistent, and well-documented.', true); 