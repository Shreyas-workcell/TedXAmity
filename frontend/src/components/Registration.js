import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

export const Registration = () => {
  const navigate = useNavigate();
  const [activeEvents, setActiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const fetchActiveEvents = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/active-events`);
        setActiveEvents(response.data);
      } catch (error) {
        console.error('Error fetching active events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveEvents();
  }, []);

  const featuredEvent = useMemo(() => {
    if (activeEvents.length === 0) {
      return null;
    }

    const now = Date.now();
    const datedEvents = activeEvents.filter((event) => event.event_date);
    const upcomingEvents = datedEvents.filter((event) => new Date(event.event_date).getTime() >= now);

    return [...(upcomingEvents.length > 0 ? upcomingEvents : datedEvents)]
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))[0] || activeEvents[0];
  }, [activeEvents]);

  useEffect(() => {
    if (!featuredEvent?.event_date) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return undefined;
    }

    const targetDate = new Date(featuredEvent.event_date);

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();

    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [featuredEvent]);

  const formatEventDate = (value) => {
    if (!value) {
      return 'Date to be announced';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const seatsLabel = featuredEvent
    ? `${featuredEvent.seats_filled || 0} / ${featuredEvent.total_seats || 0} registered`
    : 'Seats to be announced';

  return (
    <section id="registration" className="py-32 px-6 lg:px-12 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red/10 via-transparent to-transparent" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="section-overline mb-6">
            Join Us
          </p>

          <h2 className="font-display font-bold text-4xl lg:text-7xl text-white mb-8 tracking-tighter">
            Be Part of the Next Chapter
          </h2>

          <p className="text-white/70 font-sans text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience an unforgettable evening of groundbreaking ideas, inspiring speakers, and meaningful connections.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6"
                data-testid={`countdown-${item.label.toLowerCase()}`}
              >
                <div className="font-display text-4xl lg:text-5xl font-bold text-brand-red mb-2">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-white/60 text-sm font-sans uppercase tracking-wider">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-4">
                <Calendar className="w-6 h-6 text-brand-red mt-1" />
                <div>
                  <p className="text-white/50 text-sm font-sans mb-1">Date</p>
                  <p className="text-white font-sans font-bold">
                    {loading ? 'Loading...' : formatEventDate(featuredEvent?.event_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-brand-red mt-1" />
                <div>
                  <p className="text-white/50 text-sm font-sans mb-1">Venue</p>
                  <p className="text-white font-sans font-bold">
                    {loading ? 'Loading...' : (featuredEvent?.venue || 'Venue to be announced')}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="w-6 h-6 text-brand-red mt-1" />
                <div>
                  <p className="text-white/50 text-sm font-sans mb-1">Seats</p>
                  <p className="text-white font-sans font-bold">
                    {loading ? 'Loading...' : seatsLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="cta-button text-lg"
            data-testid="register-event-btn"
          >
            Register for Upcoming Event
          </motion.button>

          <p className="text-white/50 text-sm font-sans mt-6">
            {featuredEvent ? `Active event: ${featuredEvent.theme}` : 'Registration opens soon. Stay tuned for updates!'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
