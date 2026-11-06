import { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BACKEND_URL } from '@/lib/api';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [activeTab, setActiveTab] = useState('speakers');
  
  const [speakers, setSpeakers] = useState([]);
  const [events, setEvents] = useState([]);
  const [team, setTeam] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedEventForGallery, setSelectedEventForGallery] = useState(null);
  const [eventImages, setEventImages] = useState([]);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const verifyToken = async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('admin_token');
      setToken('');
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/login`, {
        username,
        password
      });
      const newToken = response.data.access_token;
      setToken(newToken);
      localStorage.setItem('admin_token', newToken);
      setIsAuthenticated(true);
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setIsAuthenticated(false);
  };

  const loadData = async () => {
    try {
      if (activeTab === 'speakers') {
        const res = await axios.get(`${BACKEND_URL}/api/speakers`);
        setSpeakers(res.data);
      } else if (activeTab === 'events') {
        const res = await axios.get(`${BACKEND_URL}/api/events`);
        setEvents(res.data);
      } else if (activeTab === 'team') {
        const res = await axios.get(`${BACKEND_URL}/api/team`);
        setTeam(res.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (activeTab === 'speakers') {
        if (editingItem) {
          await axios.put(`${BACKEND_URL}/api/admin/speakers/${editingItem.id}`, formData, config);
        } else {
          await axios.post(`${BACKEND_URL}/api/admin/speakers`, formData, config);
        }
      } else if (activeTab === 'events') {
        if (editingItem) {
          await axios.put(`${BACKEND_URL}/api/admin/events/${editingItem.id}`, formData, config);
        } else {
          await axios.post(`${BACKEND_URL}/api/admin/events`, formData, config);
        }
      } else if (activeTab === 'team') {
        if (editingItem) {
          await axios.put(`${BACKEND_URL}/api/admin/team/${editingItem.id}`, formData, config);
        } else {
          await axios.post(`${BACKEND_URL}/api/admin/team`, formData, config);
        }
      }

      setShowModal(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (activeTab === 'speakers') {
        await axios.delete(`${BACKEND_URL}/api/admin/speakers/${id}`, config);
      } else if (activeTab === 'events') {
        await axios.delete(`${BACKEND_URL}/api/admin/events/${id}`, config);
      } else if (activeTab === 'team') {
        await axios.delete(`${BACKEND_URL}/api/admin/team/${id}`, config);
      }

      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const openGalleryModal = async (event) => {
    setSelectedEventForGallery(event);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/events/${event.id}/images`);
      setEventImages(res.data);
    } catch (error) {
      setEventImages([]);
    }
    setShowGalleryModal(true);
  };

  const addEventImage = async (eventId, imageUrl, caption) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post(`${BACKEND_URL}/api/admin/events/${eventId}/images`, {
        event_id: eventId,
        image_url: imageUrl,
        caption: caption || ''
      }, config);
      
      const res = await axios.get(`${BACKEND_URL}/api/events/${eventId}/images`);
      setEventImages(res.data);
    } catch (error) {
      alert('Error adding image');
    }
  };

  const deleteEventImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`${BACKEND_URL}/api/admin/events/images/${imageId}`, config);
      
      const res = await axios.get(`${BACKEND_URL}/api/events/${selectedEventForGallery.id}/images`);
      setEventImages(res.data);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2 text-center">
            <span className="text-brand-red">TEDx</span> Admin
          </h1>
          <p className="text-white/60 text-center mb-8 font-sans">Login to manage your event</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-white/80 font-sans text-sm mb-2 block">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black border-white/20 text-white"
                required
              />
            </div>
            
            <div>
              <label className="text-white/80 font-sans text-sm mb-2 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black border-white/20 text-white"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-ember text-white font-bold"
            >
              Login
            </Button>
          </form>
          
          <p className="text-white/40 text-xs text-center mt-6 font-sans">
            Default: admin / TEDxAdmin@2026
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">
            <span className="text-brand-red">TEDx</span> Admin Dashboard
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-white/20 text-white hover:bg-brand-red"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-4 mb-8 border-b border-white/10">
          {['speakers', 'events', 'team'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-sans font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-brand-red border-b-2 border-brand-red'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <Button
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            className="bg-brand-red hover:bg-brand-ember text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New {activeTab.slice(0, -1)}
          </Button>
        </div>

        {activeTab === 'speakers' && (
          <SpeakersList speakers={speakers} onEdit={(item) => { setEditingItem(item); setShowModal(true); }} onDelete={handleDelete} />
        )}
        {activeTab === 'events' && (
          <EventsList events={events} onEdit={(item) => { setEditingItem(item); setShowModal(true); }} onDelete={handleDelete} onGallery={openGalleryModal} />
        )}
        {activeTab === 'team' && (
          <TeamList team={team} onEdit={(item) => { setEditingItem(item); setShowModal(true); }} onDelete={handleDelete} />
        )}
      </div>

      <FormModal
        show={showModal}
        onClose={() => { setShowModal(false); setEditingItem(null); }}
        onSave={handleSave}
        type={activeTab}
        editingItem={editingItem}
      />

      <GalleryModal
        show={showGalleryModal}
        onClose={() => { setShowGalleryModal(false); setSelectedEventForGallery(null); }}
        event={selectedEventForGallery}
        images={eventImages}
        onAddImage={addEventImage}
        onDeleteImage={deleteEventImage}
      />
    </div>
  );
};

const SpeakersList = ({ speakers, onEdit, onDelete }) => (
  <div className="grid gap-4">
    {speakers.map((speaker) => (
      <div key={speaker.id} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <img src={speaker.image_url} alt={speaker.name} className="w-20 h-20 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-white">{speaker.name}</h3>
            <p className="text-brand-red text-sm font-sans mb-2">{speaker.designation}</p>
            <p className="text-white/60 text-sm font-sans italic mb-2">"{speaker.talk_title}"</p>
            <p className="text-white/40 text-xs">Year: {speaker.year}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => onEdit(speaker)} variant="outline" size="sm" className="border-white/20">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(speaker.id)} variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

const EventsList = ({ events, onEdit, onDelete, onGallery }) => (
  <div className="grid gap-4">
    {events.map((event) => (
      <div key={event.id} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <img src={event.image_url} alt={event.title} className="w-24 h-24 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-white">{event.theme}</h3>
            <p className="text-white/60 text-sm font-sans mb-2">{event.description}</p>
            <div className="flex space-x-4 text-xs text-white/40">
              <span>Year: {event.year}</span>
              <span>Attendees: {event.attendees}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => onGallery(event)} variant="outline" size="sm" className="border-white/20">
            <Upload className="w-4 h-4 mr-1" /> Gallery
          </Button>
          <Button onClick={() => onEdit(event)} variant="outline" size="sm" className="border-white/20">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(event.id)} variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

const TeamList = ({ team, onEdit, onDelete }) => (
  <div className="grid gap-4">
    {team.map((member) => (
      <div key={member.id} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <img src={member.image_url} alt={member.name} className="w-20 h-20 rounded-full object-cover" />
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-white">{member.name}</h3>
            <p className="text-brand-red text-sm font-sans mb-2">{member.role}</p>
            <p className="text-white/40 text-xs">Order: {member.order || 0}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => onEdit(member)} variant="outline" size="sm" className="border-white/20">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(member.id)} variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

const FormModal = ({ show, onClose, onSave, type, editingItem }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({});
    }
  }, [editingItem, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0A] border border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {editingItem ? 'Edit' : 'Add'} {type.slice(0, -1)}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {type === 'speakers' && (
            <>
              <Input placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Input placeholder="Designation" value={formData.designation || ''} onChange={(e) => setFormData({...formData, designation: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Input placeholder="Talk Title" value={formData.talk_title || ''} onChange={(e) => setFormData({...formData, talk_title: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Textarea placeholder="Bio" value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})} required className="bg-black border-white/20 text-white" rows={4} />
              <Input placeholder="Image URL" value={formData.image_url || ''} onChange={(e) => setFormData({...formData, image_url: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Input placeholder="Year" value={formData.year || ''} onChange={(e) => setFormData({...formData, year: e.target.value})} required className="bg-black border-white/20 text-white" />
            </>
          )}
          
          {type === 'events' && (
            <>
              <Input placeholder="Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Input placeholder="Theme" value={formData.theme || ''} onChange={(e) => setFormData({...formData, theme: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Input placeholder="Year" value={formData.year || ''} onChange={(e) => setFormData({...formData, year: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} required className="bg-black border-white/20 text-white" rows={3} />
              <Input placeholder="Image URL" value={formData.image_url || ''} onChange={(e) => setFormData({...formData, image_url: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Input placeholder="Attendees (e.g., 500+)" value={formData.attendees || ''} onChange={(e) => setFormData({...formData, attendees: e.target.value})} required className="bg-black border-white/20 text-white" />
            </>
          )}
          
          {type === 'team' && (
            <>
              <Input placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Input placeholder="Role" value={formData.role || ''} onChange={(e) => setFormData({...formData, role: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Input placeholder="Image URL" value={formData.image_url || ''} onChange={(e) => setFormData({...formData, image_url: e.target.value})} required className="bg-black border-white/20 text-white" />
              <Input placeholder="LinkedIn URL" value={formData.linkedin_url || '#'} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} className="bg-black border-white/20 text-white" />
              <Input placeholder="Display Order" type="number" value={formData.order || 0} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="bg-black border-white/20 text-white" />
            </>
          )}
          
          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1 bg-brand-red hover:bg-brand-ember">Save</Button>
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 border-white/20">Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const GalleryModal = ({ show, onClose, event, images, onAddImage, onDeleteImage }) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const handleAddImage = () => {
    if (newImageUrl && event) {
      onAddImage(event.id, newImageUrl, newCaption);
      setNewImageUrl('');
      setNewCaption('');
    }
  };

  if (!show || !event) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0A] border border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Gallery: {event.theme}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="bg-black/50 p-4 rounded-xl space-y-3">
            <h3 className="font-sans font-bold text-white">Add New Image</h3>
            <Input
              placeholder="Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="bg-black border-white/20 text-white"
            />
            <Input
              placeholder="Caption (optional)"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="bg-black border-white/20 text-white"
            />
            <Button onClick={handleAddImage} className="bg-brand-red hover:bg-brand-ember w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Image
            </Button>
          </div>

          <div>
            <h3 className="font-sans font-bold text-white mb-4">Current Images ({images.length})</h3>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img src={image.image_url} alt={image.caption} className="w-full h-48 object-cover rounded-lg" />
                    {image.caption && (
                      <p className="text-white/80 text-xs mt-2 font-sans">{image.caption}</p>
                    )}
                    <button
                      onClick={() => onDeleteImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-center py-8">No images yet</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
