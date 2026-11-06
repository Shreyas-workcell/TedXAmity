# TEDxAmityUniversityBengaluru Website

A premium, cinematic TEDx event website with custom flame cursor, dynamic content management, and event galleries.

## Features

### Frontend
- ✨ Custom animated flame cursor with trail effect
- 🎨 Dark cinematic theme with TED red accents
- ⚡ Particle effects in hero section using tsparticles
- 🎯 Smooth scroll navigation with glassmorphism navbar
- 📱 Fully responsive design
- 🎭 Framer Motion animations throughout
- 🖼️ Event gallery modals with image viewer
- 👥 Dynamic speakers, team, and events sections

### Backend & Admin
- 🔐 Secure admin authentication (JWT-based)
- 📊 Full CRUD operations for speakers, events, and team
- 🖼️ Event gallery management (add/remove images)
- ☁️ Supabase integration for data storage
- 🎯 RESTful API architecture
- 🔄 Real-time data updates

## Tech Stack

**Frontend:**
- React 19
- Tailwind CSS
- Framer Motion (animations)
- tsparticles (particle effects)
- Radix UI / Shadcn (UI components)
- Lucide React (icons)
- Axios (API calls)

**Backend:**
- FastAPI (Python)
- Supabase (PostgreSQL database)
- JWT Authentication
- CORS enabled

## Setup Instructions

### 1. Supabase Database Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy the SQL from `/app/backend/supabase_setup.sql`
3. Run it in Supabase SQL Editor
4. Create a storage bucket named `tedx-assets` (set to public)

### 2. Environment Variables

Backend `.env` is already configured with:
```
SUPABASE_URL=https://qbcpuhdawcngejdbrcqp.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-key>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TEDxAdmin@2026
```

Frontend `.env` is already configured.

### 3. Running the Application

The application is already running:
- **Frontend**: https://tedx-amity-bengaluru.preview.emergentagent.com
- **Backend API**: https://tedx-amity-bengaluru.preview.emergentagent.com/api
- **Admin Dashboard**: https://tedx-amity-bengaluru.preview.emergentagent.com/admin

### 4. Admin Login

Navigate to `/admin` and use:
- **Username**: `admin`
- **Password**: `TEDxAdmin@2026`

## Admin Dashboard Features

### Manage Speakers
- Add new speakers with name, designation, talk title, bio, image, and year
- Edit existing speakers
- Delete speakers
- Speakers appear automatically on the main website

### Manage Events
- Create past events with theme, description, images, and year
- Edit event details
- Add event gallery images (click "Gallery" button)
- Add multiple images with captions
- Delete events

### Manage Team
- Add team members with name, role, image, LinkedIn URL
- Set display order for team members
- Edit/delete team members
- Team updates appear instantly on website

### Event Galleries
- Click "Gallery" on any event in admin
- Add images via URL
- Add captions to images
- Delete individual images
- Users can view galleries by clicking events on main site

## Custom Cursor Feature

The website features a custom animated flame cursor that:
- Replaces the default cursor with a flame icon
- Creates glowing trail effects
- Has smooth animations
- Uses TEDx brand colors (red/orange)
- Pure CSS + JavaScript implementation

## API Endpoints

### Public Endpoints
- `GET /api/speakers` - Get all speakers
- `GET /api/events` - Get all events
- `GET /api/events/{event_id}` - Get single event
- `GET /api/events/{event_id}/images` - Get event gallery
- `GET /api/team` - Get all team members
- `GET /api/upcoming-event` - Get upcoming event details

### Admin Endpoints (Requires JWT Token)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token
- `POST/PUT/DELETE /api/admin/speakers` - Manage speakers
- `POST/PUT/DELETE /api/admin/events` - Manage events
- `POST/DELETE /api/admin/events/{event_id}/images` - Manage event gallery
- `POST/PUT/DELETE /api/admin/team` - Manage team members
- `POST /api/admin/upload` - Upload files to Supabase storage

## Database Schema

### Tables
- `speakers` - Speaker information
- `events` - Past events
- `event_images` - Gallery images for events
- `team_members` - Team member profiles
- `upcoming_events` - Future event details

All tables have Row Level Security enabled with public read access and service role write access.

## Design Features

### Typography
- **Headings**: Playfair Display (elegant serif)
- **Body**: Manrope (clean sans-serif)

### Color Palette
- **Background**: #000000 (black), #0A0A0A (dark cards)
- **Brand Red**: #E62B1E (TED red)
- **Ember Glow**: #FF4D2E (hover states)

### Animations
- Particle effects floating upward
- Scroll-triggered fade-in animations
- Card hover effects with glow
- Smooth navigation transitions
- Modal slide-in animations

## Usage Guide

### Adding a New Event
1. Login to admin dashboard
2. Go to "Events" tab
3. Click "Add New event"
4. Fill in all details (title, theme, year, description, image URL, attendees)
5. Save
6. Click "Gallery" to add event photos
7. Add multiple images with captions

### Adding a Speaker
1. Login to admin
2. Go to "Speakers" tab
3. Click "Add New speaker"
4. Enter speaker details and image URL
5. Save - speaker appears on main site immediately

### Updating Team
1. Login to admin
2. Go to "Team" tab
3. Add/Edit team members
4. Set display order (1, 2, 3...)  for proper arrangement
5. Changes reflect instantly on website

## Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

---

**Built with ❤️ for TEDxAmityUniversityBengaluru**
