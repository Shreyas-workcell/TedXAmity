import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BACKEND_URL } from '@/lib/api';

const Recruitment = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState(1);
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
    department: '',
    role: '',
    proficiency_level: '',
    experience: '',
    portfolio_link: '',
    optional_role: '',
    optional_proficiency: ''
  });

  useEffect(() => {
    fetchRecruitmentConfig();
  }, []);

  const fetchRecruitmentConfig = async () => {
    try {
      const configRes = await axios.get(`${BACKEND_URL}/api/recruitment-config`);
      const rolesRes = await axios.get(`${BACKEND_URL}/api/recruitment-roles`);
      
      setConfig(configRes.data);
      setRoles(rolesRes.data);
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${BACKEND_URL}/api/recruitment/apply`, formData);
      setSuccess(true);
    } catch (error) {
      alert(error.response?.data?.detail || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  if (!config || !config.is_active) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center max-w-md"
        >
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            No Recruitment Currently Open
          </h2>
          <p className="text-white/60 font-sans mb-8">
            Check back later for recruitment opportunities
          </p>
          <Button onClick={() => navigate('/')} className="bg-brand-red hover:bg-brand-ember text-white">
            Back to Home
          </Button>
        </motion.div>
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
            Application Submitted!
          </h2>
          <p className="text-white/70 font-sans mb-8">
            Thank you for applying. We'll review your application and get back to you soon.
          </p>
          <Button onClick={() => navigate('/')} className="bg-brand-red hover:bg-brand-ember text-white">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  const departments = [...new Set(roles.map(r => r.department))];
  const availableRoles = roles.filter(r => r.department === formData.department && r.is_available);
  const selectedRole = roles.find(r => r.role_name === formData.role);
  const needsProficiency = selectedRole && (selectedRole.department === 'Graphics' || selectedRole.department === 'Video Editing');

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Button onClick={() => navigate('/')} variant="outline" className="mb-8 border-white/20 text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-brand-red">Join Our Team</span>
          </h1>
          <p className="text-white/70 font-sans text-lg mb-8">Recruitment Application - Phase {phase} of 2</p>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 space-y-6">
            {phase === 1 ? (
              <>
                <h2 className="font-display text-2xl font-bold text-white mb-6">Basic Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white/80 font-sans text-sm mb-2 block">Full Name *</label>
                    <Input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="bg-black border-white/20 text-white" />
                  </div>
                  <div>
                    <label className="text-white/80 font-sans text-sm mb-2 block">Enrollment Number *</label>
                    <Input type="text" value={formData.enrollment_number} onChange={(e) => setFormData({...formData, enrollment_number: e.target.value})} required className="bg-black border-white/20 text-white" />
                  </div>
                  <div>
                    <label className="text-white/80 font-sans text-sm mb-2 block">Date of Birth *</label>
                    <Input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} required className="bg-black border-white/20 text-white" />
                  </div>
                  <div>
                    <label className="text-white/80 font-sans text-sm mb-2 block">Contact Number *</label>
                    <Input type="tel" value={formData.contact_number} onChange={(e) => setFormData({...formData, contact_number: e.target.value})} required className="bg-black border-white/20 text-white" />
                  </div>
                  <div>
                    <label className="text-white/80 font-sans text-sm mb-2 block">Email *</label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="bg-black border-white/20 text-white" />
                  </div>
                  <div>
                    <label className="text-white/80 font-sans text-sm mb-2 block">Course *</label>
                    <Input type="text" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} required className="bg-black border-white/20 text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-white/80 font-sans text-sm mb-2 block">School *</label>
                    <Input type="text" value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} required className="bg-black border-white/20 text-white" />
                  </div>
                </div>
                <Button onClick={() => setPhase(2)} className="w-full bg-brand-red hover:bg-brand-ember text-white font-bold py-4">
                  Next: Role Selection <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-white mb-6">Role Selection</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-white/80 font-sans text-sm mb-2 block">Which department would you like to join? *</label>
                    <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value, role: ''})} required className="w-full bg-black border border-white/20 text-white rounded-lg px-4 py-3">
                      <option value="">Select Department</option>
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>

                  {formData.department && (
                    <div>
                      <label className="text-white/80 font-sans text-sm mb-2 block">What role would you opt for? *</label>
                      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required className="w-full bg-black border border-white/20 text-white rounded-lg px-4 py-3">
                        <option value="">Select Role</option>
                        {availableRoles.map(role => <option key={role.id} value={role.role_name}>{role.role_name}</option>)}
                      </select>
                    </div>
                  )}

                  {needsProficiency && (
                    <div>
                      <label className="text-white/80 font-sans text-sm mb-2 block">Level of proficiency *</label>
                      <select value={formData.proficiency_level} onChange={(e) => setFormData({...formData, proficiency_level: e.target.value})} required className="w-full bg-black border border-white/20 text-white rounded-lg px-4 py-3">
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-white/80 font-sans text-sm mb-2 block">Relevant experience *</label>
                    <Textarea value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} required className="bg-black border-white/20 text-white" rows={4} placeholder="Describe your relevant experience..." />
                  </div>

                  <div>
                    <label className="text-white/80 font-sans text-sm mb-2 block">Portfolio link (GitHub, Website, Drive folder)</label>
                    <Input type="url" value={formData.portfolio_link} onChange={(e) => setFormData({...formData, portfolio_link: e.target.value})} className="bg-black border-white/20 text-white" placeholder="https://..." />
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-sans font-bold text-white mb-4">Optional Non-Technical Skillset</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-white/80 font-sans text-sm mb-2 block">Preferred role</label>
                        <Input type="text" value={formData.optional_role} onChange={(e) => setFormData({...formData, optional_role: e.target.value})} className="bg-black border-white/20 text-white" />
                      </div>
                      <div>
                        <label className="text-white/80 font-sans text-sm mb-2 block">Proficiency level</label>
                        <select value={formData.optional_proficiency} onChange={(e) => setFormData({...formData, optional_proficiency: e.target.value})} className="w-full bg-black border border-white/20 text-white rounded-lg px-4 py-3">
                          <option value="">Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={() => setPhase(1)} variant="outline" className="flex-1 border-white/20 text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-brand-red hover:bg-brand-ember text-white font-bold py-4">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recruitment;
