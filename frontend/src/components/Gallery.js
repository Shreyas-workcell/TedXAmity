import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/api';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const dragStateRef = useRef({ isDragging: false, startX: 0 });
  const wheelLockRef = useRef(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/gallery`);
      const images = [...response.data].sort((a, b) => {
        if (a.row_number !== b.row_number) {
          return a.row_number - b.row_number;
        }

        return a.position - b.position;
      });

      setGalleryImages(images);
      setActiveIndex((current) => clamp(current, 0, Math.max(images.length - 1, 0)));
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectIndex = (index) => {
    setActiveIndex(clamp(index, 0, Math.max(galleryImages.length - 1, 0)));
  };

  const stepCarousel = (direction) => {
    setActiveIndex((current) => clamp(current + direction, 0, Math.max(galleryImages.length - 1, 0)));
  };

  const handleWheel = (event) => {
    if (galleryImages.length <= 1 || wheelLockRef.current || Math.abs(event.deltaY) < 8) {
      return;
    }

    event.preventDefault();
    wheelLockRef.current = true;
    stepCarousel(event.deltaY > 0 ? 1 : -1);

    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 220);
  };

  const handlePointerDown = (event) => {
    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
    };
  };

  const handlePointerMove = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || galleryImages.length <= 1) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) < 55) {
      return;
    }

    stepCarousel(deltaX < 0 ? 1 : -1);
    dragStateRef.current.startX = event.clientX;
  };

  const handlePointerUp = () => {
    dragStateRef.current.isDragging = false;
  };

  if (loading) {
    return (
      <section className="py-20 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <section className="py-24 px-6 lg:px-12 bg-black" data-testid="gallery-section">
        <div className="max-w-7xl mx-auto">
          <p className="section-overline mb-6">Moments Captured</p>
          <h2 className="font-display font-bold text-4xl lg:text-6xl text-white mb-4 tracking-tighter">
            Experience the Energy
          </h2>
          <p className="text-white/60 font-sans text-lg max-w-2xl mb-12">
            Add images from the admin dashboard to bring this gallery to life.
          </p>
          <div className="flex items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-24 text-center">
            <p className="text-white/40 font-sans text-sm uppercase tracking-[0.3em]">
              No gallery images available yet
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section relative overflow-hidden bg-black px-6 py-24 lg:px-12" data-testid="gallery-section">
      <div className="gallery-ambient-glow" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-overline mb-6"
          >
            Moments Captured
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display font-bold text-4xl lg:text-6xl text-white mb-4 tracking-tighter"
          >
            A Carousel of TEDx Memories
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/60 font-sans text-lg max-w-2xl"
          >
            Scroll, drag, or tap through the moments that shaped the TEDx Amity University Bengaluru experience.
          </motion.p>
        </div>

        <div className="gallery-layout-pointer hidden lg:block">
          <div className="gallery-layout-rail" />
          <div className="gallery-layout-copy">
            Archive of sparks,
            <br />
            stories, stages,
            <br />
            and shared ideas.
          </div>
        </div>

        <div
          className="gallery-carousel-shell relative"
          onWheel={handleWheel}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            className="gallery-carousel"
            onPointerDown={handlePointerDown}
            role="region"
            aria-label="TEDx gallery carousel"
          >
            {galleryImages.map((image, index) => {
              const offset = index - activeIndex;
              const zIndex = galleryImages.length - Math.abs(offset);
              const number = String(index + 1).padStart(2, '0');
              const title = image.caption || `TEDx Moment ${number}`;

              return (
                <button
                  key={image.id}
                  type="button"
                  className={`gallery-carousel-item ${index === activeIndex ? 'is-active' : ''}`}
                  style={{
                    '--carousel-offset': offset,
                    '--carousel-z-index': zIndex,
                  }}
                  onClick={() => selectIndex(index)}
                  aria-label={`View gallery image ${number}`}
                >
                  <div className="gallery-carousel-box">
                    <div className="gallery-carousel-title">{title}</div>
                    <div className="gallery-carousel-num">{number}</div>
                    <img
                      src={image.image_url}
                      alt={title}
                      className="gallery-carousel-image"
                      loading={index < 3 ? 'eager' : 'lazy'}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="gallery-carousel-controls">
            <button
              type="button"
              className="gallery-control-button"
              onClick={() => stepCarousel(-1)}
              disabled={activeIndex === 0}
              aria-label="Previous gallery image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="gallery-carousel-status">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-white/30">/</span>
              <span>{String(galleryImages.length).padStart(2, '0')}</span>
            </div>

            <button
              type="button"
              className="gallery-control-button"
              onClick={() => stepCarousel(1)}
              disabled={activeIndex === galleryImages.length - 1}
              aria-label="Next gallery image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
