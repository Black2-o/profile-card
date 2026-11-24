-- ==============================================================================
-- Profiles Table Schema (Flat Columns - No JSONB)
-- All social & contact links are stored directly as flat columns.
-- If any link column is NULL or empty, it will not be displayed on the card.
-- ==============================================================================

-- 1. Reset table if it already exists (ensures clean setup)
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Create the Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bio TEXT NOT NULL,
    stats_html TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    portfolio_url TEXT DEFAULT NULL,
    
    -- Talk With Me links (Flat columns)
    whatsapp TEXT DEFAULT 'https://wa.me/yourphonenumber',
    telegram TEXT DEFAULT 'https://t.me/hishahidullah',
    messenger TEXT DEFAULT NULL,
    email TEXT DEFAULT 'mailto:yourname@example.com',
    
    -- Follow Me links (Flat columns: X -> YouTube -> GitHub -> Instagram -> TikTok)
    twitter TEXT DEFAULT 'https://x.com/yourusername',
    youtube TEXT DEFAULT 'https://youtube.com/@yourchannel',
    github TEXT DEFAULT 'https://github.com/yourusername',
    instagram TEXT DEFAULT 'https://instagram.com/yourusername',
    tiktok TEXT DEFAULT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row-Level Security (RLS) for data safety
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Read Policy (anyone can view profile data)
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- 5. Insert your initial profile record
INSERT INTO profiles (
    name, 
    bio, 
    stats_html, 
    cover_image_url, 
    avatar_url, 
    portfolio_url, 
    whatsapp,
    telegram,
    messenger,
    email,
    twitter,
    youtube,
    github,
    instagram,
    tiktok
)
VALUES (
    'Md Shahidullah',
    'Full-Stack Developer (Python, Django & React)',
    'Turning ideas into scalable, real-world products • Django • APIs • Systems • Startups • 🏆 Hackathon winner • <b>DM “CODE”</b>',
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/banner.jpg',
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/Profile.jpg',
    NULL,
    'https://wa.me/yourphonenumber',
    'https://t.me/hishahidullah',
    NULL,
    'mailto:yourname@example.com',
    'https://x.com/yourusername',
    'https://youtube.com/@yourchannel',
    'https://github.com/Black2-o',
    'https://instagram.com/yourusername',
    NULL
);

-- ==============================================================================
-- 1. Profiles Table Extension
-- Add show_projects toggle to control the Projects button on the profile card
-- ==============================================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_projects BOOLEAN DEFAULT true;

-- ==============================================================================
-- 2. Projects Table Schema (For Notion-Style Gallery & Project Pages)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    overview TEXT NOT NULL,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    tech_highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    cover_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    demo_url TEXT DEFAULT NULL,
    github_url TEXT DEFAULT NULL,
    status TEXT DEFAULT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public Read Policy
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
CREATE POLICY "Public projects are viewable by everyone"
ON projects FOR SELECT
USING (true);

-- ==============================================================================
-- 3. Initial 10 Projects
-- ==============================================================================

INSERT INTO projects (
    slug, 
    title, 
    short_desc, 
    overview, 
    problem, 
    solution, 
    tech_highlights, 
    cover_image, 
    demo_url, 
    github_url, 
    status
)
VALUES 
(
    'hissaflow',
    'HissaFlow',
    'Office management & sweat equity tracking for early startups',
    'A clean, minimalist office management tool designed specifically for early startup teams to track daily tasks, attendance, and true sweat equity.',
    'Co-founders and early-stage startup teams often run into unspoken friction and arguments over "who is actually doing the work." Traditional project management tools are either too bloated or don''t track real commitment.',
    '• Daily Commitment Logs: Transparent task and attendance tracking so dedication is clear to all co-founders.
• Sweat Equity Calculation: Directly ties verified work and time into transparent equity agreements.
• Zero Friction: Built to take under 30 seconds a day to update.',
    ARRAY['Next.js', 'Django', 'PostgreSQL', 'Tailwind CSS'],
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    NULL,
    NULL,
    'running'
),
(
    'blockx-android',
    'BlockX (Android App)',
    'Surgical distraction blocker that kills Reels & Shorts',
    'A surgical mobile distraction blocker built with Flutter that kills mindless doomscrolling without locking you out of essential apps.',
    'Traditional app blockers are fundamentally flawed—they lock you out of Facebook or Instagram entirely. When you actually need those apps for work or messaging, the friction is so high that you end up uninstalling the blocker.',
    '• Feature-Level Blocking: Specifically targets and blocks Reels and Shorts natively on Android while keeping the core messaging and feed accessible.
• The 5-Second Delay: Forces a mandatory 5-second reflection screen before opening tempting apps, breaking the mindless dopamine impulse.
• Block Timers: Allows controlled 5-minute sessions instead of unrealistic total bans.',
    ARRAY['Flutter', 'Dart', 'Android Accessibility APIs'],
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/Projects/blockxapp.jpg',
    NULL,
    NULL,
    NULL
),
(
    'leedit',
    'Leedit',
    'In-browser video editor with Canvas2D & WebGL pipeline',
    'A high-performance, in-browser video editor built with React, powered by a custom multi-layer Canvas2D and WebGL rendering pipeline.',
    'Heavy desktop video editors like After Effects constantly freeze and lag on low-spec budget hardware (like an 8GB i3 PC). I wanted a lightweight, modern video editor that runs smoothly directly in the web browser.',
    '• Custom Render Pipeline: Dedicated frame-by-frame renderer (renderFrame) decoupled from the UI for smooth real-time scrubbing.
• Multi-Layer Support: Text layers, vector shapes, video clips, and adjustment washes.
• Motion & 3D: Integrated support for Lottie vector animations and Three.js 3D scenes inside the timeline.',
    ARRAY['React', 'TypeScript', 'HTML5 Canvas2D', 'WebGL', 'Playwright'],
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/Projects/leedit.jpg',
    NULL,
    NULL,
    'running'
),
(
    'kasten-ai',
    'Kasten AI',
    'Intelligent universal inbox with chat app integration',
    'An intelligent universal inbox that integrates with chat apps to automatically organize forwarded links, screenshots, and voice notes into a searchable digital archive.',
    'We all save great posts on Instagram, links on WhatsApp, and notes on Telegram—and then completely forget about them. When you actually need that information later, it is buried across five different apps.',
    '• Universal Forwarding: Forward any post or link directly from WhatsApp, Telegram, or SMS without opening a new app.
• Search by Describing It: Uses vector embeddings to find what you saved by describing the topic, even if you don''t remember the exact title.
• Model Context Protocol (MCP): Directly integrates with Claude or ChatGPT so your AI assistant can access your saved library.',
    ARRAY['Next.js', 'Django', 'PostgreSQL', 'pgvector', 'FastAPI', 'Flutter'],
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/Projects/kastenai.jpg',
    'https://kastenai.com/',
    NULL,
    NULL
),
(
    'blockx-extension',
    'BlockX (Chrome Extension)',
    'Desktop extension intercepting doomscrolling sublinks',
    'A lightweight browser extension that eliminates doomscrolling on desktop by intercepting and blocking distracting sublinks.',
    'Before building the mobile app, I found myself getting pulled into Facebook Reels and YouTube Shorts on my laptop. I couldn''t block the websites completely because I needed them for development and messaging.',
    '• Sublink Interception: Actively monitors URL changes and blocks /reels and /shorts paths instantly.
• Zero Bloat: Minimalist script running with near-zero memory footprint.
• Instant Focus: Clean blocked-screen overlay encouraging you to return to productive work.',
    ARRAY['JavaScript', 'Chrome Extension APIs', 'Manifest V3'],
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/Projects/blockxextension.jpg',
    NULL,
    NULL,
    NULL
),
(
    'krishisense-bd',
    'KrishiSenseBD',
    'AI crop disease diagnosis & soil advisory for farmers',
    'An AI-powered Progressive Web App (PWA) with a 100% Bengali interface providing instant crop disease diagnosis and soil advisory for farmers.',
    'Built in a single overnight sprint after a science fair setback, jumping from sub-district 3rd to winning 1st Place at the District Science Fair. Designed to solve Bangladesh''s hyper-local agricultural challenges.',
    '• AI Leaf Diagnosis: Snap a photo of a sick leaf to receive an immediate diagnosis and medicine guide in Bengali.
• Smart Crop Advisory: Recommends optimal crops based on soil photos and localized season data.
• SMS Weather Alerts: Real-time weather risk alerts sent directly to basic mobile phones.',
    ARRAY['Next.js 15', 'FastAPI', 'Gemini Vision API', 'Plant.id API', 'Tailwind CSS'],
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    NULL,
    NULL,
    NULL
),
(
    'flamewatch',
    'FlameWatch',
    'Real-time wildfire prediction & 3D risk assessment',
    'A real-time wildfire prediction and 3D risk assessment platform developed for the NASA International Space Apps Challenge 2024.',
    'Wildfires destroy millions of hectares globally each year, and traditional early warning systems often lack accessible, real-time predictive visualization.',
    '• Machine Learning Prediction: Trained a Random Forest model on live satellite datasets, achieving 80% predictive accuracy.
• 3D Risk Visualization: Interactive Three.js globe visualizing live risk heatmaps and wind vectors.
• Modular Backend: Django REST Framework layer handling satellite telemetry and prediction scoring.',
    ARRAY['Python', 'Django REST Framework', 'Pandas', 'Three.js', 'Satellite APIs'],
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/Projects/flamewatch.jpg',
    NULL,
    NULL,
    NULL
),
(
    'medvisual',
    'MedVisual',
    'Healthcare report digitization & health passport ecosystem',
    'Bangladesh''s first AI-powered healthcare report digitization and health passport ecosystem.',
    'Medical records in Bangladesh are overwhelmingly kept on paper, leading to lost histories, clinical blind spots for doctors, and redundant diagnostic costs.',
    '• AI Smart Reports: Automated OCR pipeline turning messy paper reports into structured medical data.
• Unified Health Passport: Centralized digital health profile accessible by both patients and doctors.
• Traction & Honors: Won 3rd Place & People''s Choice at HackCSB 2024 (judged by engineers from Apple & Microsoft); accepted into the a16z-endorsed Momentum cohort.',
    ARRAY['Python', 'Django', 'React', 'OCR', 'PostgreSQL', 'Nginx', 'VPS'],
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    NULL,
    NULL,
    NULL
),
(
    'suntex-solutions',
    'Suntex Solutions',
    'E-commerce & B2B order management for garment manufacturing',
    'A custom e-commerce and B2B order management system built for a garment accessories manufacturer in Dhaka.',
    'The client operated entirely through manual paperwork and phone calls, leading to slow order processing times and frequent inventory errors.',
    '• Automated Order Processing: Cut manual order handling time by 60% and reduced processing errors to near zero.
• Custom Catalog: Dynamic Django product catalog easily managed by non-technical staff.
• Production Deployment: Deployed on a secure VPS behind Nginx and Cloudflare.',
    ARRAY['Python', 'Django', 'PostgreSQL', 'Nginx', 'Cloudflare'],
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/Projects/suntexlbl.jpg',
    NULL,
    NULL,
    NULL
),
(
    'space-biolens',
    'Space-BioLens',
    'Intelligent space biology knowledge engine (NASA Space Apps)',
    'An Intelligent Space Biology Knowledge Engine designed for the NASA International Space Apps Challenge 2025.',
    'NASA’s space biology datasets are dense, highly technical, and scattered, making it difficult for students and researchers to navigate.',
    '• Accessible Exploration: An intuitive search and visualization engine making complex space experiments understandable.
• Interactive Frontend: Built with React to provide seamless browsing across research categories.
• Cloud Deployment: Deployed across Hugging Face Spaces and Render.',
    ARRAY['React', 'JavaScript', 'Python', 'Flask', 'Hugging Face', 'Render'],
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/Projects/spacebiolens.jpg',
    NULL,
    NULL,
    NULL
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_desc = EXCLUDED.short_desc,
    overview = EXCLUDED.overview,
    problem = EXCLUDED.problem,
    solution = EXCLUDED.solution,
    tech_highlights = EXCLUDED.tech_highlights,
    cover_image = EXCLUDED.cover_image,
    demo_url = EXCLUDED.demo_url,
    github_url = EXCLUDED.github_url,
    status = EXCLUDED.status,
    display_order = EXCLUDED.display_order,
    updated_at = NOW();
