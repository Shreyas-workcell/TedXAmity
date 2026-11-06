import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BACKEND_URL } from '@/lib/api';

const TeaserTab = ({ token }) => {
  const [teaser, setTeaser] = useState(null);
  const [contentType, setContentType] = useState('poster');
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadTeaser();
  }, []);

  const loadTeaser = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/teaser`);
      if (res.data) {
        setTeaser(res.data);
        setContentType(res.data.content_type);
        setVideoUrl(res.data.video_url || '');
        setPosterUrl(res.data.poster_url || '');
      }
    } catch (error) {
      console.error('Error loading teaser:', error);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'teaser');

      const uploadRes = await axios.post(`${BACKEND_URL}/api/admin/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const url = uploadRes.data.url;
      if (type === 'video') {
        setVideoUrl(url);
      } else {
        setPosterUrl(url);
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const data = {
        content_type: contentType,
        video_url: contentType === 'video' ? videoUrl : null,
        poster_url: posterUrl,
        is_active: true
      };

      if (teaser) {
        await axios.put(`${BACKEND_URL}/api/admin/teaser/${teaser.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/teaser`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert('Teaser updated successfully!');
      loadTeaser();
    } catch (error) {
      alert('Error saving teaser');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-4">Hero Teaser Content</h2>
        <p className="text-white/60 font-sans">Upload video or poster for the hero section</p>
      </div>

      {/* Content Type */}
      <div className="bg-black/50 border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="font-sans font-bold text-white">Content Type</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setContentType('video')}
            className={`px-6 py-3 rounded-lg font-sans font-medium transition ${
              contentType === 'video'
                ? 'bg-brand-red text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Video
          </button>
          <button
            onClick={() => setContentType('poster')}
            className={`px-6 py-3 rounded-lg font-sans font-medium transition ${
              contentType === 'poster'
                ? 'bg-brand-red text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Poster Image
          </button>
        </div>
      </div>

      {/* Video Upload */}
      {contentType === 'video' && (
        <div className="bg-black/50 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="font-sans font-bold text-white">Video</h3>
          <label>
            <div className="flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-8 hover:border-brand-red cursor-pointer transition">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, 'video')}
                className="hidden"
                disabled={uploading}
              />
              <div className="text-center">
                <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/60 font-sans text-sm">
                  {uploading ? 'Uploading...' : 'Click to upload video'}
                </p>
              </div>
            </div>
          </label>
          <Input
            placeholder="Or paste video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="bg-black border-white/20 text-white"
          />
          {videoUrl && (
            <video src={videoUrl} controls className="w-full rounded-lg" />
          )}
        </div>
      )}

      {/* Poster Upload */}
      <div className="bg-black/50 border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="font-sans font-bold text-white">Poster Image {contentType === 'video' && '(Thumbnail)'}</h3>
        <label>
          <div className="flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-8 hover:border-brand-red cursor-pointer transition">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'poster')}
              className="hidden"
              disabled={uploading}
            />
            <div className="text-center">
              <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
              <p className="text-white/60 font-sans text-sm">
                {uploading ? 'Uploading...' : 'Click to upload poster'}
              </p>
            </div>
          </div>
        </label>
        <Input
          placeholder="Or paste image URL"
          value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
          className="bg-black border-white/20 text-white"
        />
        {posterUrl && (
          <img src={posterUrl} alt="Poster" className="w-full rounded-lg" />
        )}
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-brand-red hover:bg-brand-ember text-white font-bold py-4"
      >
        Save Teaser Content
      </Button>
    </div>
  );
};

export default TeaserTab;
