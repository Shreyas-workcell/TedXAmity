import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Volume2, VolumeX } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/api';

export const Hero = () => {
  const [teaser, setTeaser] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);
  const videoRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    fetchTeaser();
  }, []);

  const fetchTeaser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/teaser`);
      setTeaser(response.data);
    } catch (error) {
      console.error('Error fetching teaser:', error);
    }
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const detectVideoAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const audioTrackCount = video.audioTracks?.length ?? 0;
    const hasDecodedAudio = typeof video.webkitAudioDecodedByteCount === 'number'
      ? video.webkitAudioDecodedByteCount > 0
      : false;
    const detectedAudio = Boolean(video.mozHasAudio || audioTrackCount > 0 || hasDecodedAudio);

    setHasAudio(detectedAudio);
    if (!detectedAudio) {
      setIsMuted(true);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video || !hasAudio) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [hasAudio]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="hero-particles">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: '#000000',
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: 'repulse',
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: ['#E62B1E', '#FF4D2E', '#FF6B4A'],
              },
              links: {
                enable: false,
              },
              move: {
                direction: 'top',
                enable: true,
                outModes: {
                  default: 'out',
                },
                random: true,
                speed: 0.8,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: { min: 0.1, max: 0.5 },
                animation: {
                  enable: true,
                  speed: 1,
                  sync: false,
                },
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: { min: 1, max: 4 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red/20 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,34rem)] gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="w-full max-w-4xl mx-auto text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="section-overline mb-6"
            >
              Ideas Worth Spreading
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.55 }}
              className="tedx-wordmark tedx-wordmark-hero mb-6"
              data-testid="hero-title"
            >
              <span className="tedx-wordmark-mark">
                TED<span className="tedx-wordmark-x">x</span>
              </span>
              <span className="tedx-wordmark-name"> Amity University Bengaluru</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="font-display text-xl sm:text-2xl lg:text-4xl text-white/90 italic mb-12"
              data-testid="hero-tagline"
            >
              "One Spark... Endless Possibilities"
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
              className="cta-button text-lg"
              data-testid="hero-register-btn"
            >
              Join the Movement
            </motion.button>
          </motion.div>

          {/* Right Side - Video/Poster Frame */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="embossed-frame rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-2">
              <div className="rounded-2xl overflow-hidden bg-black/50 aspect-video flex items-center justify-center">
                {teaser ? (
                  teaser.content_type === 'video' && teaser.video_url ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        src={teaser.video_url}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="w-full h-full object-cover"
                        poster={teaser.poster_url}
                        onLoadedMetadata={detectVideoAudio}
                        onCanPlay={detectVideoAudio}
                      />
                      {hasAudio && (
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/65 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/80"
                          aria-label={isMuted ? 'Unmute teaser video' : 'Mute teaser video'}
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                          {isMuted ? 'Unmute' : 'Mute'}
                        </button>
                      )}
                    </div>
                  ) : teaser.poster_url ? (
                    <img
                      src={teaser.poster_url}
                      alt="Event Teaser"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-white/60 font-sans text-lg">Upcoming Event Teaser</p>
                      <p className="text-white/40 font-sans text-sm mt-2">Coming Soon...</p>
                    </div>
                  )
                ) : (
                  <div className="text-center p-8">
                    <p className="text-white/60 font-sans text-lg">Upcoming Event Teaser</p>
                    <p className="text-white/40 font-sans text-sm mt-2">Coming Soon...</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        onClick={scrollToAbout}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors"
        data-testid="scroll-indicator"
      >
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </motion.button>
    </section>
  );
};
