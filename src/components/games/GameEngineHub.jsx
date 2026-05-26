import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary';

// --- NEW TITLES (The Swarm Phase) ---
const FaskaAdventure = lazy(() => import('./AAA_Engines/FaskaAdventure/FaskaAdventure').catch(() => ({ default: () => <div className="text-white p-8">FASKA Adventure Error</div> })));
const FaskaRaider = lazy(() => import('./engines/FaskaRaider/FaskaRaider').catch(() => ({ default: () => <div className="text-white p-8">FASKA Raider wird von Agent 2 entwickelt...</div> })));

// --- WAVE 1: 16-BIT & RETRO SWARM ---
const FaskaLand = lazy(() => import('./engines/FaskaLand/FaskaLand').catch(() => ({ default: () => <div className="text-white p-8">FASKA Land Error</div> })));
const FaskaWorld = lazy(() => import('./engines/FaskaWorld/FaskaWorld').catch(() => ({ default: () => <div className="text-white p-8">FASKA World Error</div> })));
const FaskaRage = lazy(() => import('./engines/FaskaRage/FaskaRage').catch(() => ({ default: () => <div className="text-white p-8">FASKA Rage Error</div> })));
const FaskaTurtles = lazy(() => import('./engines/FaskaTurtles/FaskaTurtles').catch(() => ({ default: () => <div className="text-white p-8">FASKA Turtles Error</div> })));
const FaskaWario = lazy(() => import('./engines/FaskaWario/FaskaWario').catch(() => ({ default: () => <div className="text-white p-8">FASKA Wario Error</div> })));

// --- WAVE 2: 3D SWARM ---
const FaskaForces = lazy(() => import('./engines/FaskaForces/FaskaForces').catch(() => ({ default: () => <div className="text-white p-8">FASKA Forces Error</div> })));
const FaskaSixtyFour = lazy(() => import('./engines/FaskaSixtyFour/FaskaSixtyFour').catch(() => ({ default: () => <div className="text-white p-8">FASKA 64 Error</div> })));
const FaskaSolid = lazy(() => import('./engines/FaskaSolid/FaskaSolid').catch(() => ({ default: () => <div className="text-white p-8">FASKA Solid Error</div> })));
const FaskaGolfSwarm = lazy(() => import('./engines/FaskaGolfSwarm/FaskaGolfSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Golf Error</div> })));
const FaskaBillard = lazy(() => import('./engines/FaskaBillard/FaskaBillard').catch(() => ({ default: () => <div className="text-white p-8">FASKA Billard Error</div> })));

// --- WAVE 3: SPORT & ARCADE SWARM ---
const FaskaSoccerSwarm = lazy(() => import('./engines/FaskaSoccerSwarm/FaskaSoccerSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Soccer Error</div> })));
const FaskaTennisSwarm = lazy(() => import('./engines/FaskaTennisSwarm/FaskaTennisSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Tennis Error</div> })));
const FaskaFrisbeeSwarm = lazy(() => import('./engines/FaskaFrisbeeSwarm/FaskaFrisbeeSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Frisbee Error</div> })));
const FaskaInvadersSwarm = lazy(() => import('./engines/FaskaInvadersSwarm/FaskaInvadersSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Invaders Error</div> })));
const FaskaRTypeSwarm = lazy(() => import('./engines/FaskaRTypeSwarm/FaskaRTypeSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA R-Type Error</div> })));

// --- WAVE 4: 3D RACING & VEHICLES SWARM ---
const FaskaFZeroSwarm = lazy(() => import('./engines/FaskaFZeroSwarm/FaskaFZeroSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Zero Error</div> })));
const FaskaRallySwarm = lazy(() => import('./engines/FaskaRallySwarm/FaskaRallySwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Rally Error</div> })));
const FaskaRidgeSwarm = lazy(() => import('./engines/FaskaRidgeSwarm/FaskaRidgeSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Ridge Error</div> })));
const FaskaRockRacingSwarm = lazy(() => import('./engines/FaskaRockRacingSwarm/FaskaRockRacingSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Rock Racing Error</div> })));
const FaskaRCSwarm = lazy(() => import('./engines/FaskaRCSwarm/FaskaRCSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA RC Error</div> })));

// --- PART 2: NEXT GENERATION TITLES ---
const FaskaZero2 = lazy(() => import('./engines/FaskaZero2/FaskaZero2').catch(() => ({ default: () => <div className="text-white p-8">FASKA Zero 2 wird von Elite Agent entwickelt...</div> })));
const FaskaSkater2 = lazy(() => import('./engines/FaskaSkater2/FaskaSkater2').catch(() => ({ default: () => <div className="text-white p-8">FASKA Skater 2 wird von Elite Agent entwickelt...</div> })));
const Faska64Part2 = lazy(() => import('./engines/Faska64Part2/Faska64Part2').catch(() => ({ default: () => <div className="text-white p-8">FASKA 64 Part 2 wird von Elite Agent entwickelt...</div> })));
const FaskaFighter3 = lazy(() => import('./engines/FaskaFighter3/FaskaFighter3').catch(() => ({ default: () => <div className="text-white p-8">FASKA Fighter 3 wird von Elite Agent entwickelt...</div> })));
const FaskaRaider2 = lazy(() => import('./AAA_Engines/FaskaRaider/FaskaRaider').catch(() => ({ default: () => <div className="text-white p-8">FASKA Raider 2 wird von Elite Agent entwickelt...</div> })));
const FaskaKazooie = lazy(() => import('./engines/FaskaKazooie/FaskaKazooie').catch(() => ({ default: () => <div className="text-white p-8">FASKA Kazooie wird von Agent 2 entwickelt...</div> })));
const FaskaAstro = lazy(() => import('./engines/FaskaAstro/FaskaAstro').catch(() => ({ default: () => <div className="text-white p-8">FASKA Astro wird von Agent 2 entwickelt...</div> })));
const FaskaRidge = lazy(() => import('./engines/FaskaRidge/FaskaRidge').catch(() => ({ default: () => <div className="text-white p-8">FASKA Ridge wird von Agent 1 entwickelt...</div> })));
const FaskaRally = lazy(() => import('./engines/FaskaRally/FaskaRally').catch(() => ({ default: () => <div className="text-white p-8">FASKA Rally wird von Agent 1 entwickelt...</div> })));
const FaskaRockRacing = lazy(() => import('./engines/FaskaRockRacing/FaskaRockRacing').catch(() => ({ default: () => <div className="text-white p-8">FASKA Rock Racing wird von Agent 1 entwickelt...</div> })));
const FaskaRC = lazy(() => import('./engines/FaskaRC/FaskaRC').catch(() => ({ default: () => <div className="text-white p-8">FASKA RC wird von Agent 1 entwickelt...</div> })));
const FaskaBike = lazy(() => import('./engines/FaskaBike/FaskaBike').catch(() => ({ default: () => <div className="text-white p-8">FASKA Bike wird von Agent 3 entwickelt...</div> })));
const FaskaMotocross = lazy(() => import('./engines/FaskaMotocross/FaskaMotocross').catch(() => ({ default: () => <div className="text-white p-8">FASKA Motocross wird von Agent 3 entwickelt...</div> })));
const FaskaKirby = lazy(() => import('./engines/FaskaKirby/FaskaKirby').catch(() => ({ default: () => <div className="text-white p-8">FASKA Kirby wird von Agent 3 entwickelt...</div> })));
const FaskaWolf = lazy(() => import('./engines/FaskaWolf/FaskaWolf').catch(() => ({ default: () => <div className="text-white p-8">FASKA Wolf wird von Agent 4 entwickelt...</div> })));
const FaskaRPG = lazy(() => import('./engines/FaskaRPG/FaskaRPG').catch(() => ({ default: () => <div className="text-white p-8">FASKA RPG wird von Agent 4 entwickelt...</div> })));
const FaskaAlleyway = lazy(() => import('./engines/FaskaAlleyway/FaskaAlleyway').catch(() => ({ default: () => <div className="text-white p-8">FASKA Alleyway wird von Agent 3 entwickelt...</div> })));

// --- EXISTING TITLES ---
const FaskaMan = lazy(() => import('./engines/FaskaMan/FaskaMan').catch(() => ({ default: () => <div className="text-white p-8">FASKA Man wird entwickelt...</div> })));
const FaskaBlocks = lazy(() => import('./engines/FaskaBlocks/FaskaBlocks').catch(() => ({ default: () => <div className="text-white p-8">FASKA Blocks wird entwickelt...</div> })));
const FaskaJump = lazy(() => import('./engines/FaskaJump/FaskaJump').catch(() => ({ default: () => <div className="text-white p-8">FASKA Jump wird entwickelt...</div> })));
const FaskaCross = lazy(() => import('./engines/FaskaCross/FaskaCross').catch(() => ({ default: () => <div className="text-white p-8">FASKA Cross wird entwickelt...</div> })));
const FaskaDoom = lazy(() => import('./engines/FaskaDoom/FaskaDoom').catch(() => ({ default: () => <div className="text-white p-8">FASKA Doom 3D wird von Agent 4 entwickelt...</div> })));
const FaskaKart = lazy(() => import('./engines/FaskaKart/FaskaKart').catch(() => ({ default: () => <div className="text-white p-8">FASKA Kart 3D wird entwickelt...</div> })));
const FaskaFighter = lazy(() => import('./engines/FaskaFighter/FaskaFighter').catch(() => ({ default: () => <div className="text-white p-8">FASKA Fighter wird von Agent 4 entwickelt...</div> })));
const FaskaZelda = lazy(() => import('./engines/FaskaZelda/FaskaZelda').catch(() => ({ default: () => <div className="text-white p-8">FASKA Zelda wird entwickelt...</div> })));
const FaskaSonic = lazy(() => import('./engines/FaskaSonic/FaskaSonic').catch(() => ({ default: () => <div className="text-white p-8">FASKA Sonic wird entwickelt...</div> })));
const FaskaRType = lazy(() => import('./engines/FaskaRType/FaskaRType').catch(() => ({ default: () => <div className="text-white p-8">FASKA RType wird entwickelt...</div> })));
const FaskaCrazyTaxi = lazy(() => import('./engines/FaskaCrazyTaxi/FaskaCrazyTaxi').catch(() => ({ default: () => <div className="text-white p-8">FASKA Taxi wird von Agent 1 entwickelt...</div> })));
const FaskaPinball = lazy(() => import('./engines/FaskaPinball/FaskaPinball').catch(() => ({ default: () => <div className="text-white p-8">FASKA Pinball wird entwickelt...</div> })));
const FaskaMicroMachines = lazy(() => import('./engines/FaskaMicroMachines/FaskaMicroMachines').catch(() => ({ default: () => <div className="text-white p-8">FASKA Micro wird entwickelt...</div> })));
const FaskaMario64 = lazy(() => import('./engines/FaskaMario64/FaskaMario64').catch(() => ({ default: () => <div className="text-white p-8">FASKA 64 wird von Agent 2 entwickelt...</div> })));
const FaskaMarbleMadness = lazy(() => import('./engines/FaskaMarbleMadness/FaskaMarbleMadness').catch(() => ({ default: () => <div className="text-white p-8">FASKA Marble wird entwickelt...</div> })));
const FaskaTekken = lazy(() => import('./engines/FaskaTekken/FaskaTekken').catch(() => ({ default: () => <div className="text-white p-8">FASKA Tekken wird von Agent 4 entwickelt...</div> })));
const FaskaContra = lazy(() => import('./engines/FaskaContra/FaskaContra').catch(() => ({ default: () => <div className="text-white p-8">FASKA Contra wird entwickelt...</div> })));
const FaskaSpaceInvaders = lazy(() => import('./engines/FaskaSpaceInvaders/FaskaSpaceInvaders').catch(() => ({ default: () => <div className="text-white p-8">FASKA Invaders wird entwickelt...</div> })));
const FaskaFZero = lazy(() => import('./engines/FaskaFZero/FaskaFZero').catch(() => ({ default: () => <div className="text-white p-8">FASKA Zero wird von Agent 1 entwickelt...</div> })));
const FaskaTonyHawk = lazy(() => import('./engines/FaskaTonyHawk/FaskaTonyHawk').catch(() => ({ default: () => <div className="text-white p-8">FASKA Skater wird von Agent 3 entwickelt...</div> })));
const FaskaFinalFantasy = lazy(() => import('./engines/FaskaFinalFantasy/FaskaFinalFantasy').catch(() => ({ default: () => <div className="text-white p-8">FASKA Fantasy wird von Agent 4 entwickelt...</div> })));
const FaskaBomberman = lazy(() => import('./engines/FaskaBomberman/FaskaBomberman').catch(() => ({ default: () => <div className="text-white p-8">FASKA Bomber wird von Agent 3 entwickelt...</div> })));
const FaskaMoorhuhn = lazy(() => import('./engines/FaskaMoorhuhn/FaskaMoorhuhn').catch(() => ({ default: () => <div className="text-white p-8">FASKA Huhn wird entwickelt...</div> })));
const FaskaGolf = lazy(() => import('./engines/FaskaGolf/FaskaGolf').catch(() => ({ default: () => <div className="text-white p-8">FASKA Golf wird entwickelt...</div> })));
const FaskaSnake = lazy(() => import('./engines/FaskaSnake/FaskaSnake').catch(() => ({ default: () => <div className="text-white p-8">FASKA Snake wird entwickelt...</div> })));
const FaskaDigDug = lazy(() => import('./engines/FaskaDigDug/FaskaDigDug').catch(() => ({ default: () => <div className="text-white p-8">FASKA DigDug wird entwickelt...</div> })));
const FaskaUno = lazy(() => import('./engines/FaskaUno/FaskaUno').catch(() => ({ default: () => <div className="text-white p-8">FASKA Cards wird entwickelt...</div> })));

const GAMES = [
  // PART 2: THE NEXT GENERATION (APP-STORE QUALITY)
  { id: 'faskazero2', title: 'FASKA Zero 2', desc: 'Flawless Hover Physics', icon: '🚀', component: FaskaZero2, color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50' },
  { id: 'faskaskater2', title: 'FASKA Skater 2', desc: 'Smooth Physics Halfpipe', icon: '🛹', component: FaskaSkater2, color: 'bg-orange-500', shadow: 'shadow-orange-500/50' },
  { id: 'faska64part2', title: 'FASKA 64 Part 2', desc: 'AAA 3D Platforming', icon: '⭐', component: Faska64Part2, color: 'bg-red-600', shadow: 'shadow-red-600/50' },
  { id: 'faskafighter3', title: 'FASKA Fighter 3', desc: 'Ultimate 2D Brawler', icon: '🥊', component: FaskaFighter3, color: 'bg-yellow-500', shadow: 'shadow-yellow-500/50' },
  { id: 'faskaraider2', title: 'FASKA Raider 2', desc: 'Pro Character Controller', icon: '🧗', component: FaskaRaider2, color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50' },

  // WAVE 1: 16-BIT & RETRO SWARM
  { id: 'faskaland', title: 'FASKA Land', desc: 'Gameboy Platformer', icon: '🍄', component: FaskaLand, color: 'bg-green-800', shadow: 'shadow-green-800/50' },
  { id: 'faskaworld', title: 'FASKA World', desc: '16-Bit Platforming', icon: '🦕', component: FaskaWorld, color: 'bg-yellow-500', shadow: 'shadow-yellow-500/50' },
  { id: 'faskarage', title: 'FASKA Rage', desc: 'Street Brawler', icon: '👊', component: FaskaRage, color: 'bg-red-700', shadow: 'shadow-red-700/50' },
  { id: 'faskaturtles', title: 'FASKA Turtles', desc: '4-Player Co-Op Arcade', icon: '🐢', component: FaskaTurtles, color: 'bg-emerald-600', shadow: 'shadow-emerald-600/50' },
  { id: 'faskawario', title: 'FASKA Wario', desc: '5-Second Microgames', icon: '⏱️', component: FaskaWario, color: 'bg-purple-600', shadow: 'shadow-purple-600/50' },

  // WAVE 2: 3D SWARM
  { id: 'faskaforces', title: 'FASKA Forces', desc: 'Dark Forces FPS', icon: '🔫', component: FaskaForces, color: 'bg-gray-800', shadow: 'shadow-gray-800/50' },
  { id: 'faskasixtyfour', title: 'FASKA 64 (New)', desc: '3D Free Roam Platformer', icon: '⭐', component: FaskaSixtyFour, color: 'bg-red-500', shadow: 'shadow-red-500/50' },
  { id: 'faskasolid', title: 'FASKA Solid', desc: 'Tactical Stealth Action', icon: '📦', component: FaskaSolid, color: 'bg-slate-700', shadow: 'shadow-slate-700/50' },
  { id: 'faskagolfswarm', title: 'FASKA Golf (Pro)', desc: 'Advanced Physics Golf', icon: '⛳', component: FaskaGolfSwarm, color: 'bg-lime-700', shadow: 'shadow-lime-700/50' },
  { id: 'faskabillard', title: 'FASKA Billard', desc: '3D Pool Physics', icon: '🎱', component: FaskaBillard, color: 'bg-blue-800', shadow: 'shadow-blue-800/50' },

  // WAVE 3: SPORT & ARCADE SWARM
  { id: 'faskasoccerswarm', title: 'FASKA Soccer', desc: 'Top-Down Football', icon: '⚽', component: FaskaSoccerSwarm, color: 'bg-green-600', shadow: 'shadow-green-600/50' },
  { id: 'faskatennisswarm', title: 'FASKA Tennis', desc: 'Arcade Tennis', icon: '🎾', component: FaskaTennisSwarm, color: 'bg-yellow-400', shadow: 'shadow-yellow-400/50' },
  { id: 'faskafrisbeeswarm', title: 'FASKA Frisbee', desc: 'Wind Physics Frisbee', icon: '🥏', component: FaskaFrisbeeSwarm, color: 'bg-cyan-500', shadow: 'shadow-cyan-500/50' },
  { id: 'faskainvadersswarm', title: 'FASKA Space', desc: 'Retro Space Invaders', icon: '👾', component: FaskaInvadersSwarm, color: 'bg-indigo-800', shadow: 'shadow-indigo-800/50' },
  { id: 'faskartypeswarm', title: 'FASKA R-Type', desc: 'Side-Scroller Shooter', icon: '🚀', component: FaskaRTypeSwarm, color: 'bg-red-900', shadow: 'shadow-red-900/50' },

  // WAVE 4: 3D RACING & VEHICLES SWARM
  { id: 'faskafzeroswarm', title: 'FASKA F-Zero', desc: '3D Anti-Gravity Racing', icon: '🛸', component: FaskaFZeroSwarm, color: 'bg-cyan-600', shadow: 'shadow-cyan-600/50' },
  { id: 'faskarallyswarm', title: 'FASKA Rally', desc: '3D Offroad Drift', icon: '🏜️', component: FaskaRallySwarm, color: 'bg-orange-600', shadow: 'shadow-orange-600/50' },
  { id: 'faskaridgeswarm', title: 'FASKA Ridge', desc: '3D Arcade Drift Racing', icon: '🏎️', component: FaskaRidgeSwarm, color: 'bg-red-500', shadow: 'shadow-red-500/50' },
  { id: 'faskarockracingswarm', title: 'FASKA Rock Racing', desc: 'Iso-Combat Racing', icon: '🎸', component: FaskaRockRacingSwarm, color: 'bg-zinc-700', shadow: 'shadow-zinc-700/50' },
  { id: 'faskarcswarm', title: 'FASKA RC', desc: 'Top-Down Micro Racing', icon: '📻', component: FaskaRCSwarm, color: 'bg-blue-600', shadow: 'shadow-blue-600/50' },

  // THE NEW SWARM WAVE (Phase 6)
  { id: 'faskaadventure', title: 'FASKA Tentacle', desc: 'SCUMM Point-and-Click', icon: '🦑', component: FaskaAdventure, color: 'bg-purple-900', shadow: 'shadow-purple-900/50' },
  { id: 'faskaraider', title: 'FASKA Raider', desc: '3D Action Adventure', icon: '🧗', component: FaskaRaider, color: 'bg-emerald-900', shadow: 'shadow-emerald-900/50' },
  { id: 'faskakazooie', title: 'FASKA Kazooie', desc: '3D Platformer Duo', icon: '🐻', component: FaskaKazooie, color: 'bg-yellow-600', shadow: 'shadow-yellow-600/50' },
  { id: 'faskaastro', title: 'FASKA Astro', desc: 'Physics Robot Platformer', icon: '🤖', component: FaskaAstro, color: 'bg-indigo-500', shadow: 'shadow-indigo-500/50' },
  { id: 'faskaridge', title: 'FASKA Ridge', desc: 'Arcade Drift Racing', icon: '🏎️', component: FaskaRidge, color: 'bg-red-600', shadow: 'shadow-red-600/50' },
  { id: 'faskarally', title: 'FASKA Rally', desc: 'Offroad 3D Rally', icon: '🏜️', component: FaskaRally, color: 'bg-orange-800', shadow: 'shadow-orange-800/50' },
  { id: 'faskarockracing', title: 'FASKA Rock Racing', desc: 'Isometric Combat Racing', icon: '🎸', component: FaskaRockRacing, color: 'bg-zinc-800', shadow: 'shadow-zinc-800/50' },
  { id: 'faskarc', title: 'FASKA RC', desc: 'Top-Down Micro Racing', icon: '📻', component: FaskaRC, color: 'bg-blue-600', shadow: 'shadow-blue-600/50' },
  { id: 'faskabike', title: 'FASKA Bike', desc: '2D Motocross Track', icon: '🏍️', component: FaskaBike, color: 'bg-red-700', shadow: 'shadow-red-700/50' },
  { id: 'faskamotocross', title: 'FASKA Motocross', desc: 'Trick Motocross', icon: '🚵', component: FaskaMotocross, color: 'bg-purple-600', shadow: 'shadow-purple-600/50' },
  { id: 'faskakirby', title: 'FASKA Kirby', desc: 'Floaty Dream Platformer', icon: '⭐', component: FaskaKirby, color: 'bg-pink-400', shadow: 'shadow-pink-400/50' },
  { id: 'faskawolf', title: 'FASKA Wolf', desc: 'Raycast FPS Maze', icon: '🏰', component: FaskaWolf, color: 'bg-gray-800', shadow: 'shadow-gray-800/50' },
  { id: 'faskarpg', title: 'FASKA RPG', desc: 'Turn-based Strategy', icon: '🔮', component: FaskaRPG, color: 'bg-teal-700', shadow: 'shadow-teal-700/50' },
  { id: 'faskaalleyway', title: 'FASKA Alleyway', desc: 'Paddle & Ball', icon: '🧱', component: FaskaAlleyway, color: 'bg-sky-500', shadow: 'shadow-sky-500/50' },

  // Phase 5
  { id: 'faskafzero', title: 'FASKA Zero', desc: '3D Anti-Gravity Racing', icon: '🚀', component: FaskaFZero, color: 'bg-cyan-600', shadow: 'shadow-cyan-600/50' },
  { id: 'faskatonyhawk', title: 'FASKA Skater', desc: '3D Halfpipe Tricks', icon: '🛹', component: FaskaTonyHawk, color: 'bg-orange-500', shadow: 'shadow-orange-500/50' },
  { id: 'faskaff', title: 'FASKA Fantasy', desc: 'Turn-Based RPG', icon: '🗡️', component: FaskaFinalFantasy, color: 'bg-indigo-700', shadow: 'shadow-indigo-700/50' },
  { id: 'faskabomber', title: 'FASKA Bomber', desc: 'Grid Explosions', icon: '💣', component: FaskaBomberman, color: 'bg-red-600', shadow: 'shadow-red-600/50' },
  { id: 'faskamoorhuhn', title: 'FASKA Huhn', desc: 'Shooting Gallery', icon: '🎯', component: FaskaMoorhuhn, color: 'bg-green-700', shadow: 'shadow-green-700/50' },
  { id: 'faskagolf', title: 'FASKA Golf', desc: '3D Physics Golf', icon: '⛳', component: FaskaGolf, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' },
  { id: 'faskasnake', title: 'FASKA Snake', desc: 'Classic Growth', icon: '🐍', component: FaskaSnake, color: 'bg-lime-600', shadow: 'shadow-lime-600/50' },
  { id: 'faskadigdug', title: 'FASKA DigDug', desc: 'Underground Tunneling', icon: '⛏️', component: FaskaDigDug, color: 'bg-amber-700', shadow: 'shadow-amber-700/50' },
  { id: 'faskauno', title: 'FASKA Cards', desc: 'Logic Card Matching', icon: '🃏', component: FaskaUno, color: 'bg-rose-600', shadow: 'shadow-rose-600/50' },
  // Phase 4
  { id: 'faskamario64', title: 'FASKA 64', desc: '3D Collectathon Platformer', icon: '⭐', component: FaskaMario64, color: 'bg-red-500', shadow: 'shadow-red-500/50' },
  { id: 'faskamarble', title: 'FASKA Marble', desc: '3D Rolling Physics', icon: '🔮', component: FaskaMarbleMadness, color: 'bg-blue-400', shadow: 'shadow-blue-400/50' },
  { id: 'faskatekken', title: 'FASKA Fighter 3D', desc: '3D Arena Brawler', icon: '🥋', component: FaskaTekken, color: 'bg-zinc-800', shadow: 'shadow-zinc-800/50' },
  { id: 'faskacontra', title: 'FASKA Contra', desc: '2D Run and Gun', icon: '💥', component: FaskaContra, color: 'bg-green-800', shadow: 'shadow-green-800/50' },
  { id: 'faskainvaders', title: 'FASKA Invaders', desc: 'Classic Arcade Shooter', icon: '👾', component: FaskaSpaceInvaders, color: 'bg-purple-900', shadow: 'shadow-purple-900/50' },
  // Phase 3
  { id: 'faskazelda', title: 'FASKA Zelda', desc: 'Dungeon Puzzle Adventure', icon: '🗡️', component: FaskaZelda, color: 'bg-emerald-700', shadow: 'shadow-emerald-700/50' },
  { id: 'faskasonic', title: 'FASKA Sonic', desc: 'High-Speed Platformer', icon: '🦔', component: FaskaSonic, color: 'bg-blue-600', shadow: 'shadow-blue-600/50' },
  { id: 'faskartype', title: 'FASKA RType', desc: 'Galaktischer Space-Shooter', icon: '🚀', component: FaskaRType, color: 'bg-purple-800', shadow: 'shadow-purple-800/50' },
  { id: 'faskacrazytaxi', title: 'FASKA Taxi', desc: '3D City Driving', icon: '🚕', component: FaskaCrazyTaxi, color: 'bg-yellow-400', shadow: 'shadow-yellow-500/50' },
  { id: 'faskapinball', title: 'FASKA Pinball', desc: 'Physics-based Flipper', icon: '🕹️', component: FaskaPinball, color: 'bg-cyan-700', shadow: 'shadow-cyan-700/50' },
  { id: 'faskamicromachines', title: 'FASKA Micro', desc: 'Top-Down Drifting Racer', icon: '🏎️', component: FaskaMicroMachines, color: 'bg-red-600', shadow: 'shadow-red-600/50' },
  // Phase 2
  { id: 'faskadoom', title: 'FASKA Doom 3D', desc: 'First Person Mathe-Shooter!', icon: '🔫', component: FaskaDoom, color: 'bg-red-800', shadow: 'shadow-red-900/50' },
  { id: 'faskakart', title: 'FASKA Kart 3D', desc: 'Highspeed Mode-7 Racing!', icon: '🏎️', component: FaskaKart, color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50' },
  { id: 'faskafighter', title: 'FASKA Fighter 2', desc: '2D Street Fighter!', icon: '🥊', component: FaskaFighter, color: 'bg-orange-600', shadow: 'shadow-orange-600/50' },
  { id: 'faskaman', title: 'FASKA Man', desc: 'Sammle Wörter im Labyrinth!', icon: '🟡', component: FaskaMan, color: 'bg-yellow-500', shadow: 'shadow-yellow-500/50' },
  { id: 'faskablocks', title: 'FASKA Blocks', desc: 'Staple Blöcke und rechne mit!', icon: '🧱', component: FaskaBlocks, color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
  { id: 'faskajump', title: 'FASKA Jump', desc: 'Springe zur richtigen Antwort!', icon: '🍄', component: FaskaJump, color: 'bg-red-500', shadow: 'shadow-red-500/50' },
  { id: 'faskacross', title: 'FASKA Cross', desc: 'Überquere den Fluss sicher!', icon: '🐸', component: FaskaCross, color: 'bg-green-500', shadow: 'shadow-green-500/50' }
];

export default function GameEngineHub({ onExit }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    const GameComponent = activeGame.component;
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
        <ErrorBoundary onExit={() => setActiveGame(null)}>
          <Suspense fallback={<div className="text-white text-2xl font-bold animate-pulse">Lade Spiel...</div>}>
            <GameComponent onExit={() => setActiveGame(null)} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center relative overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-5xl">
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={onExit}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold backdrop-blur-md transition-all shadow-lg border border-white/20"
          >
            ← Zurück
          </button>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
              RETRO ARCADE (ULTIMATE)
            </h1>
            <p className="text-slate-300 mt-2 font-medium">Alle {GAMES.length} Engines der FASKA Collection!</p>
          </div>
          <div className="w-[100px]"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {GAMES.map((game) => (
            <motion.button
              key={game.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveGame(game)}
              className={`relative overflow-hidden rounded-3xl p-8 text-left transition-all ${game.color} ${game.shadow} shadow-2xl border-4 border-white/20 flex items-center gap-6 group`}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="text-7xl drop-shadow-xl bg-white/20 w-24 h-24 rounded-2xl flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
                {game.icon}
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white drop-shadow-md mb-1">{game.title}</h2>
                <p className="text-white/90 font-medium text-lg drop-shadow-sm">{game.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
