import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/api';

const Register = () => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveEvents();
  }, []);

  const fetchActiveEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/active-events`);
      setActiveEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (eventId) => {
    navigate(`/register/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/60">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl lg:text-7xl font-bold text-white mb-6">
            <span className="text-brand-red">Register</span> for an Event
          </h1>
          <p className="text-white/70 font-sans text-lg">
            Select an event to begin your registration
          </p>
        </motion.div>

        {activeEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center"
          >
            <p className="text-white/60 font-sans text-xl mb-4">No active events at the moment</p>
            <p className="text-white/40 font-sans">Check back soon for upcoming events!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {activeEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:border-brand-red/50 transition-all duration-300 group"
              >
                <h2 className="font-display text-3xl font-bold text-white mb-4">
                  {event.theme}
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-white/60">
                    <Calendar className="w-5 h-5 mr-3 text-brand-red" />
                    <span className="font-sans">{event.event_date}</span>
                  </div>
                  <div className="flex items-center text-white/60">
                    <MapPin className="w-5 h-5 mr-3 text-brand-red" />
                    <span className="font-sans">{event.venue}</span>
                  </div>
                  <div className="flex items-center text-white/60">
                    <Users className="w-5 h-5 mr-3 text-brand-red" />
                    <span className="font-sans">
                      {event.seats_filled} / {event.total_seats} registered
                    </span>
                  </div>
                </div>

                <p className="text-white/70 font-sans leading-relaxed mb-6">
                  {event.description}
                </p>

                {event.seats_filled >= event.total_seats ? (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
                    <p className="text-red-400 font-bold">Registration Closed</p>
                    <p className="text-red-400/70 text-sm mt-1">Event is full</p>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleSelectEvent(event.id)}
                    className="w-full bg-brand-red hover:bg-brand-ember text-white font-bold py-4 text-lg group-hover:scale-105 transition-transform"
                  >
                    Register Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
