-- ==============================================================================
-- Profiles Table Schema (Flat Columns - No JSONB)
-- All social & contact links are stored directly as flat columns.
-- If any link column is NULL or empty, the frontend renders it as disabled/unclickable.
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
    messenger TEXT DEFAULT 'https://m.me/yourusername',
    email TEXT DEFAULT 'mailto:yourname@example.com',
    
    -- Follow Me links (Flat columns: X -> YouTube -> GitHub -> Instagram)
    twitter TEXT DEFAULT 'https://x.com/yourusername',
    youtube TEXT DEFAULT 'https://youtube.com/@yourchannel',
    github TEXT DEFAULT 'https://github.com/yourusername',
    instagram TEXT DEFAULT 'https://instagram.com/yourusername',
    
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
    messenger,
    email,
    twitter,
    youtube,
    github,
    instagram
)
VALUES (
    'Md Shahidullah',
    'Full-Stack Developer (Python, Django & React)',
    'Turning ideas into scalable, real-world products • Django • APIs • Systems • Startups • 🏆 Hackathon winner • <b>DM “CODE”</b>',
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/banner.jpg',
    'https://pwzxgcljsicbbvgzjxuu.supabase.co/storage/v1/object/public/media/Profile.jpg',
    NULL,
    'https://wa.me/yourphonenumber',
    'https://m.me/yourusername',
    'mailto:yourname@example.com',
    'https://x.com/yourusername',
    'https://youtube.com/@yourchannel',
    'https://github.com/Black2-o',
    'https://instagram.com/yourusername'
);
