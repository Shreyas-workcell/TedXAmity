import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    document.body.classList.add('has-custom-cursor');

    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Add trail effect
      const newTrail = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };

      setTrails(prev => [...prev, newTrail]);

      // Remove trail after animation
      setTimeout(() => {
        setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
      }, 500);
    };

    window.addEventListener('mousemove', updateCursor);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="cursor-flame" />
      </div>

      {trails.map(trail => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </>
  );
};
