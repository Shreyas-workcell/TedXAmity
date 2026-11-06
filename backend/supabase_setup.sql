-- TEDx Amity University Bengaluru Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create speakers table
CREATE TABLE IF NOT EXISTS speakers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    talk_title TEXT NOT NULL,
    bio TEXT NOT NULL,
    image_url TEXT NOT NULL,
    year TEXT NOT NULL,
    event_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT NOT NULL,
    linkedin_url TEXT DEFAULT '#',
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    theme TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    attendees TEXT NOT NULL,
    date TEXT,
    venue TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create event_images table
CREATE TABLE IF NOT EXISTS event_images (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create upcoming_events table
CREATE TABLE IF NOT EXISTS upcoming_events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    theme TEXT NOT NULL,
    date TEXT NOT NULL,
    venue TEXT NOT NULL,
    seats TEXT NOT NULL,
    description TEXT NOT NULL,
    poster_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcoming_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view speakers" ON speakers FOR SELECT USING (true);
CREATE POLICY "Public can view team members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can view event images" ON event_images FOR SELECT USING (true);
CREATE POLICY "Public can view upcoming events" ON upcoming_events FOR SELECT USING (true);

-- Create policies for authenticated admin access (service role)
CREATE POLICY "Service role can manage speakers" ON speakers FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage team members" ON team_members FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage events" ON events FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage event images" ON event_images FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage upcoming events" ON upcoming_events FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert initial data for speakers
INSERT INTO speakers (id, name, designation, talk_title, bio, image_url, year) VALUES
('1', 'Dr. Priya Sharma', 'AI Researcher & Entrepreneur', 'The Ethics of Artificial Intelligence', 'Dr. Priya Sharma is a leading voice in ethical AI development, having worked with top tech companies and research institutions worldwide. Her work focuses on creating AI systems that are transparent, fair, and beneficial to society.', 'https://images.unsplash.com/photo-1704253797699-f983e3cd70ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxzcGVha2VyJTIwb24lMjBkYXJrJTIwc3RhZ2V8ZW58MHx8fHwxNzc0NDIzMjgzfDA&ixlib=rb-4.1.0&q=85', '2024'),
('2', 'Arjun Krishnan', 'Climate Activist & Author', 'Small Actions, Global Impact', 'Arjun Krishnan has dedicated his life to environmental conservation. From local community projects to international climate summits, he demonstrates how individual actions can create meaningful change in addressing climate crisis.', 'https://images.unsplash.com/photo-1549046701-6bd11cf71796?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxzcGVha2VyJTIwb24lMjBkYXJrJTIwc3RhZ2V8ZW58MHx8fHwxNzc0NDIzMjgzfDA&ixlib=rb-4.1.0&q=85', '2024'),
('3', 'Meera Patel', 'Social Entrepreneur', 'Education as a Tool for Empowerment', 'Meera Patel founded multiple educational initiatives that have reached over 100,000 underprivileged children across India. Her innovative teaching methods blend technology with traditional wisdom.', 'https://images.pexels.com/photos/29708269/pexels-photo-29708269.jpeg', '2023');

-- Insert initial data for team members
INSERT INTO team_members (id, name, role, image_url, linkedin_url, "order") VALUES
('1', 'Aditya Verma', 'Organizer & President', 'https://images.pexels.com/photos/5349053/pexels-photo-5349053.jpeg', '#', 1),
('2', 'Ananya Desai', 'Curator', 'https://images.unsplash.com/photo-1770894807442-108cc33c0a7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3NDQyMzI4NXww&ixlib=rb-4.1.0&q=85', '#', 2),
('3', 'Vikram Singh', 'Design Lead', 'https://images.pexels.com/photos/5349053/pexels-photo-5349053.jpeg', '#', 3),
('4', 'Sneha Rao', 'Marketing Lead', 'https://images.unsplash.com/photo-1770894807442-108cc33c0a7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3NDQyMzI4NXww&ixlib=rb-4.1.0&q=85', '#', 4),
('5', 'Karthik Reddy', 'Partnership Lead', 'https://images.pexels.com/photos/5349053/pexels-photo-5349053.jpeg', '#', 5),
('6', 'Priyanka Joshi', 'Operations Lead', 'https://images.unsplash.com/photo-1770894807442-108cc33c0a7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3NDQyMzI4NXww&ixlib=rb-4.1.0&q=85', '#', 6);

-- Insert initial data for events
INSERT INTO events (id, title, theme, year, description, image_url, attendees) VALUES
('1', 'TEDxAmityUniversityBengaluru 2024', 'Reimagine Tomorrow', '2024', 'An evening of visionary talks exploring innovation, sustainability, and human potential.', 'https://images.unsplash.com/photo-7991495/pexels-photo-7991495.jpeg', '500+'),
('2', 'TEDxAmityUniversityBengaluru 2023', 'Breaking Barriers', '2023', 'Celebrating stories of resilience, creativity, and groundbreaking achievements.', 'https://images.unsplash.com/photo-1542403412761-3cc3eb570011?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHw0fHxjaW5lbWF0aWMlMjBkYXJrJTIwc3RhZ2UlMjBsaWdodGluZyUyMHJlZHxlbnwwfHx8fDE3NzQ0MjMyODJ8MA&ixlib=rb-4.1.0&q=85', '450+'),
('3', 'TEDxAmityUniversityBengaluru 2022', 'Sparks of Change', '2022', 'Igniting conversations about technology, art, and social transformation.', 'https://images.pexels.com/photos/7991495/pexels-photo-7991495.jpeg', '400+');

-- Note: You'll need to manually create a storage bucket named 'tedx-assets' in Supabase Storage
-- and set it to public for image uploads to work.
