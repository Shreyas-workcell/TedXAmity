import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { GripVertical, Plus, Save, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BACKEND_URL } from '@/lib/api';

const MIN_GALLERY_IMAGES = 5;
const MAX_GALLERY_IMAGES = 12;

const mapIndexToGalleryPosition = (index) => ({
  row_number: Math.floor(index / 4) + 1,
  position: (index % 4) + 1,
});

const sortGalleryImages = (images) => (
  [...images].sort((a, b) => {
    if (a.row_number !== b.row_number) {
      return a.row_number - b.row_number;
    }

    return a.position - b.position;
  })
);

const GalleryTab = ({ token }) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/gallery`);
      setGalleryImages(sortGalleryImages(res.data));
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const canAddMore = galleryImages.length < MAX_GALLERY_IMAGES;
  const canSave = galleryImages.length >= MIN_GALLERY_IMAGES && galleryImages.length <= MAX_GALLERY_IMAGES;

  const gallerySummary = useMemo(() => {
    if (galleryImages.length < MIN_GALLERY_IMAGES) {
      return `Add at least ${MIN_GALLERY_IMAGES - galleryImages.length} more image${MIN_GALLERY_IMAGES - galleryImages.length === 1 ? '' : 's'} to save.`;
    }

    if (galleryImages.length > MAX_GALLERY_IMAGES) {
      return `Remove ${galleryImages.length - MAX_GALLERY_IMAGES} image${galleryImages.length - MAX_GALLERY_IMAGES === 1 ? '' : 's'} to stay within the ${MAX_GALLERY_IMAGES} image limit.`;
    }

    return 'Gallery is ready to save to the website.';
  }, [galleryImages.length]);

  const uploadAsset = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery');

    const response = await axios.post(`${BACKEND_URL}/api/admin/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  };

  const addImage = (url) => {
    if (!url) return;
    if (!canAddMore) {
      alert(`You can only keep up to ${MAX_GALLERY_IMAGES} gallery images.`);
      return;
    }

    setGalleryImages((current) => [
      ...current,
      {
        id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        image_url: url,
        ...mapIndexToGalleryPosition(current.length),
      }
    ]);
    setImageUrl('');
  };

  const handleUrlAdd = () => {
    addImage(imageUrl.trim());
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!canAddMore) {
      alert(`You can only keep up to ${MAX_GALLERY_IMAGES} gallery images.`);
      event.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const url = await uploadAsset(file);
      addImage(url);
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeImage = (imageId) => {
    setGalleryImages((current) => current
      .filter((image) => image.id !== imageId)
      .map((image, index) => ({
        ...image,
        ...mapIndexToGalleryPosition(index),
      })));
  };

  const moveImage = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= galleryImages.length) return;

    const reordered = [...galleryImages];
    const [movedImage] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, movedImage);

    setGalleryImages(reordered.map((image, mappedIndex) => ({
      ...image,
      ...mapIndexToGalleryPosition(mappedIndex),
    })));
  };

  const handleSave = async () => {
    if (!canSave) {
      alert(`Please keep between ${MIN_GALLERY_IMAGES} and ${MAX_GALLERY_IMAGES} images before saving.`);
      return;
    }

    if (!window.confirm('Save this gallery order to the website?')) {
      return;
    }

    setSaving(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const existing = await axios.get(`${BACKEND_URL}/api/gallery`);

      await Promise.all(
        existing.data.map((image) => axios.delete(`${BACKEND_URL}/api/admin/gallery/${image.id}`, config))
      );

      for (const [index, image] of galleryImages.entries()) {
        const mappedPosition = mapIndexToGalleryPosition(index);
        await axios.post(`${BACKEND_URL}/api/admin/gallery`, {
          row_number: mappedPosition.row_number,
          position: mappedPosition.position,
          image_url: image.image_url,
        }, config);
      }

      await loadGallery();
      alert('Gallery updated successfully');
    } catch (error) {
      console.error('Error saving gallery:', error);
      alert('Error saving gallery');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-4">Gallery Management</h2>
        <p className="text-white/60 font-sans">
          Build one website gallery with a minimum of {MIN_GALLERY_IMAGES} and a maximum of {MAX_GALLERY_IMAGES} images.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/50 p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="flex-1">
            <div className="flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-8 hover:border-brand-red cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading || !canAddMore}
              />
              <div className="text-center">
                <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/60 font-sans text-sm">
                  {uploading ? 'Uploading...' : 'Click to upload image'}
                </p>
              </div>
            </div>
          </label>

          <div className="text-white/40 font-sans text-center">OR</div>

          <div className="flex-1 flex space-x-2">
            <Input
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-black border-white/20 text-white"
              disabled={!canAddMore}
            />
            <Button
              onClick={handleUrlAdd}
              className="bg-brand-red hover:bg-brand-ember"
              disabled={!canAddMore}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-sans">
          <p className="text-white/70">
            Current images: <span className="text-brand-red font-bold">{galleryImages.length}</span> / {MAX_GALLERY_IMAGES}
          </p>
          <p className={`${canSave ? 'text-emerald-400' : 'text-amber-400'}`}>
            {gallerySummary}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h3 className="font-sans font-bold text-white">Gallery Order</h3>
        <Button
          onClick={handleSave}
          className="bg-brand-red hover:bg-brand-ember"
          disabled={!canSave || saving}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Gallery'}
        </Button>
      </div>

      {galleryImages.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl">
          <p className="text-white/40">No gallery images added yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((image, index) => (
            <div key={image.id} className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
              <div className="relative group">
                <img
                  src={image.image_url}
                  alt={`Gallery item ${index + 1}`}
                  className="w-full h-56 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-white font-sans text-sm">Image {String(index + 1).padStart(2, '0')}</p>
                  <p className="text-white/40 text-xs">Website order position</p>
                </div>

                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-white/30" />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-white/20"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                    >
                      Up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-white/20"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === galleryImages.length - 1}
                    >
                      Down
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryTab;
