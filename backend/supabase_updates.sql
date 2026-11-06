-- Additional Tables for TEDx Website Updates

-- Gallery rows table (for horizontal scrolling gallery)
CREATE TABLE IF NOT EXISTS gallery_rows (
    id TEXT PRIMARY KEY,
    row_number INTEGER NOT NULL CHECK (row_number IN (1, 2, 3)),
    image_url TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Teaser content (video or poster for hero section)
CREATE TABLE IF NOT EXISTS teaser_content (
    id TEXT PRIMARY KEY,
    content_type TEXT NOT NULL CHECK (content_type IN ('video', 'poster')),
    video_url TEXT,
    poster_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Active events (for registration)
CREATE TABLE IF NOT EXISTS active_events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    theme TEXT NOT NULL,
    event_date TEXT NOT NULL,
    venue TEXT NOT NULL,
    description TEXT NOT NULL,
    is_paid BOOLEAN DEFAULT false,
    fee_amount TEXT,
    payment_qr_url TEXT,
    payment_link TEXT,
    upi_id TEXT,
    total_seats INTEGER NOT NULL,
    seats_filled INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    registration_closes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Event sessions
CREATE TABLE IF NOT EXISTS event_sessions (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES active_events(id) ON DELETE CASCADE,
    slot_name TEXT NOT NULL,
    speaker_name TEXT,
    description TEXT,
    duration TEXT,
    time TEXT NOT NULL,
    seat_limit INTEGER,
    seats_filled INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Registrations
CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES active_events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    enrollment_number TEXT NOT NULL,
    dob TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL,
    school TEXT NOT NULL,
    selected_sessions TEXT[],
    payment_receipt_url TEXT,
    payment_receipt_hash TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Recruitment configuration
CREATE TABLE IF NOT EXISTS recruitment_config (
    id TEXT PRIMARY KEY,
    is_active BOOLEAN DEFAULT false,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    submission_limit INTEGER,
    submissions_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Recruitment roles
CREATE TABLE IF NOT EXISTS recruitment_roles (
    id TEXT PRIMARY KEY,
    department TEXT NOT NULL,
    role_name TEXT NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Recruitment submissions
CREATE TABLE IF NOT EXISTS recruitment_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    enrollment_number TEXT NOT NULL,
    dob TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL,
    school TEXT NOT NULL,
    department TEXT NOT NULL,
    role TEXT NOT NULL,
    proficiency_level TEXT,
    experience TEXT,
    portfolio_link TEXT,
    optional_role TEXT,
    optional_proficiency TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Attendance records
CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES active_events(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL REFERENCES event_sessions(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    enrollment_number TEXT NOT NULL,
    status TEXT DEFAULT 'present',
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE gallery_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaser_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view gallery" ON gallery_rows FOR SELECT USING (true);
CREATE POLICY "Public can view teaser" ON teaser_content FOR SELECT USING (true);
CREATE POLICY "Public can view active events" ON active_events FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view sessions" ON event_sessions FOR SELECT USING (true);
CREATE POLICY "Public can view recruitment config" ON recruitment_config FOR SELECT USING (true);
CREATE POLICY "Public can view recruitment roles" ON recruitment_roles FOR SELECT USING (true);

-- Public insert for registrations and recruitment
CREATE POLICY "Anyone can register" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can apply for recruitment" ON recruitment_submissions FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "Service role manages all" ON gallery_rows FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role manages teaser" ON teaser_content FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role manages active events" ON active_events FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role manages sessions" ON event_sessions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role manages registrations" ON registrations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role manages recruitment" ON recruitment_config FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role manages roles" ON recruitment_roles FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role manages submissions" ON recruitment_submissions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role manages attendance" ON attendance FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
