import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BACKEND_URL } from '@/lib/api';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const RegisterForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    enrollment_number: '',
    dob: '',
    contact_number: '',
    email: '',
    course: '',
    school: '',
    selected_sessions: [],
    payment_receipt_url: ''
  });

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/active-events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${BACKEND_URL}/api/register`, {
        event_id: eventId,
        ...formData
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting:', error);
      alert(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/60">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Event not found</p>
          <Button onClick={() => navigate('/register')} variant="outline">
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0A0A0A] border border-brand-red/50 rounded-2xl p-12 text-center max-w-md"
        >
          <CheckCircle className="w-20 h-20 text-brand-red mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Registration Submitted!
          </h2>
          <p className="text-white/70 font-sans mb-8">
            Thank you for registering. You'll receive a confirmation email soon.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-brand-red hover:bg-brand-ember text-white"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Button
          onClick={() => navigate('/register')}
          variant="outline"
          className="mb-8 border-white/20 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-4">
            Register for <span className="text-brand-red">{event.theme}</span>
          </h1>
          <p className="text-white/70 font-sans text-lg mb-8">
            Fill in your details to complete registration
          </p>

          <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-white/80 font-sans text-sm mb-2 block">Full Name *</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="bg-black border-white/20 text-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-white/80 font-sans text-sm mb-2 block">Enrollment Number *</label>
                <Input
                  type="text"
                  value={formData.enrollment_number}
                  onChange={(e) => setFormData({...formData, enrollment_number: e.target.value})}
                  required
                  className="bg-black border-white/20 text-white"
                  placeholder="A12345678"
                />
              </div>

              <div>
                <label className="text-white/80 font-sans text-sm mb-2 block">Date of Birth *</label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  required
                  className="bg-black border-white/20 text-white"
                />
              </div>

              <div>
                <label className="text-white/80 font-sans text-sm mb-2 block">Contact Number *</label>
                <Input
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                  required
                  className="bg-black border-white/20 text-white"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="text-white/80 font-sans text-sm mb-2 block">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="bg-black border-white/20 text-white"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-white/80 font-sans text-sm mb-2 block">Course *</label>
                <Input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  required
                  className="bg-black border-white/20 text-white"
                  placeholder="B.Tech CSE"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-white/80 font-sans text-sm mb-2 block">School *</label>
                <Input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  required
                  className="bg-black border-white/20 text-white"
                  placeholder="School of Engineering & Technology"
                />
              </div>
            </div>

            {event.is_paid && (
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-display text-xl font-bold text-white mb-4">Payment Details</h3>
                <p className="text-white/70 font-sans mb-4">
                  Registration Fee: <span className="text-brand-red font-bold text-xl">{event.fee_amount}</span>
                </p>
                {event.upi_id && (
                  <p className="text-white/60 font-sans text-sm mb-2">UPI ID: {event.upi_id}</p>
                )}
                <div>
                  <label className="text-white/80 font-sans text-sm mb-2 block">Payment Receipt URL *</label>
                  <Input
                    type="url"
                    value={formData.payment_receipt_url}
                    onChange={(e) => setFormData({...formData, payment_receipt_url: e.target.value})}
                    required={event.is_paid}
                    className="bg-black border-white/20 text-white"
                    placeholder="https://drive.google.com/..."
                  />
                  <p className="text-white/40 text-xs mt-2">Upload receipt to Google Drive and paste the link</p>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-brand-red hover:bg-brand-ember text-white font-bold py-4 text-lg"
              >
                {submitting ? 'Submitting...' : 'Submit Registration'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterForm;
