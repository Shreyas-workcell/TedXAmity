import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, Users, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/api';

const isVideoAsset = (url = '') => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventGallery = async (eventId) => {
    setLoadingImages(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events/${eventId}/images`);
      setEventImages(response.data);
    } catch (error) {
      console.error('Error fetching event images:', error);
      setEventImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleEventClick = async (event) => {
    setSelectedEvent(event);
    await fetchEventGallery(event.id);
  };

  const closeGallery = () => {
    setSelectedEvent(null);
    setEventImages([]);
  };

  if (loading) {
    return (
      <section id="events" className="py-32 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">Loading events...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="events" className="py-32 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-overline mb-6"
          >
            Previous Events
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display font-bold text-4xl lg:text-6xl text-white mb-16 tracking-tighter"
          >
            Our Journey
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleEventClick(event)}
                className="event-card rounded-xl overflow-hidden group cursor-pointer"
                data-testid={`event-card-${event.id}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-brand-red px-4 py-2 rounded-full text-white font-bold text-sm">
                    {event.year}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-sans">View Gallery</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-white mb-2">
                    {event.theme}
                  </h3>
                  <p className="text-white/60 text-sm font-sans mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-white/50">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{event.year}</span>
                    </div>
                    <div className="flex items-center text-white/50">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedEvent} onOpenChange={closeGallery}>
        <DialogContent className="bg-black border border-white/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto" data-testid="event-gallery-modal">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-3xl font-bold mb-2">
                  {selectedEvent.theme}
                </DialogTitle>
                <p className="text-white/60 font-sans">{selectedEvent.description}</p>
                <div className="flex items-center space-x-6 mt-4 text-sm">
                  <div className="flex items-center text-white/50">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{selectedEvent.year}</span>
                  </div>
                  <div className="flex items-center text-white/50">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{selectedEvent.attendees}</span>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6">
                <h3 className="font-display text-xl font-bold text-white mb-4">Event Gallery</h3>
                
                {loadingImages ? (
                  <p className="text-white/60 text-center py-8">Loading gallery...</p>
                ) : eventImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {eventImages.map((image) => (
                      <div key={image.id} className="relative group overflow-hidden rounded-lg">
                        {isVideoAsset(image.image_url) ? (
                          <video
                            src={image.image_url}
                            className="w-full h-64 object-cover bg-black"
                            controls
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={image.image_url}
                            alt={image.caption || 'Event photo'}
                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        )}
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            <p className="text-white text-sm font-sans">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-xl">
                    <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 font-sans">No gallery images yet for this event</p>
                    <p className="text-white/40 text-sm font-sans mt-2">Check back soon for photos!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
