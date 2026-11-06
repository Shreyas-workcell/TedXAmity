import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/api';

export const Speakers = () => {
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/speakers`);
      setSpeakers(response.data);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="speakers" className="py-32 px-6 lg:px-12 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">Loading speakers...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="speakers" className="py-32 px-6 lg:px-12 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-overline mb-6"
          >
            Our Speakers
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display font-bold text-4xl lg:text-6xl text-white mb-16 tracking-tighter"
          >
            Voices of Innovation
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedSpeaker(speaker)}
                className="speaker-card bg-black border border-white/10 rounded-xl overflow-hidden group"
                data-testid={`speaker-card-${speaker.id}`}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={speaker.image_url}
                    alt={speaker.name}
                    className="speaker-card-img w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-white mb-2">
                    {speaker.name}
                  </h3>
                  <p className="text-brand-red text-sm font-sans font-medium mb-3">
                    {speaker.designation}
                  </p>
                  <p className="text-white/60 text-sm font-sans italic">
                    "{speaker.talk_title}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedSpeaker} onOpenChange={() => setSelectedSpeaker(null)}>
        <DialogContent className="bg-black border border-white/20 text-white max-w-2xl" data-testid="speaker-modal">
          {selectedSpeaker && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-3xl font-bold mb-4">
                  {selectedSpeaker.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedSpeaker.image_url}
                  alt={selectedSpeaker.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-brand-red font-sans font-bold">
                  {selectedSpeaker.designation}
                </p>
                <p className="font-display text-xl italic text-white/90">
                  Talk: "{selectedSpeaker.talk_title}"
                </p>
                <p className="text-white/70 font-sans leading-relaxed">
                  {selectedSpeaker.bio}
                </p>
                <p className="text-white/50 text-sm">
                  Event Year: {selectedSpeaker.year}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
