import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Linkedin } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/api';

export const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/team`);
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="team" className="py-32 px-6 lg:px-12 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">Loading team...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-32 px-6 lg:px-12 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-overline mb-6"
        >
          Our Team
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display font-bold text-4xl lg:text-6xl text-white mb-16 tracking-tighter"
        >
          Meet the Minds Behind TEDx
        </motion.h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="team-card rounded-xl p-6 text-center group"
              data-testid={`team-member-${member.id}`}
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-brand-red/30 blur-xl rounded-full group-hover:bg-brand-red/50 transition-all duration-300" />
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="relative w-32 h-32 rounded-full object-cover mx-auto border-2 border-white/10"
                />
              </div>

              <h3 className="font-display font-bold text-xl text-white mb-2">
                {member.name}
              </h3>
              <p className="text-brand-red text-sm font-sans font-medium mb-4">
                {member.role}
              </p>
              
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-brand-red transition-all duration-300 group"
                data-testid={`team-linkedin-${member.id}`}
              >
                <Linkedin className="w-5 h-5 text-white/60 group-hover:text-white" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
