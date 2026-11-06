from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import jwt
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_SERVICE_KEY']
supabase: Client = create_client(supabase_url, supabase_key)

# Admin credentials
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'TEDxAdmin@2026')
JWT_SECRET = os.environ.get('JWT_SECRET', 'tedx-secret-key-2026')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Pydantic Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Speaker(BaseModel):
    id: Optional[str] = None
    name: str
    designation: str
    talk_title: str
    bio: str
    image_url: str
    year: str
    event_id: Optional[str] = None

class TeamMember(BaseModel):
    id: Optional[str] = None
    name: str
    role: str
    image_url: str
    linkedin_url: Optional[str] = "#"
    order: Optional[int] = 0

class Event(BaseModel):
    id: Optional[str] = None
    title: str
    theme: str
    year: str
    description: str
    image_url: str
    attendees: str
    date: Optional[str] = None
    venue: Optional[str] = None

class EventImage(BaseModel):
    id: Optional[str] = None
    event_id: str
    image_url: str
    caption: Optional[str] = None

class UpcomingEvent(BaseModel):
    id: Optional[str] = None
    title: str
    theme: str
    date: str
    venue: str
    seats: str
    description: str
    poster_url: Optional[str] = None

class GalleryRow(BaseModel):
    id: Optional[str] = None
    row_number: int
    image_url: str
    position: int

class TeaserContent(BaseModel):
    id: Optional[str] = None
    content_type: str
    video_url: Optional[str] = None
    poster_url: Optional[str] = None
    is_active: bool = True

class ActiveEvent(BaseModel):
    id: Optional[str] = None
    title: str
    theme: str
    event_date: str
    venue: str
    description: str
    is_paid: bool = False
    fee_amount: Optional[str] = None
    payment_qr_url: Optional[str] = None
    payment_link: Optional[str] = None
    upi_id: Optional[str] = None
    total_seats: int
    seats_filled: int = 0
    is_active: bool = True
    registration_closes: Optional[str] = None

# Auth helper functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth endpoints
@api_router.post("/admin/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin):
    if credentials.username == ADMIN_USERNAME and credentials.password == ADMIN_PASSWORD:
        access_token = create_access_token({"sub": credentials.username, "role": "admin"})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@api_router.get("/admin/verify")
async def verify_admin(payload: dict = Depends(verify_token)):
    return {"status": "authenticated", "user": payload.get("sub")}

# Speaker endpoints
@api_router.get("/speakers", response_model=List[Speaker])
async def get_speakers():
    return fetch_rows('speakers', transform=lambda query: query.order('year', desc=True))

@api_router.post("/admin/speakers", response_model=Speaker)
async def create_speaker(speaker: Speaker, payload: dict = Depends(verify_token)):
    speaker_dict = speaker.model_dump()
    speaker_dict['id'] = str(uuid.uuid4())
    response = supabase.table('speakers').insert(speaker_dict).execute()
    return response.data[0]

@api_router.put("/admin/speakers/{speaker_id}", response_model=Speaker)
async def update_speaker(speaker_id: str, speaker: Speaker, payload: dict = Depends(verify_token)):
    speaker_dict = speaker.model_dump()
    speaker_dict.pop('id', None)
    response = supabase.table('speakers').update(speaker_dict).eq('id', speaker_id).execute()
    return response.data[0]

@api_router.delete("/admin/speakers/{speaker_id}")
async def delete_speaker(speaker_id: str, payload: dict = Depends(verify_token)):
    supabase.table('speakers').delete().eq('id', speaker_id).execute()
    return {"status": "deleted"}

# Team endpoints
@api_router.get("/team", response_model=List[TeamMember])
async def get_team():
    return fetch_rows('team_members', transform=lambda query: query.order('order'))

@api_router.post("/admin/team", response_model=TeamMember)
async def create_team_member(member: TeamMember, payload: dict = Depends(verify_token)):
    member_dict = member.model_dump()
    member_dict['id'] = str(uuid.uuid4())
    response = supabase.table('team_members').insert(member_dict).execute()
    return response.data[0]

@api_router.put("/admin/team/{member_id}", response_model=TeamMember)
async def update_team_member(member_id: str, member: TeamMember, payload: dict = Depends(verify_token)):
    member_dict = member.model_dump()
    member_dict.pop('id', None)
    response = supabase.table('team_members').update(member_dict).eq('id', member_id).execute()
    return response.data[0]

@api_router.delete("/admin/team/{member_id}")
async def delete_team_member(member_id: str, payload: dict = Depends(verify_token)):
    supabase.table('team_members').delete().eq('id', member_id).execute()
    return {"status": "deleted"}

# Event endpoints
@api_router.get("/events", response_model=List[Event])
async def get_events():
    return fetch_rows('events', transform=lambda query: query.order('year', desc=True))

@api_router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    response = supabase.table('events').select("*").eq('id', event_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    return response.data[0]

@api_router.post("/admin/events", response_model=Event)
async def create_event(event: Event, payload: dict = Depends(verify_token)):
    event_dict = event.model_dump()
    event_dict['id'] = str(uuid.uuid4())
    response = supabase.table('events').insert(event_dict).execute()
    return response.data[0]

@api_router.put("/admin/events/{event_id}", response_model=Event)
async def update_event(event_id: str, event: Event, payload: dict = Depends(verify_token)):
    event_dict = event.model_dump()
    event_dict.pop('id', None)
    response = supabase.table('events').update(event_dict).eq('id', event_id).execute()
    return response.data[0]

@api_router.delete("/admin/events/{event_id}")
async def delete_event(event_id: str, payload: dict = Depends(verify_token)):
    supabase.table('events').delete().eq('id', event_id).execute()
    return {"status": "deleted"}

# Event images endpoints
@api_router.get("/events/{event_id}/images", response_model=List[EventImage])
async def get_event_images(event_id: str):
    return fetch_rows('event_images', transform=lambda query: query.eq('event_id', event_id))

@api_router.post("/admin/events/{event_id}/images", response_model=EventImage)
async def add_event_image(event_id: str, image: EventImage, payload: dict = Depends(verify_token)):
    image_dict = image.model_dump()
    image_dict['id'] = str(uuid.uuid4())
    image_dict['event_id'] = event_id
    response = supabase.table('event_images').insert(image_dict).execute()
    return response.data[0]

@api_router.delete("/admin/events/images/{image_id}")
async def delete_event_image(image_id: str, payload: dict = Depends(verify_token)):
    supabase.table('event_images').delete().eq('id', image_id).execute()
    return {"status": "deleted"}

# Upcoming event endpoints
@api_router.get("/upcoming-event")
async def get_upcoming_event():
    rows = fetch_rows('upcoming_events', empty_default=[], transform=lambda query: query.limit(1))
    if rows:
        return rows[0]
    return None

@api_router.post("/admin/upcoming-event", response_model=UpcomingEvent)
async def create_upcoming_event(event: UpcomingEvent, payload: dict = Depends(verify_token)):
    # Delete existing upcoming event
    supabase.table('upcoming_events').delete().neq('id', '').execute()
    
    event_dict = event.model_dump()
    event_dict['id'] = str(uuid.uuid4())
    response = supabase.table('upcoming_events').insert(event_dict).execute()
    return response.data[0]

@api_router.put("/admin/upcoming-event/{event_id}", response_model=UpcomingEvent)
async def update_upcoming_event(event_id: str, event: UpcomingEvent, payload: dict = Depends(verify_token)):
    event_dict = event.model_dump()
    event_dict.pop('id', None)
    response = supabase.table('upcoming_events').update(event_dict).eq('id', event_id).execute()
    return response.data[0]


# Gallery endpoints
@api_router.get("/gallery")
async def get_gallery():
    return fetch_rows('gallery_rows', transform=lambda query: query.order('row_number').order('position'))

@api_router.post("/admin/gallery", response_model=GalleryRow)
async def add_gallery_image(image: GalleryRow, payload: dict = Depends(verify_token)):
    image_dict = image.model_dump()
    image_dict['id'] = str(uuid.uuid4())
    response = supabase.table('gallery_rows').insert(image_dict).execute()
    return response.data[0]

@api_router.put("/admin/gallery/{image_id}", response_model=GalleryRow)
async def update_gallery_image(image_id: str, image: GalleryRow, payload: dict = Depends(verify_token)):
    image_dict = image.model_dump()
    image_dict.pop('id', None)
    response = supabase.table('gallery_rows').update(image_dict).eq('id', image_id).execute()
    return response.data[0]

@api_router.delete("/admin/gallery/{image_id}")
async def delete_gallery_image(image_id: str, payload: dict = Depends(verify_token)):
    supabase.table('gallery_rows').delete().eq('id', image_id).execute()
    return {"status": "deleted"}

# Teaser endpoints
@api_router.get("/teaser")
async def get_teaser():
    rows = fetch_rows(
        'teaser_content',
        empty_default=[],
        transform=lambda query: query.eq('is_active', True).limit(1),
    )
    if rows:
        return rows[0]
    return None

@api_router.post("/admin/teaser", response_model=TeaserContent)
async def create_teaser(teaser: TeaserContent, payload: dict = Depends(verify_token)):
    # Deactivate all existing teasers
    supabase.table('teaser_content').update({'is_active': False}).neq('id', '').execute()
    
    teaser_dict = teaser.model_dump()
    teaser_dict['id'] = str(uuid.uuid4())
    response = supabase.table('teaser_content').insert(teaser_dict).execute()
    return response.data[0]

@api_router.put("/admin/teaser/{teaser_id}", response_model=TeaserContent)
async def update_teaser(teaser_id: str, teaser: TeaserContent, payload: dict = Depends(verify_token)):
    teaser_dict = teaser.model_dump()
    teaser_dict.pop('id', None)
    response = supabase.table('teaser_content').update(teaser_dict).eq('id', teaser_id).execute()
    return response.data[0]

# Active events endpoints (for registration)
@api_router.get("/active-events")
async def get_active_events():
    return fetch_rows('active_events', transform=lambda query: query.eq('is_active', True))

@api_router.get("/active-events/{event_id}")
async def get_active_event(event_id: str):
    response = supabase.table('active_events').select("*").eq('id', event_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    return response.data[0]

# File upload endpoint
@api_router.post("/admin/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form("general"),
    payload: dict = Depends(verify_token)
):
    try:
        file_ext = file.filename.split('.')[-1]
        file_name = f"{folder}/{uuid.uuid4()}.{file_ext}"
        
        file_content = await file.read()
        response = supabase.storage.from_('tedx-assets').upload(
            file_name,
            file_content,
            {"content-type": file.content_type}
        )
        
        public_url = supabase.storage.from_('tedx-assets').get_public_url(file_name)
        return {"url": public_url, "path": file_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Registration submission endpoint
@api_router.post("/register")
async def submit_registration(registration: dict):
    try:
        import hashlib
        
        # Calculate hash of payment receipt for duplicate detection
        payment_hash = None
        if registration.get('payment_receipt_url'):
            payment_hash = hashlib.md5(registration['payment_receipt_url'].encode()).hexdigest()
            
            # Check for duplicate payment receipt
            existing = supabase.table('registrations').select('id').eq('payment_receipt_hash', payment_hash).execute()
            if existing.data:
                raise HTTPException(status_code=400, detail="This payment receipt has already been used")
        
        reg_dict = {
            'id': str(uuid.uuid4()),
            'event_id': registration['event_id'],
            'name': registration['name'],
            'enrollment_number': registration['enrollment_number'],
            'dob': registration['dob'],
            'contact_number': registration['contact_number'],
            'email': registration['email'],
            'course': registration['course'],
            'school': registration['school'],
            'selected_sessions': registration.get('selected_sessions', []),
            'payment_receipt_url': registration.get('payment_receipt_url', ''),
            'payment_receipt_hash': payment_hash,
            'status': 'pending'
        }
        
        # Insert registration
        response = supabase.table('registrations').insert(reg_dict).execute()
        
        # Update seats filled for event
        event = supabase.table('active_events').select('seats_filled').eq('id', registration['event_id']).execute()
        if event.data:
            new_count = event.data[0]['seats_filled'] + 1
            supabase.table('active_events').update({'seats_filled': new_count}).eq('id', registration['event_id']).execute()
        
        # Update session seats if sessions selected
        for session_id in registration.get('selected_sessions', []):
            session = supabase.table('event_sessions').select('seats_filled').eq('id', session_id).execute()
            if session.data:
                new_count = session.data[0]['seats_filled'] + 1
                supabase.table('event_sessions').update({'seats_filled': new_count}).eq('id', session_id).execute()
        
        return {"status": "success", "registration_id": response.data[0]['id']}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Admin - Get all registrations
@api_router.get("/admin/registrations")
async def get_registrations(payload: dict = Depends(verify_token)):
    response = supabase.table('registrations').select("*").order('created_at', desc=True).execute()
    return response.data


# Recruitment endpoints
@api_router.get("/recruitment-config")
async def get_recruitment_config():
    rows = fetch_rows(
        'recruitment_config',
        empty_default=[],
        transform=lambda query: query.eq('is_active', True).limit(1),
    )
    if rows:
        return rows[0]
    return {"is_active": False}

@api_router.get("/recruitment-roles")
async def get_recruitment_roles():
    return fetch_rows('recruitment_roles', transform=lambda query: query.eq('is_available', True))

@api_router.post("/recruitment/apply")
async def submit_recruitment(application: dict):
    try:
        app_dict = {
            'id': str(uuid.uuid4()),
            **application,
            'status': 'pending'
        }
        response = supabase.table('recruitment_submissions').insert(app_dict).execute()
        
        # Update submissions count
        config = supabase.table('recruitment_config').select('submissions_count').eq('is_active', True).limit(1).execute()
        if config.data:
            new_count = config.data[0]['submissions_count'] + 1
            supabase.table('recruitment_config').update({'submissions_count': new_count}).eq('is_active', True).execute()
        
        return {"status": "success", "application_id": response.data[0]['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/recruitment/submissions")
async def get_recruitment_submissions(payload: dict = Depends(verify_token)):
    response = supabase.table('recruitment_submissions').select("*").order('created_at', desc=True).execute()
    return response.data

@api_router.delete("/admin/recruitment/submissions/{submission_id}")
async def delete_recruitment_submission(submission_id: str, payload: dict = Depends(verify_token)):
    supabase.table('recruitment_submissions').delete().eq('id', submission_id).execute()
    return {"status": "deleted"}

@api_router.delete("/admin/registrations/{registration_id}")
async def delete_registration(registration_id: str, payload: dict = Depends(verify_token)):
    # Get registration to update seat counts
    reg = supabase.table('registrations').select("*").eq('id', registration_id).execute()
    if reg.data:
        registration = reg.data[0]
        
        # Update event seats
        event = supabase.table('active_events').select('seats_filled').eq('id', registration['event_id']).execute()
        if event.data:
            new_count = max(0, event.data[0]['seats_filled'] - 1)
            supabase.table('active_events').update({'seats_filled': new_count}).eq('id', registration['event_id']).execute()
        
        # Update session seats
        for session_id in registration.get('selected_sessions', []):
            session = supabase.table('event_sessions').select('seats_filled').eq('id', session_id).execute()
            if session.data:
                new_count = max(0, session.data[0]['seats_filled'] - 1)
                supabase.table('event_sessions').update({'seats_filled': new_count}).eq('id', session_id).execute()
    
    supabase.table('registrations').delete().eq('id', registration_id).execute()
    return {"status": "deleted"}

# Admin - Manage active events
@api_router.post("/admin/active-events")
async def create_active_event(event: ActiveEvent, payload: dict = Depends(verify_token)):
    event_dict = event.model_dump()
    event_dict['id'] = str(uuid.uuid4())
    response = supabase.table('active_events').insert(event_dict).execute()
    return response.data[0]

@api_router.put("/admin/active-events/{event_id}")
async def update_active_event(event_id: str, event: ActiveEvent, payload: dict = Depends(verify_token)):
    event_dict = event.model_dump()
    event_dict.pop('id', None)
    response = supabase.table('active_events').update(event_dict).eq('id', event_id).execute()
    return response.data[0]

@api_router.delete("/admin/active-events/{event_id}")
async def delete_active_event(event_id: str, payload: dict = Depends(verify_token)):
    supabase.table('active_events').delete().eq('id', event_id).execute()
    return {"status": "deleted"}

# Event sessions management
@api_router.get("/events/{event_id}/sessions")
async def get_event_sessions(event_id: str):
    response = supabase.table('event_sessions').select("*").eq('event_id', event_id).execute()
    return response.data

@api_router.post("/admin/events/{event_id}/sessions")
async def create_session(event_id: str, session: dict, payload: dict = Depends(verify_token)):
    session['id'] = str(uuid.uuid4())
    session['event_id'] = event_id
    response = supabase.table('event_sessions').insert(session).execute()
    return response.data[0]

@api_router.delete("/admin/sessions/{session_id}")
async def delete_session(session_id: str, payload: dict = Depends(verify_token)):
    supabase.table('event_sessions').delete().eq('id', session_id).execute()
    return {"status": "deleted"}


# Health check
@api_router.get("/")
async def root():
    return {"message": "TEDx API is running", "status": "healthy"}

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def parse_cors_origins() -> list[str]:
    raw_origins = os.environ.get("CORS_ORIGINS", "")
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    if origins:
        return origins

    return [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]


def fetch_rows(table: str, *, empty_default=None, transform=None):
    try:
        query = supabase.table(table).select("*")
        if transform:
            query = transform(query)
        response = query.execute()
        return response.data or (empty_default if empty_default is not None else [])
    except Exception as exc:
        logger.exception("Failed to fetch data from %s", table, exc_info=exc)
        return empty_default if empty_default is not None else []


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=parse_cors_origins(),
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
)
