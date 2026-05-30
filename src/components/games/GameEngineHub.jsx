import React, { useEffect, useState, Suspense, lazy } from 'react';
import { motion as Motion } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary';

const Faska64Part2 = lazy(() => import('./engines/Faska64Part2/Faska64Part2').catch(() => ({ default: () => <div className="text-white p-8">Error loading Faska64Part2</div> })));
const FaskaAlleyway = lazy(() => import('./engines/FaskaAlleyway/FaskaAlleyway').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaAlleyway</div> })));
const FaskaAstro = lazy(() => import('./engines/FaskaAstro/FaskaAstro').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaAstro</div> })));
const FaskaAstroSwarm = lazy(() => import('./engines/FaskaAstroSwarm/FaskaAstroSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaAstroSwarm</div> })));
const FaskaDarkCitadel = lazy(() => import('./engines/FaskaDarkCitadel/FaskaDarkCitadel').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaDarkCitadel</div> })));
const FaskaLearncadeRPG = lazy(() => import('./engines/FaskaLearncadeRPG/FaskaLearncadeRPG').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaLearncadeRPG</div> })));
const FaskaCoreArcade = lazy(() => import('./engines/FaskaCoreArcade/FaskaCoreArcade').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaCoreArcade</div> })));
const FaskaBike = lazy(() => import('./engines/FaskaBike/FaskaBike').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaBike</div> })));
const FaskaBillard = lazy(() => import('./engines/FaskaBillard/FaskaBillard').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaBillard</div> })));
const FaskaBlocks = lazy(() => import('./engines/FaskaBlocks/FaskaBlocks').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaBlocks</div> })));
const FaskaBlocksSwarm = lazy(() => import('./engines/FaskaBlocksSwarm/FaskaBlocksSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaBlocksSwarm</div> })));
const FaskaBomberman = lazy(() => import('./engines/FaskaBomberman/FaskaBomberman').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaBomberman</div> })));
const FaskaBombermanSwarm = lazy(() => import('./engines/FaskaBombermanSwarm/FaskaBombermanSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaBombermanSwarm</div> })));
const FaskaBreakout = lazy(() => import('./engines/FaskaBreakout/FaskaBreakout').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaBreakout</div> })));
const FaskaBreakoutSwarm = lazy(() => import('./engines/FaskaBreakoutSwarm/FaskaBreakoutSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaBreakoutSwarm</div> })));
const FaskaContra = lazy(() => import('./engines/FaskaContra/FaskaContra').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaContra</div> })));
const FaskaContraSwarm = lazy(() => import('./engines/FaskaContraSwarm/FaskaContraSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaContraSwarm</div> })));
const FaskaCrazyTaxi = lazy(() => import('./engines/FaskaCrazyTaxi/FaskaCrazyTaxi').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaCrazyTaxi</div> })));
const FaskaCrazyTaxiSwarm = lazy(() => import('./engines/FaskaCrazyTaxiSwarm/FaskaCrazyTaxiSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaCrazyTaxiSwarm</div> })));
const FaskaCross = lazy(() => import('./engines/FaskaCross/FaskaCross').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaCross</div> })));
const FaskaDigDug = lazy(() => import('./engines/FaskaDigDug/FaskaDigDug').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaDigDug</div> })));
const FaskaDoom = lazy(() => import('./engines/FaskaDoom/FaskaDoom').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaDoom</div> })));
const FaskaDoomSwarm = lazy(() => import('./engines/FaskaDoomSwarm/FaskaDoomSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaDoomSwarm</div> })));
const FaskaExciteSwarm = lazy(() => import('./engines/FaskaExciteSwarm/FaskaExciteSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaExciteSwarm</div> })));
const FaskaFantasySwarm = lazy(() => import('./engines/FaskaFantasySwarm/FaskaFantasySwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaFantasySwarm</div> })));
const FaskaFighter = lazy(() => import('./engines/FaskaFighter/FaskaFighter').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaFighter</div> })));
const FaskaFighter3 = lazy(() => import('./engines/FaskaFighter3/FaskaFighter3').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaFighter3</div> })));
const FaskaFinalFantasy = lazy(() => import('./engines/FaskaFinalFantasy/FaskaFinalFantasy').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaFinalFantasy</div> })));
const FaskaForces = lazy(() => import('./engines/FaskaForces/FaskaForces').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaForces</div> })));
const FaskaFrisbeeSwarm = lazy(() => import('./engines/FaskaFrisbeeSwarm/FaskaFrisbeeSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaFrisbeeSwarm</div> })));
const FaskaFZero = lazy(() => import('./engines/FaskaFZero/FaskaFZero').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaFZero</div> })));
const FaskaFZeroSwarm = lazy(() => import('./engines/FaskaFZeroSwarm/FaskaFZeroSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaFZeroSwarm</div> })));
const FaskaGolf = lazy(() => import('./engines/FaskaGolf/FaskaGolf').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaGolf</div> })));
const FaskaGolfSwarm = lazy(() => import('./engines/FaskaGolfSwarm/FaskaGolfSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaGolfSwarm</div> })));
const FaskaInvadersSwarm = lazy(() => import('./engines/FaskaInvadersSwarm/FaskaInvadersSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaInvadersSwarm</div> })));
const FaskaJump = lazy(() => import('./engines/FaskaJump/FaskaJump').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaJump</div> })));
const FaskaKart = lazy(() => import('./engines/FaskaKart/FaskaKart').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaKart</div> })));
const FaskaKartSwarm = lazy(() => import('./engines/FaskaKartSwarm/FaskaKartSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaKartSwarm</div> })));
const FaskaKazooie = lazy(() => import('./engines/FaskaKazooie/FaskaKazooie').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaKazooie</div> })));
const FaskaKazooieSwarm = lazy(() => import('./engines/FaskaKazooieSwarm/FaskaKazooieSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaKazooieSwarm</div> })));
const FaskaKirby = lazy(() => import('./engines/FaskaKirby/FaskaKirby').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaKirby</div> })));
const FaskaKirbySwarm = lazy(() => import('./engines/FaskaKirbySwarm/FaskaKirbySwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaKirbySwarm</div> })));
const FaskaLand = lazy(() => import('./engines/FaskaLand/FaskaLand').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaLand</div> })));
const FaskaMan = lazy(() => import('./engines/FaskaMan/FaskaMan').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaMan</div> })));
const FaskaMarbleMadness = lazy(() => import('./engines/FaskaMarbleMadness/FaskaMarbleMadness').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaMarbleMadness</div> })));
const FaskaMarbleSwarm = lazy(() => import('./engines/FaskaMarbleSwarm/FaskaMarbleSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaMarbleSwarm</div> })));
const FaskaMario64 = lazy(() => import('./engines/FaskaMario64/FaskaMario64').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaMario64</div> })));
const FaskaMicroMachines = lazy(() => import('./engines/FaskaMicroMachines/FaskaMicroMachines').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaMicroMachines</div> })));
const FaskaMicroMachinesSwarm = lazy(() => import('./engines/FaskaMicroMachinesSwarm/FaskaMicroMachinesSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaMicroMachinesSwarm</div> })));
const FaskaMoorhuhn = lazy(() => import('./engines/FaskaMoorhuhn/FaskaMoorhuhn').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaMoorhuhn</div> })));
const FaskaMoorhuhnSwarm = lazy(() => import('./engines/FaskaMoorhuhnSwarm/FaskaMoorhuhnSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaMoorhuhnSwarm</div> })));
const FaskaMotocross = lazy(() => import('./engines/FaskaMotocross/FaskaMotocross').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaMotocross</div> })));
const FaskaPacSwarm = lazy(() => import('./engines/FaskaPacSwarm/FaskaPacSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaPacSwarm</div> })));
const FaskaPinball = lazy(() => import('./engines/FaskaPinball/FaskaPinball').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaPinball</div> })));
const FaskaPinballSwarm = lazy(() => import('./engines/FaskaPinballSwarm/FaskaPinballSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaPinballSwarm</div> })));
const FaskaRage = lazy(() => import('./engines/FaskaRage/FaskaRage').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRage</div> })));
const FaskaRaider = lazy(() => import('./engines/FaskaRaider/FaskaRaider').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRaider</div> })));
const FaskaRaider2 = lazy(() => import('./engines/FaskaRaider2/FaskaRaider2').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRaider2</div> })));
const FaskaRally = lazy(() => import('./engines/FaskaRally/FaskaRally').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRally</div> })));
const FaskaRallySwarm = lazy(() => import('./engines/FaskaRallySwarm/FaskaRallySwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRallySwarm</div> })));
const FaskaRC = lazy(() => import('./engines/FaskaRC/FaskaRC').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRC</div> })));
const FaskaRCSwarm = lazy(() => import('./engines/FaskaRCSwarm/FaskaRCSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRCSwarm</div> })));
const FaskaRidge = lazy(() => import('./engines/FaskaRidge/FaskaRidge').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRidge</div> })));
const FaskaRidgeSwarm = lazy(() => import('./engines/FaskaRidgeSwarm/FaskaRidgeSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRidgeSwarm</div> })));
const FaskaRockRacing = lazy(() => import('./engines/FaskaRockRacing/FaskaRockRacing').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRockRacing</div> })));
const FaskaRockRacingSwarm = lazy(() => import('./engines/FaskaRockRacingSwarm/FaskaRockRacingSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRockRacingSwarm</div> })));
const FaskaRPG = lazy(() => import('./engines/FaskaRPG/FaskaRPG').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRPG</div> })));
const FaskaRType = lazy(() => import('./engines/FaskaRType/FaskaRType').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRType</div> })));
const FaskaRTypeSwarm = lazy(() => import('./engines/FaskaRTypeSwarm/FaskaRTypeSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaRTypeSwarm</div> })));
const FaskaSixtyFour = lazy(() => import('./engines/FaskaSixtyFour/FaskaSixtyFour').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSixtyFour</div> })));
const FaskaSkater2 = lazy(() => import('./engines/FaskaSkater2/FaskaSkater2').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSkater2</div> })));
const FaskaSnake = lazy(() => import('./engines/FaskaSnake/FaskaSnake').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSnake</div> })));
const FaskaSnakeSwarm = lazy(() => import('./engines/FaskaSnakeSwarm/FaskaSnakeSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSnakeSwarm</div> })));
const FaskaSoccerSwarm = lazy(() => import('./engines/FaskaSoccerSwarm/FaskaSoccerSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSoccerSwarm</div> })));
const FaskaSolid = lazy(() => import('./engines/FaskaSolid/FaskaSolid').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSolid</div> })));
const FaskaSonic = lazy(() => import('./engines/FaskaSonic/FaskaSonic').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSonic</div> })));
const FaskaSonicSwarm = lazy(() => import('./engines/FaskaSonicSwarm/FaskaSonicSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSonicSwarm</div> })));
const FaskaSpaceInvaders = lazy(() => import('./engines/FaskaSpaceInvaders/FaskaSpaceInvaders').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSpaceInvaders</div> })));
const FaskaSpaceInvadersSwarm = lazy(() => import('./engines/FaskaSpaceInvadersSwarm/FaskaSpaceInvadersSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSpaceInvadersSwarm</div> })));
const FaskaSpaceOdyssey = lazy(() => import('./engines/FaskaSpaceOdyssey/FaskaSpaceOdyssey').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaSpaceOdyssey</div> })));
const FaskaEpicRPG = lazy(() => import('./engines/FaskaLearncadeRPG/FaskaLearncadeRPG').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaEpicRPG</div> })));
const FaskaTekken = lazy(() => import('./engines/FaskaTekken/FaskaTekken').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaTekken</div> })));
const FaskaTekkenSwarm = lazy(() => import('./engines/FaskaTekkenSwarm/FaskaTekkenSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaTekkenSwarm</div> })));
const FaskaTennisSwarm = lazy(() => import('./engines/FaskaTennisSwarm/FaskaTennisSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaTennisSwarm</div> })));
const FaskaTombSwarm = lazy(() => import('./engines/FaskaTombSwarm/FaskaTombSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaTombSwarm</div> })));
const FaskaTonyHawk = lazy(() => import('./engines/FaskaTonyHawk/FaskaTonyHawk').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaTonyHawk</div> })));
const FaskaTonyHawkSwarm = lazy(() => import('./engines/FaskaTonyHawkSwarm/FaskaTonyHawkSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaTonyHawkSwarm</div> })));
const FaskaTurtles = lazy(() => import('./engines/FaskaTurtles/FaskaTurtles').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaTurtles</div> })));
const FaskaUno = lazy(() => import('./engines/FaskaUno/FaskaUno').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaUno</div> })));
const FaskaWario = lazy(() => import('./engines/FaskaWario/FaskaWario').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaWario</div> })));
const FaskaWolf = lazy(() => import('./engines/FaskaWolf/FaskaWolf').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaWolf</div> })));
const FaskaWolfSwarm = lazy(() => import('./engines/FaskaWolfSwarm/FaskaWolfSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaWolfSwarm</div> })));
const FaskaWorld = lazy(() => import('./engines/FaskaWorld/FaskaWorld').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaWorld</div> })));
const FaskaZelda = lazy(() => import('./engines/FaskaZelda/FaskaZelda').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaZelda</div> })));
const FaskaZeldaSwarm = lazy(() => import('./engines/FaskaZeldaSwarm/FaskaZeldaSwarm').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaZeldaSwarm</div> })));
const FaskaZero2 = lazy(() => import('./engines/FaskaZero2/FaskaZero2').catch(() => ({ default: () => <div className="text-white p-8">Error loading FaskaZero2</div> })));
const GAMES = [
  { id: 'faskalearncaderpg', title: 'Animal Friends RPG', desc: 'Interaktive Lern-Welt', icon: '🌍', component: FaskaLearncadeRPG, color: 'bg-emerald-600', shadow: 'shadow-emerald-500/30' },
  { id: 'faskadarkcitadel', title: 'FASKA Dark Citadel', desc: '3D Soulslike Combat Vertical', icon: '⚔️', component: FaskaDarkCitadel, color: 'bg-rose-950', shadow: 'shadow-rose-500/30' },
  { id: 'faskacorearcade', title: 'FASKA Core Arcade', desc: '6 stabile Spiele + Lernmodus', icon: '🎯', component: FaskaCoreArcade, color: 'bg-amber-500', shadow: 'shadow-amber-300/20' },
  { id: 'faska64part2', title: 'FASKA 64Part2', desc: 'Retro Arcade Game', icon: '🕹️', component: Faska64Part2, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskaalleyway', title: 'FASKA Alleyway', desc: 'Retro Arcade Game', icon: '👾', component: FaskaAlleyway, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskaastro', title: 'FASKA Astro', desc: 'Retro Arcade Game', icon: '🚀', component: FaskaAstro, color: 'bg-emerald-600', shadow: 'shadow-white/10' },
  { id: 'faskaastroswarm', title: 'FASKA Astro (Pro)', desc: 'Retro Arcade Game', icon: '🏎️', component: FaskaAstroSwarm, color: 'bg-rose-600', shadow: 'shadow-white/10' },
  { id: 'faskabike', title: 'FASKA Bike', desc: 'Retro Arcade Game', icon: '🎮', component: FaskaBike, color: 'bg-amber-500', shadow: 'shadow-white/10' },
  { id: 'faskabillard', title: 'FASKA Billard', desc: 'Retro Arcade Game', icon: '⚔️', component: FaskaBillard, color: 'bg-purple-600', shadow: 'shadow-white/10' },
  { id: 'faskablocks', title: 'FASKA Blocks', desc: 'Retro Arcade Game', icon: '🛡️', component: FaskaBlocks, color: 'bg-pink-600', shadow: 'shadow-white/10' },
  { id: 'faskabomberman', title: 'FASKA Bomberman', desc: 'Retro Arcade Game', icon: '💣', component: FaskaBomberman, color: 'bg-teal-600', shadow: 'shadow-white/10' },
  { id: 'faskabombermanswarm', title: 'FASKA Bomberman (Pro)', desc: 'Retro Arcade Game', icon: '⭐', component: FaskaBombermanSwarm, color: 'bg-zinc-800', shadow: 'shadow-white/10' },
  { id: 'faskabreakout', title: 'FASKA Breakout', desc: 'Retro Arcade Game', icon: '🛹', component: FaskaBreakout, color: 'bg-orange-500', shadow: 'shadow-white/10' },
  { id: 'faskabreakoutswarm', title: 'FASKA Breakout (Pro)', desc: 'Retro Arcade Game', icon: '🏁', component: FaskaBreakoutSwarm, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskacontra', title: 'FASKA Contra', desc: 'Retro Arcade Game', icon: '⚽', component: FaskaContra, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskacontraswarm', title: 'FASKA Contra (Pro)', desc: 'Retro Arcade Game', icon: '🐍', component: FaskaContraSwarm, color: 'bg-emerald-600', shadow: 'shadow-white/10' },
  { id: 'faskacrazytaxi', title: 'FASKA CrazyTaxi', desc: 'Retro Arcade Game', icon: '🧩', component: FaskaCrazyTaxi, color: 'bg-rose-600', shadow: 'shadow-white/10' },
  { id: 'faskacrazytaxiswarm', title: 'FASKA CrazyTaxi (Pro)', desc: 'Retro Arcade Game', icon: '🕹️', component: FaskaCrazyTaxiSwarm, color: 'bg-amber-500', shadow: 'shadow-white/10' },
  { id: 'faskacross', title: 'FASKA Cross', desc: 'Retro Arcade Game', icon: '👾', component: FaskaCross, color: 'bg-purple-600', shadow: 'shadow-white/10' },
  { id: 'faskadigdug', title: 'FASKA DigDug', desc: 'Retro Arcade Game', icon: '🚀', component: FaskaDigDug, color: 'bg-pink-600', shadow: 'shadow-white/10' },
  { id: 'faskadoom', title: 'FASKA Doom', desc: 'Retro Arcade Game', icon: '🏎️', component: FaskaDoom, color: 'bg-teal-600', shadow: 'shadow-white/10' },
  { id: 'faskadoomswarm', title: 'FASKA Doom (Pro)', desc: 'Retro Arcade Game', icon: '🎮', component: FaskaDoomSwarm, color: 'bg-zinc-800', shadow: 'shadow-white/10' },
  { id: 'faskaexciteswarm', title: 'FASKA Excite (Pro)', desc: 'Retro Arcade Game', icon: '⚔️', component: FaskaExciteSwarm, color: 'bg-orange-500', shadow: 'shadow-white/10' },
  { id: 'faskafantasyswarm', title: 'FASKA Fantasy (Pro)', desc: 'Retro Arcade Game', icon: '🛡️', component: FaskaFantasySwarm, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskafighter', title: 'FASKA Fighter', desc: 'Retro Arcade Game', icon: '💣', component: FaskaFighter, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskaepicrpg', title: 'FASKA Epic RPG', desc: 'New AAA Adventure', icon: '🏰', component: FaskaEpicRPG, color: 'bg-yellow-600', shadow: 'shadow-white/10' },
  { id: 'faskaspaceodyssey', title: 'Space Odyssey', desc: 'New AAA Shooter', icon: '🚀', component: FaskaSpaceOdyssey, color: 'bg-purple-700', shadow: 'shadow-white/10' },
  { id: 'faskasnakeswarm', title: 'FASKA Snake (Pro)', desc: 'Retro Arcade Game', icon: '🐍', component: FaskaSnakeSwarm, color: 'bg-green-600', shadow: 'shadow-white/10' },
  { id: 'faskamoorhuhnswarm', title: 'FASKA Moorhuhn (Pro)', desc: 'Retro Arcade Game', icon: '🦆', component: FaskaMoorhuhnSwarm, color: 'bg-orange-600', shadow: 'shadow-white/10' },
  { id: 'faskablocksswarm', title: 'FASKA Blocks (Pro)', desc: 'Retro Arcade Game', icon: '🟦', component: FaskaBlocksSwarm, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskaspaceinvadersswarm', title: 'FASKA Invaders (Pro)', desc: 'Retro Arcade Game', icon: '👾', component: FaskaSpaceInvadersSwarm, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskamicromachinesswarm', title: 'FASKA MicroMachines (Pro)', desc: 'Retro Arcade Game', icon: '🏎️', component: FaskaMicroMachinesSwarm, color: 'bg-red-600', shadow: 'shadow-white/10' },
  { id: 'faskafighter3', title: 'FASKA Fighter (Pro)', desc: 'Retro Arcade Game', icon: '🥋', component: FaskaFighter3, color: 'bg-red-600', shadow: 'shadow-white/10' },
  { id: 'faskafinalfantasy', title: 'FASKA FinalFantasy', desc: 'Retro Arcade Game', icon: '🛹', component: FaskaFinalFantasy, color: 'bg-rose-600', shadow: 'shadow-white/10' },
  { id: 'faskaforces', title: 'FASKA Forces', desc: 'Retro Arcade Game', icon: '🏁', component: FaskaForces, color: 'bg-amber-500', shadow: 'shadow-white/10' },
  { id: 'faskafrisbeeswarm', title: 'FASKA Frisbee (Pro)', desc: 'Retro Arcade Game', icon: '⚽', component: FaskaFrisbeeSwarm, color: 'bg-purple-600', shadow: 'shadow-white/10' },
  { id: 'faskafzero', title: 'FASKA FZero', desc: 'Retro Arcade Game', icon: '🐍', component: FaskaFZero, color: 'bg-pink-600', shadow: 'shadow-white/10' },
  { id: 'faskafzeroswarm', title: 'FASKA FZero (Pro)', desc: 'Retro Arcade Game', icon: '🧩', component: FaskaFZeroSwarm, color: 'bg-teal-600', shadow: 'shadow-white/10' },
  { id: 'faskagolf', title: 'FASKA Golf', desc: 'Retro Arcade Game', icon: '🕹️', component: FaskaGolf, color: 'bg-zinc-800', shadow: 'shadow-white/10' },
  { id: 'faskagolfswarm', title: 'FASKA Golf (Pro)', desc: 'Retro Arcade Game', icon: '👾', component: FaskaGolfSwarm, color: 'bg-orange-500', shadow: 'shadow-white/10' },
  { id: 'faskainvadersswarm', title: 'FASKA Invaders (Pro)', desc: 'Retro Arcade Game', icon: '🚀', component: FaskaInvadersSwarm, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskajump', title: 'FASKA Jump', desc: 'Retro Arcade Game', icon: '🏎️', component: FaskaJump, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskakart', title: 'FASKA Kart', desc: 'Retro Arcade Game', icon: '🎮', component: FaskaKart, color: 'bg-emerald-600', shadow: 'shadow-white/10' },
  { id: 'faskakartswarm', title: 'FASKA Kart (Pro)', desc: 'Retro Arcade Game', icon: '⚔️', component: FaskaKartSwarm, color: 'bg-rose-600', shadow: 'shadow-white/10' },
  { id: 'faskakazooie', title: 'FASKA Kazooie', desc: 'Retro Arcade Game', icon: '🛡️', component: FaskaKazooie, color: 'bg-amber-500', shadow: 'shadow-white/10' },
  { id: 'faskakazooieswarm', title: 'FASKA Kazooie (Pro)', desc: 'Retro Arcade Game', icon: '💣', component: FaskaKazooieSwarm, color: 'bg-purple-600', shadow: 'shadow-white/10' },
  { id: 'faskakirby', title: 'FASKA Kirby', desc: 'Retro Arcade Game', icon: '⭐', component: FaskaKirby, color: 'bg-pink-600', shadow: 'shadow-white/10' },
  { id: 'faskakirbyswarm', title: 'FASKA Kirby (Pro)', desc: 'Retro Arcade Game', icon: '🛹', component: FaskaKirbySwarm, color: 'bg-teal-600', shadow: 'shadow-white/10' },
  { id: 'faskaland', title: 'FASKA Land', desc: 'Retro Arcade Game', icon: '🏁', component: FaskaLand, color: 'bg-zinc-800', shadow: 'shadow-white/10' },
  { id: 'faskaman', title: 'FASKA Man', desc: 'Retro Arcade Game', icon: '⚽', component: FaskaMan, color: 'bg-orange-500', shadow: 'shadow-white/10' },
  { id: 'faskamarblemadness', title: 'FASKA MarbleMadness', desc: 'Retro Arcade Game', icon: '🐍', component: FaskaMarbleMadness, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskamarbleswarm', title: 'FASKA Marble (Pro)', desc: 'Retro Arcade Game', icon: '🧩', component: FaskaMarbleSwarm, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskamario64', title: 'FASKA Mario64', desc: 'Retro Arcade Game', icon: '🕹️', component: FaskaMario64, color: 'bg-emerald-600', shadow: 'shadow-white/10' },
  { id: 'faskamicromachines', title: 'FASKA MicroMachines', desc: 'Retro Arcade Game', icon: '👾', component: FaskaMicroMachines, color: 'bg-rose-600', shadow: 'shadow-white/10' },
  { id: 'faskamoorhuhn', title: 'FASKA Moorhuhn', desc: 'Retro Arcade Game', icon: '🚀', component: FaskaMoorhuhn, color: 'bg-amber-500', shadow: 'shadow-white/10' },
  { id: 'faskamotocross', title: 'FASKA Motocross', desc: 'Retro Arcade Game', icon: '🏎️', component: FaskaMotocross, color: 'bg-purple-600', shadow: 'shadow-white/10' },
  { id: 'faskapacswarm', title: 'FASKA Pac (Pro)', desc: 'Retro Arcade Game', icon: '🎮', component: FaskaPacSwarm, color: 'bg-pink-600', shadow: 'shadow-white/10' },
  { id: 'faskapinball', title: 'FASKA Pinball', desc: 'Retro Arcade Game', icon: '⚔️', component: FaskaPinball, color: 'bg-teal-600', shadow: 'shadow-white/10' },
  { id: 'faskapinballswarm', title: 'FASKA Pinball (Pro)', desc: 'Retro Arcade Game', icon: '🛡️', component: FaskaPinballSwarm, color: 'bg-zinc-800', shadow: 'shadow-white/10' },
  { id: 'faskarage', title: 'FASKA Rage', desc: 'Retro Arcade Game', icon: '💣', component: FaskaRage, color: 'bg-orange-500', shadow: 'shadow-white/10' },
  { id: 'faskaraider', title: 'FASKA Raider', desc: 'Retro Arcade Game', icon: '⭐', component: FaskaRaider, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskaraider2', title: 'FASKA Raider2', desc: 'Retro Arcade Game', icon: '🛹', component: FaskaRaider2, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskarally', title: 'FASKA Rally', desc: 'Retro Arcade Game', icon: '🏁', component: FaskaRally, color: 'bg-emerald-600', shadow: 'shadow-white/10' },
  { id: 'faskarallyswarm', title: 'FASKA Rally (Pro)', desc: 'Retro Arcade Game', icon: '⚽', component: FaskaRallySwarm, color: 'bg-rose-600', shadow: 'shadow-white/10' },
  { id: 'faskarc', title: 'FASKA RC', desc: 'Retro Arcade Game', icon: '🐍', component: FaskaRC, color: 'bg-amber-500', shadow: 'shadow-white/10' },
  { id: 'faskarcswarm', title: 'FASKA RC (Pro)', desc: 'Retro Arcade Game', icon: '🧩', component: FaskaRCSwarm, color: 'bg-purple-600', shadow: 'shadow-white/10' },
  { id: 'faskaridge', title: 'FASKA Ridge', desc: 'Retro Arcade Game', icon: '🕹️', component: FaskaRidge, color: 'bg-pink-600', shadow: 'shadow-white/10' },
  { id: 'faskaridgeswarm', title: 'FASKA Ridge (Pro)', desc: 'Retro Arcade Game', icon: '👾', component: FaskaRidgeSwarm, color: 'bg-teal-600', shadow: 'shadow-white/10' },
  { id: 'faskarockracing', title: 'FASKA RockRacing', desc: 'Retro Arcade Game', icon: '🚀', component: FaskaRockRacing, color: 'bg-zinc-800', shadow: 'shadow-white/10' },
  { id: 'faskarockracingswarm', title: 'FASKA RockRacing (Pro)', desc: 'Retro Arcade Game', icon: '🏎️', component: FaskaRockRacingSwarm, color: 'bg-orange-500', shadow: 'shadow-white/10' },
  { id: 'faskarpg', title: 'FASKA RPG', desc: 'Retro Arcade Game', icon: '🎮', component: FaskaRPG, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskartype', title: 'FASKA RType', desc: 'Retro Arcade Game', icon: '⚔️', component: FaskaRType, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskartypeswarm', title: 'FASKA RType (Pro)', desc: 'Retro Arcade Game', icon: '🛡️', component: FaskaRTypeSwarm, color: 'bg-emerald-600', shadow: 'shadow-white/10' },
  { id: 'faskasixtyfour', title: 'FASKA SixtyFour', desc: 'Retro Arcade Game', icon: '💣', component: FaskaSixtyFour, color: 'bg-rose-600', shadow: 'shadow-white/10' },
  { id: 'faskaskater2', title: 'FASKA Skater2', desc: 'Retro Arcade Game', icon: '⭐', component: FaskaSkater2, color: 'bg-amber-500', shadow: 'shadow-white/10' },
  { id: 'faskasnake', title: 'FASKA Snake', desc: 'Retro Arcade Game', icon: '🛹', component: FaskaSnake, color: 'bg-purple-600', shadow: 'shadow-white/10' },
  { id: 'faskasoccerswarm', title: 'FASKA Soccer (Pro)', desc: 'Retro Arcade Game', icon: '🏁', component: FaskaSoccerSwarm, color: 'bg-pink-600', shadow: 'shadow-white/10' },
  { id: 'faskasolid', title: 'FASKA Solid', desc: 'Retro Arcade Game', icon: '⚽', component: FaskaSolid, color: 'bg-teal-600', shadow: 'shadow-white/10' },
  { id: 'faskasonic', title: 'FASKA Sonic', desc: 'Retro Arcade Game', icon: '🐍', component: FaskaSonic, color: 'bg-zinc-800', shadow: 'shadow-white/10' },
  { id: 'faskasonicswarm', title: 'FASKA Sonic (Pro)', desc: 'Retro Arcade Game', icon: '🧩', component: FaskaSonicSwarm, color: 'bg-orange-500', shadow: 'shadow-white/10' },
  { id: 'faskaspaceinvaders', title: 'FASKA SpaceInvaders', desc: 'Retro Arcade Game', icon: '🕹️', component: FaskaSpaceInvaders, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskatekken', title: 'FASKA Tekken', desc: 'Retro Arcade Game', icon: '👾', component: FaskaTekken, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskatekkenswarm', title: 'FASKA Tekken (Pro)', desc: 'Retro Arcade Game', icon: '🚀', component: FaskaTekkenSwarm, color: 'bg-emerald-600', shadow: 'shadow-white/10' },
  { id: 'faskatennisswarm', title: 'FASKA Tennis (Pro)', desc: 'Retro Arcade Game', icon: '🏎️', component: FaskaTennisSwarm, color: 'bg-rose-600', shadow: 'shadow-white/10' },
  { id: 'faskatombswarm', title: 'FASKA Tomb (Pro)', desc: 'Retro Arcade Game', icon: '🎮', component: FaskaTombSwarm, color: 'bg-amber-500', shadow: 'shadow-white/10' },
  { id: 'faskatonyhawk', title: 'FASKA TonyHawk', desc: 'Retro Arcade Game', icon: '⚔️', component: FaskaTonyHawk, color: 'bg-purple-600', shadow: 'shadow-white/10' },
  { id: 'faskatonyhawkswarm', title: 'FASKA TonyHawk (Pro)', desc: 'Retro Arcade Game', icon: '🛡️', component: FaskaTonyHawkSwarm, color: 'bg-pink-600', shadow: 'shadow-white/10' },
  { id: 'faskaturtles', title: 'FASKA Turtles', desc: 'Retro Arcade Game', icon: '💣', component: FaskaTurtles, color: 'bg-teal-600', shadow: 'shadow-white/10' },
  { id: 'faskauno', title: 'FASKA Uno', desc: 'Retro Arcade Game', icon: '⭐', component: FaskaUno, color: 'bg-zinc-800', shadow: 'shadow-white/10' },
  { id: 'faskawario', title: 'FASKA Wario', desc: 'Retro Arcade Game', icon: '🛹', component: FaskaWario, color: 'bg-orange-500', shadow: 'shadow-white/10' },
  { id: 'faskawolf', title: 'FASKA Wolf', desc: 'Retro Arcade Game', icon: '🏁', component: FaskaWolf, color: 'bg-indigo-600', shadow: 'shadow-white/10' },
  { id: 'faskawolfswarm', title: 'FASKA Wolf (Pro)', desc: 'Retro Arcade Game', icon: '⚽', component: FaskaWolfSwarm, color: 'bg-blue-600', shadow: 'shadow-white/10' },
  { id: 'faskaworld', title: 'FASKA World', desc: 'Retro Arcade Game', icon: '🐍', component: FaskaWorld, color: 'bg-emerald-600', shadow: 'shadow-white/10' },
  { id: 'faskazelda', title: 'FASKA Zelda', desc: 'Retro Arcade Game', icon: '🧩', component: FaskaZelda, color: 'bg-rose-600', shadow: 'shadow-white/10' },
  { id: 'faskazeldaswarm', title: 'FASKA Zelda (Pro)', desc: 'Retro Arcade Game', icon: '🕹️', component: FaskaZeldaSwarm, color: 'bg-amber-500', shadow: 'shadow-white/10' },
  { id: 'faskazero2', title: 'FASKA Zero2', desc: 'Retro Arcade Game', icon: '👾', component: FaskaZero2, color: 'bg-purple-600', shadow: 'shadow-white/10' },
];

const findGameFromUrl = () => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('game');
  return GAMES.find((game) => game.id === gameId) || null;
};

const writeGameToUrl = (game) => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('mode', 'arcade');
  if (game) {
    url.searchParams.set('game', game.id);
  } else {
    url.searchParams.delete('game');
  }
  window.history.pushState({}, '', url);
};

export default function GameEngineHub({ onExit }) {
  const [activeGame, setActiveGame] = useState(() => findGameFromUrl());
  const [appMode, setAppMode] = useState('arcade'); // 'arcade', 'learncade', 'argschade'
  const isLearncade = appMode === 'learncade';

  const PREMIUM_GAMES = ['faskatonyhawkswarm', 'faskakartswarm', 'faskasixtyfour', 'faskadarkcitadel', 'faskacorearcade'];
  
  const filteredGames = GAMES.filter(game => {
    // Wenn Argschade aktiv ist, zeige ALLE Spiele, die nicht Premium sind und nicht RPG
    if (appMode === 'argschade') {
      return !PREMIUM_GAMES.includes(game.id) && game.id !== 'faskalearncaderpg';
    }
    // Learncade zeigt NUR das RPG
    if (appMode === 'learncade') {
      return game.id === 'faskalearncaderpg';
    }
    // Wenn Arcade, zeige NUR Premium-Spiele
    return PREMIUM_GAMES.includes(game.id) && game.id !== 'faskalearncaderpg';
  });

  // Sortiere alphabetisch
  filteredGames.sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    const syncGameFromUrl = () => {
      setActiveGame(findGameFromUrl());
    };
    const frame = requestAnimationFrame(syncGameFromUrl);
    window.addEventListener('popstate', syncGameFromUrl);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('popstate', syncGameFromUrl);
    };
  }, []);

  const openGame = (game) => {
    writeGameToUrl(game);
    setActiveGame(game);
  };

  const closeGame = () => {
    writeGameToUrl(null);
    setActiveGame(null);
  };

  if (activeGame) {
    const GameComponent = activeGame.component;
    return (
      <div className="absolute inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
        <ErrorBoundary onExit={closeGame}>
          <Suspense fallback={<div className="text-white text-2xl font-bold animate-pulse">Lade Spiel...</div>}>
            <GameComponent onExit={closeGame} isLearncade={isLearncade} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <Motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col items-center relative overflow-y-auto custom-scrollbar"
    >
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob pointer-events-none"></div>
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-7xl">
        <div className="sticky top-0 z-20 flex justify-between items-center mb-8 bg-slate-900/80 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div>
            <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500">
              RETRO ARCADE
            </h2>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-3">
              <button 
                onClick={() => setAppMode('arcade')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-sm md:text-base font-bold transition-all ${appMode === 'arcade' ? 'bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                🚀 Pure Arcade
              </button>
              <button 
                onClick={() => setAppMode('learncade')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-sm md:text-base font-bold transition-all ${appMode === 'learncade' ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-105' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                🧠 Learncade
              </button>
              <button 
                onClick={() => setAppMode('argschade')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-sm md:text-base font-bold transition-all ${appMode === 'argschade' ? 'bg-zinc-700 text-white shadow-[0_0_15px_rgba(63,63,70,0.5)] scale-105' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                🗑️ Argschade
              </button>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-3 font-bold tracking-widest uppercase">
              Wähle dein Spiel ({filteredGames.length} verfügbar)
            </p>
          </div>
          <button 
            onClick={onExit}
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition-all hover:border-amber-300/60 hover:bg-amber-300 hover:text-slate-950 md:px-5 md:py-4"
          >
            FASKA Flow
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 pb-20">
          {filteredGames.map(game => (
            <Motion.button
              key={game.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openGame(game)}
              className={`relative overflow-hidden text-left ${game.color} rounded-3xl p-4 md:p-5 shadow-2xl transition-all border border-white/20 group hover:ring-4 ring-white/30`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-[80px] -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <span className="text-4xl drop-shadow-lg inline-block mb-3 group-hover:animate-bounce">{game.icon}</span>
                <h3 className="font-black text-lg md:text-xl leading-tight mb-1 tracking-tight drop-shadow-md">{game.title}</h3>
                <p className="font-bold text-[10px] text-white/80 uppercase tracking-widest bg-black/20 rounded px-2 py-0.5 inline-block">{game.desc}</p>
              </div>
            </Motion.button>
          ))}
        </div>
      </div>
    </Motion.div>
  );
}
