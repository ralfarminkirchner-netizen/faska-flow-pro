import React from 'react';

export default function MadScientistLab() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gray-900 shadow-2xl font-mono flex items-center justify-center">
      {/* Container to maintain aspect ratio for the background */}
      <div className="relative w-full max-w-5xl aspect-[4/3] bg-black border-4 border-gray-700 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl text-gray-300">
          <defs>
            <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <radialGradient id="podGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="doorLightGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="darkMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          {/* Wall */}
          <rect width="800" height="420" fill="url(#wallGrad)" />
          
          {/* Wall Details / Pipes */}
          <path d="M 0 50 L 800 50" stroke="#334155" strokeWidth="8" />
          <path d="M 0 60 L 800 60" stroke="#1e293b" strokeWidth="4" />
          <path d="M 100 0 L 100 420 M 700 0 L 700 420" stroke="#0f172a" strokeWidth="12" opacity="0.6" />

          {/* Floor */}
          <rect y="420" width="800" height="180" fill="url(#floorGrad)" />

          {/* Floor Grid for perspective */}
          <path d="M 0 420 L 800 420 M 0 460 L 800 460 M 0 510 L 800 510 M 0 570 L 800 570" stroke="#475569" strokeWidth="2" opacity="0.4" />
          <path d="M 400 420 L 400 600 M 300 420 L 100 600 M 200 420 L -150 600 M 500 420 L 700 600 M 600 420 L 950 600" stroke="#475569" strokeWidth="2" opacity="0.4" />

          {/* === LEFT SIDE: Chalkboard === */}
          <g transform="translate(40, 120)">
            {/* Wooden Frame */}
            <rect x="-8" y="-8" width="236" height="156" fill="#78350f" rx="4" />
            {/* Board */}
            <rect width="220" height="140" fill="#14532d" />
            
            {/* Scribbles */}
            <text x="15" y="30" fill="#f1f5f9" fontSize="18" opacity="0.85" style={{fontFamily: 'monospace'}}>Δt = t' - t</text>
            <text x="40" y="65" fill="#f8fafc" fontSize="26" opacity="0.9" style={{fontFamily: 'serif', fontStyle: 'italic'}}>E = mc²</text>
            <text x="15" y="100" fill="#cbd5e1" fontSize="14" opacity="0.75" style={{fontFamily: 'monospace'}}>Flux = 1.21 GW</text>
            
            {/* Drawing of a wormhole/diagram */}
            <path d="M 140 110 C 180 80, 210 130, 180 50" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.6"/>
            <circle cx="180" cy="50" r="4" fill="#cbd5e1" opacity="0.8" />
            <circle cx="140" cy="110" r="4" fill="#cbd5e1" opacity="0.8" />
            <path d="M 130 50 L 190 110" stroke="#fecaca" strokeWidth="1" opacity="0.5" strokeDasharray="4 2" />
            
            {/* Chalk tray */}
            <rect x="-8" y="148" width="236" height="6" fill="#451a03" />
            <rect x="50" y="145" width="12" height="3" fill="#f8fafc" />
            <rect x="70" y="145" width="8" height="3" fill="#fca5a5" />
          </g>

          {/* === RIGHT SIDE: Locked Metal Door === */}
          <g transform="translate(560, 90)">
            {/* Door Frame */}
            <rect x="-10" y="-10" width="180" height="340" fill="url(#darkMetal)" rx="6" />
            {/* Main Door Panel */}
            <rect width="160" height="330" fill="url(#metal)" stroke="#334155" strokeWidth="4" />
            
            {/* Rivets */}
            <circle cx="10" cy="10" r="3" fill="#1e293b"/>
            <circle cx="150" cy="10" r="3" fill="#1e293b"/>
            <circle cx="10" cy="320" r="3" fill="#1e293b"/>
            <circle cx="150" cy="320" r="3" fill="#1e293b"/>
            
            {/* Reinforced panels */}
            <rect x="20" y="20" width="120" height="100" fill="none" stroke="#64748b" strokeWidth="2" />
            <rect x="20" y="210" width="120" height="100" fill="none" stroke="#64748b" strokeWidth="2" />

            {/* Small barred window */}
            <rect x="50" y="40" width="60" height="60" fill="#0f172a" stroke="#1e293b" strokeWidth="4" rx="4" />
            <path d="M 70 40 L 70 100 M 90 40 L 90 100" stroke="#475569" strokeWidth="4" />
            
            {/* Digital Keypad */}
            <rect x="110" y="150" width="35" height="55" fill="#1e293b" rx="4" />
            {/* Keypad screen */}
            <rect x="115" y="155" width="25" height="12" fill="#022c22" />
            <text x="117" y="165" fill="#10b981" fontSize="8" style={{fontFamily: 'monospace'}}>ERR</text>
            {/* Buttons */}
            <circle cx="120" cy="175" r="2" fill="#475569" />
            <circle cx="127" cy="175" r="2" fill="#475569" />
            <circle cx="134" cy="175" r="2" fill="#475569" />
            <circle cx="120" cy="183" r="2" fill="#475569" />
            <circle cx="127" cy="183" r="2" fill="#475569" />
            <circle cx="134" cy="183" r="2" fill="#475569" />
            <circle cx="120" cy="191" r="2" fill="#475569" />
            <circle cx="127" cy="191" r="2" fill="#475569" />
            <circle cx="134" cy="191" r="2" fill="#475569" />

            {/* Red Lock Light indicator */}
            <circle cx="127" cy="140" r="6" fill="url(#doorLightGlow)" />
            <circle cx="127" cy="140" r="3" fill="#fca5a5">
              <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
            </circle>

            {/* Heavy Handle */}
            <rect x="25" y="150" width="15" height="45" fill="url(#darkMetal)" rx="2" />
            <rect x="20" y="160" width="25" height="8" fill="#1e293b" />
          </g>

          {/* === CENTER: Huge Time Machine Pod === */}
          <g transform="translate(200, 100)">
            {/* Power Cables on Floor */}
            <path d="M 50 350 Q 0 400 -150 450" fill="none" stroke="#1e293b" strokeWidth="8" />
            <path d="M 300 350 Q 400 380 500 480" fill="none" stroke="#0f172a" strokeWidth="12" />

            {/* Platform / Base */}
            <ellipse cx="200" cy="350" rx="160" ry="40" fill="url(#darkMetal)" stroke="#0f172a" strokeWidth="6" />
            <rect x="60" y="330" width="280" height="30" fill="url(#metal)" stroke="#1e293b" strokeWidth="2" />
            
            {/* Arc Supports */}
            <path d="M 70 330 L 100 150 L 120 150 L 110 330 Z" fill="url(#darkMetal)" />
            <path d="M 330 330 L 300 150 L 280 150 L 290 330 Z" fill="url(#darkMetal)" />

            {/* Main Pod Outer Hull */}
            <ellipse cx="200" cy="200" rx="130" ry="150" fill="url(#metal)" stroke="#0f172a" strokeWidth="6" />
            
            {/* Inner Cabin (Dark) */}
            <ellipse cx="200" cy="210" rx="100" ry="120" fill="#020617" stroke="#334155" strokeWidth="8" />
            
            {/* Glowing Core / Temporal Engine (Inside Cabin) */}
            <circle cx="200" cy="210" r="95" fill="url(#podGlow)">
              <animate attributeName="r" values="95;100;95" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Pilot Chair Silhouette inside */}
            <path d="M 170 280 L 170 230 Q 200 210 230 230 L 230 280 Z" fill="#0f172a" />
            {/* Dashboard silhouette */}
            <rect x="150" y="270" width="100" height="30" fill="#1e293b" rx="5" />
            
            {/* Blinking console lights */}
            <circle cx="165" cy="285" r="4" fill="#34d399">
              <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="185" cy="285" r="4" fill="#fbbf24">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="205" cy="285" r="4" fill="#60a5fa">
              <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
            </circle>

            {/* Glass Dome Overlay */}
            <ellipse cx="200" cy="210" rx="100" ry="120" fill="#38bdf8" opacity="0.2" />
            {/* Glass Reflections */}
            <path d="M 120 150 Q 150 100 220 110" fill="none" stroke="#bae6fd" strokeWidth="8" opacity="0.4" strokeLinecap="round" />
            <path d="M 115 180 Q 130 140 160 135" fill="none" stroke="#bae6fd" strokeWidth="4" opacity="0.3" strokeLinecap="round" />

            {/* Top Antenna Assembly */}
            <rect x="180" y="30" width="40" height="20" fill="url(#darkMetal)" rx="4" />
            <path d="M 195 30 L 195 -30 M 205 30 L 205 -30" stroke="#94a3b8" strokeWidth="4" />
            <circle cx="200" cy="-35" r="12" fill="#fbbf24">
              <animate attributeName="fill" values="#fbbf24;#f59e0b;#fbbf24" dur="1s" repeatCount="indefinite" />
            </circle>
            {/* Spark lines from antenna */}
            <path d="M 200 -35 Q 230 -60 250 -40" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0">
              <animate attributeName="opacity" values="0;1;0;0" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M 200 -35 Q 170 -60 150 -40" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0">
              <animate attributeName="opacity" values="0;0;0;1;0" dur="4s" repeatCount="indefinite" />
            </path>

            {/* Energy Rings around Pod */}
            <ellipse cx="200" cy="120" rx="150" ry="20" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.6">
               <animate attributeName="ry" values="20;25;20" dur="2.5s" repeatCount="indefinite"/>
               <animate attributeName="stroke-width" values="4;6;4" dur="2.5s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="200" cy="260" rx="160" ry="25" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.6">
               <animate attributeName="ry" values="25;30;25" dur="3s" repeatCount="indefinite"/>
               <animate attributeName="stroke-width" values="4;7;4" dur="3s" repeatCount="indefinite"/>
            </ellipse>
          </g>

          {/* Foreground Shadows & Atmosphere */}
          <rect width="800" height="600" fill="url(#podGlow)" opacity="0.1" pointerEvents="none" />
        </svg>

        {/* Retro CRT overlay effects (Scanlines + slight vignette + RGB split simulation) */}
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
          backgroundSize: '100% 4px, 3px 100%'
        }}></div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"></div>
      </div>
    </div>
  );
}
