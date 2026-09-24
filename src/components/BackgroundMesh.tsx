import React from 'react';

export const BackgroundMesh: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Deep dark backdrop */}
      <div className="absolute inset-0 bg-[#070a13]" />

      {/* Cyber Grid Lines (subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"
      />

      {/* Neon Orb 1: Cyan (top right) */}
      <div 
        className="absolute -top-[12%] -right-[10%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full bg-cyan-500/12 blur-[100px] sm:blur-[130px] animate-pulse-slow"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Neon Orb 2: Electric Violet (top left) */}
      <div 
        className="absolute top-[20%] -left-[15%] w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full bg-purple-600/14 blur-[110px] sm:blur-[140px] animate-pulse-slow"
        style={{ animationDelay: '2.5s', transform: 'translate3d(0,0,0)' }}
      />

      {/* Neon Orb 3: Emerald Green (bottom center) */}
      <div 
        className="absolute bottom-[5%] right-[20%] w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full bg-emerald-500/10 blur-[90px] sm:blur-[120px] animate-pulse-slow"
        style={{ animationDelay: '5s', transform: 'translate3d(0,0,0)' }}
      />

      {/* Subtle Noise / vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#070a13]/60 to-[#070a13] pointer-events-none" />
    </div>
  );
};
