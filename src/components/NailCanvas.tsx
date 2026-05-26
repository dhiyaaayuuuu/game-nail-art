/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HandState, NailState, SkinTone } from '../types';
import { SKIN_TONES, RINGS, FINGER_NAMING } from '../data';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface NailCanvasProps {
  handState: HandState;
  activeFinger: string;
  setActiveFinger: (finger: string) => void;
  onUpdateNailState: (finger: string, updates: Partial<NailState>) => void;
}

export default function NailCanvas({
  handState,
  activeFinger,
  setActiveFinger,
  onUpdateNailState,
}: NailCanvasProps) {
  const currentSkin = SKIN_TONES.find(t => t.id === handState.skinTone) || SKIN_TONES[1];

  // Helper to get nail shapes SVG path
  const getNailPath = (shape: string, width: number, height: number) => {
    // Width and height of clipping/design box
    const w = width;
    const h = height;
    
    switch (shape) {
      case 'square':
        // Rounded at bottom, sharp flat top with slight curve
        return `M 2,${h} 
                L 2,12 
                Q 2,2 10,2 
                L ${w - 10},2 
                Q ${w - 2},2 ${w - 2},12 
                L ${w - 2},${h} 
                Z`;
      case 'almond':
        // Tapered oval pointing up gracefully
        return `M 2,${h} 
                Q 2,${h * 0.5} 8,12 
                Q ${w / 2},0 ${w - 8},12 
                Q ${w - 2},${h * 0.5} ${w - 2},${h} 
                Z`;
      case 'stiletto':
        // Sharpe point top
        return `M 2,${h} 
                Q 3,${h * 0.4} ${w / 2},0 
                Q ${w - 3},${h * 0.4} ${w - 2},${h} 
                Z`;
      case 'round':
      default:
        // Classic completely rounded top dome
        return `M 2,${h} 
                L 2,16 
                Q 2,2 ${w / 2},2 
                Q ${w - 2},2 ${w - 2},16 
                L ${w - 2},${h} 
                Z`;
    }
  };

  // Positions on SVG for fingers (knuckles and nail anchor points)
  const FINGER_SPECS: Record<
    string,
    {
      label: string;
      nailX: number;
      nailY: number;
      nailW: number;
      nailH: number;
      angle: number; // slight rotation for natural look
      fingerPath: string; // hand silhouette slice
      ringX: number;
      ringY: number;
    }
  > = {
    thumb: {
      label: 'Ibu Jari (Jempol)',
      nailX: 85,
      nailY: 275,
      nailW: 28,
      nailH: 34,
      angle: -26,
      fingerPath: 'M 140,360 Q 90,320 74,270 Q 64,240 85,225 Q 115,205 130,245 Q 145,285 165,340 Z',
      ringX: 110,
      ringY: 285,
    },
    index: {
      label: 'Jari Telunjuk',
      nailX: 168,
      nailY: 125,
      nailW: 24,
      nailH: 32,
      angle: -8,
      fingerPath: 'M 152,320 L 152,190 Q 152,90 180,90 Q 208,90 208,190 L 208,310 Z',
      ringX: 180,
      ringY: 220,
    },
    middle: {
      label: 'Jari Tengah',
      nailX: 242,
      nailY: 82,
      nailW: 25,
      nailH: 34,
      angle: 0,
      fingerPath: 'M 216,300 L 216,145 Q 216,50 252,50 Q 288,50 288,145 L 288,300 Z',
      ringX: 252,
      ringY: 190,
    },
    ring: {
      label: 'Jari Manis',
      nailX: 318,
      nailY: 112,
      nailW: 24,
      nailH: 32,
      angle: 6,
      fingerPath: 'M 295,300 L 295,175 Q 295,80 326,80 Q 357,80 357,175 L 357,300 Z',
      ringX: 326,
      ringY: 215,
    },
    pinky: {
      label: 'Jari Kelingking',
      nailX: 388,
      nailY: 176,
      nailW: 20,
      nailH: 26,
      angle: 14,
      fingerPath: 'M 363,330 L 363,225 Q 363,145 390,145 Q 417,145 417,225 L 413,340 Z',
      ringX: 390,
      ringY: 260,
    },
  };

  const getPolishFill = (nail: NailState) => {
    const { color, pattern, patternColor, polishType } = nail;
    
    // We construct beautiful inline backgrounds or SVG styles
    // In our SVG we use gradient defs for special configurations like Ombre/French
    return color;
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden" id="nail-canvas-com">
      {/* Decorative Canvas Sparkles and Labels */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-rose-50/80 backdrop-blur-xs text-rose-600 px-3 py-1 rounded-full text-xs font-semibold">
        <Sparkles size={12} className="animate-pulse" />
        <span>Studio Mewarnai</span>
      </div>

      <div className="absolute top-4 right-4 z-10 text-[11px] text-slate-400 font-medium">
        Klik Kuku Untuk Menghias
      </div>

      {/* Main Hand Representation Interactive Workspace */}
      <div className="w-full max-w-[400px] aspect-[4/5] relative bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-2 mb-4">
        
        {/* SVG Hand Canvas */}
        <svg
          viewBox="0 0 500 550"
          className="w-full h-full drop-shadow-xl select-none"
          id="hand-vector-canvas"
        >
          {/* Gradients and Filters Definitions */}
          <defs>
            {/* Skin Tone Gradient Shaders */}
            <linearGradient id={`skin-grad-${handState.skinTone}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={`${currentSkin.color}`} />
              <stop offset="70%" stopColor={`${currentSkin.color}`} />
              <stop offset="100%" stopColor={`${currentSkin.accentColor}`} />
            </linearGradient>

            {/* Knuckle shadows filters */}
            <filter id="shadow-blur" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#334155" floodOpacity="0.15" />
            </filter>

            {/* Metallic shine overlay */}
            <linearGradient id="metallic-shine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
            </linearGradient>

            {/* Glitter Sparkle Pattern/Texture */}
            <pattern id="glitter-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#FFFFFF" fillOpacity="0.8" />
              <circle cx="5" cy="4" r="0.7" fill="#FFF" fillOpacity="0.9" />
              <circle cx="1" cy="5" r="0.5" fill="#FFEB3B" fillOpacity="0.7" />
            </pattern>
            
            {/* For pattern stripes */}
            <pattern id="stripes-pat" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="20" stroke="#FFFFFF" strokeWidth="4" />
            </pattern>

            {/* Polka Dots pattern */}
            <pattern id="polka-pat" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2" fill="#FFFFFF" />
            </pattern>
          </defs>

          {/* Wrist Bracelet Accessory (Renders under the hand palm shadow) */}
          {handState.bracelet && (
            <g transform="translate(180, 480)" id="bracket-mesh" className="cursor-pointer">
              <rect x="0" y="0" width="140" height="18" rx="9" fill="#FFD700" filter="url(#shadow-blur)" />
              <circle cx="20" cy="9" r="6" fill="#FF1744" />
              <circle cx="50" cy="9" r="6" fill="#2979FF" />
              <circle cx="70" cy="9" r="7" fill="#E0F7FA" />
              <circle cx="90" cy="9" r="6" fill="#00E676" />
              <circle cx="120" cy="9" r="6" fill="#E040FB" />
              <text x="70" y="13" fontSize="11" textAnchor="middle" fill="#000" fontWeight="bold">💖</text>
            </g>
          )}

          {/* Core Hand Body SVG Shape Paths */}
          <g filter="url(#shadow-blur)">
            {/* Main Hand Palm silhouette */}
            <path
              d="M 110,480 
                 Q 120,380 152,320 
                 L 363,330 
                 Q 425,360 410,480 
                 Z"
              fill={`url(#skin-grad-${handState.skinTone})`}
            />

            {/* Renders each finger */}
            {Object.entries(FINGER_SPECS).map(([fid, spec]) => (
              <path
                key={`finger-base-${fid}`}
                d={spec.fingerPath}
                fill={`url(#skin-grad-${handState.skinTone})`}
                id={`finger-path-${fid}`}
              />
            ))}

            {/* Draw Knuckle Line wrinkles for realism */}
            {Object.entries(FINGER_SPECS).map(([fid, spec]) => {
              if (fid === 'thumb') return null;
              return (
                <g key={`knuckles-${fid}`} opacity="0.32" stroke="#4a3728" strokeWidth="1.5" fill="none">
                  {/* Upper Knuckle line */}
                  <path d={`M ${spec.ringX - 10},${spec.ringY + 12} Q ${spec.ringX},${spec.ringY + 15} ${spec.ringX + 10},${spec.ringY + 12}`} />
                  <path d={`M ${spec.ringX - 8},${spec.ringY + 14} Q ${spec.ringX},${spec.ringY + 17} ${spec.ringX + 8},${spec.ringY + 14}`} />
                  
                  {/* Lower Knuckle line */}
                  <path d={`M ${spec.ringX - 12},${spec.ringY + 52} Q ${spec.ringX},${spec.ringY + 56} ${spec.ringX + 12},${spec.ringY + 52}`} />
                  <path d={`M ${spec.ringX - 10},${spec.ringY + 54} Q ${spec.ringX},${spec.ringY + 58} ${spec.ringX + 10},${spec.ringY + 54}`} />
                </g>
              );
            })}
          </g>

          {/* Renders interactive rings on finger knuckles */}
          {Object.entries(handState.rings).map(([fid, ringId]) => {
            if (!ringId) return null;
            const ringItem = RINGS.find(r => r.id === ringId);
            const spec = FINGER_SPECS[fid];
            if (!ringItem || !spec) return null;

            return (
              <g 
                key={`placed-ring-${fid}`} 
                transform={`translate(${spec.ringX}, ${spec.ringY + 30}) rotate(${spec.angle})`}
                className="cursor-pointer"
                id={`ring-element-${fid}`}
              >
                {/* Ring base band */}
                <ellipse cx="0" cy="0" rx="14" ry="4" stroke="#FFD700" strokeWidth="3" fill="none" filter="url(#shadow-blur)" />
                {/* Ring emoji gem representation */}
                <text x="0" y="-3" fontSize="18" textAnchor="middle">{ringItem.emoji}</text>
              </g>
            );
          })}

          {/* Nails Layer with Custom Shapes, Shades, Ombre Gradient, Stickers and Diamonds */}
          {Object.entries(handState.nails).map(([fid, nail]) => {
            const spec = FINGER_SPECS[fid];
            const isSelected = activeFinger === fid;
            const nailPath = getNailPath(nail.shape, spec.nailW, spec.nailH);

            return (
              <g
                key={`nail-group-${fid}`}
                transform={`translate(${spec.nailX}, ${spec.nailY}) rotate(${spec.angle})`}
                className="cursor-pointer group"
                onClick={() => setActiveFinger(fid)}
                id={`nail-group-${fid}`}
              >
                {/* Active Finger Selection Ring Indicator inside SVG */}
                {isSelected && (
                  <ellipse
                    cx={spec.nailW / 2}
                    cy={spec.nailH / 2}
                    rx={spec.nailW * 0.9}
                    ry={spec.nailH * 0.9}
                    fill="none"
                    stroke="#FF4081"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ transformOrigin: `${spec.nailW / 2}px ${spec.nailH / 2}px`, animationDuration: '6s' }}
                  />
                )}

                {/* Sub-group for Nail rendering */}
                <g>
                  {/* SVG clip-path to ensure patterns and gradients match the chosen nail shape */}
                  <clipPath id={`clip-${fid}`}>
                    <path d={nailPath} />
                  </clipPath>

                  {/* 1. Base Base/Polish Undercoat */}
                  <path
                    d={nailPath}
                    fill={nail.color}
                    stroke="#4A2511"
                    strokeWidth="1.5"
                  />

                  {/* 2. Patterns overlay applied through clipping masks */}
                  <g clipPath={`url(#clip-${fid})`}>
                    
                    {/* French Manicure Overlay */}
                    {nail.pattern === 'french' && (
                      <path
                        d={`M -5,0 Q ${spec.nailW / 2},12 ${spec.nailW + 5},0 L ${spec.nailW + 5},-10 L -5,-10 Z`}
                        fill={nail.patternColor}
                      />
                    )}

                    {/* Ombre / Gradient overlay */}
                    {nail.pattern === 'ombre' && (
                      <rect
                        x="-5"
                        y="-5"
                        width={spec.nailW + 10}
                        height={spec.nailH + 10}
                        fill={`url(#ombre-grad-${fid})`}
                      />
                    )}

                    {/* Gradient def loaded specifically for this finger */}
                    <linearGradient id={`ombre-grad-${fid}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={nail.color} />
                      <stop offset="100%" stopColor={nail.patternColor} />
                    </linearGradient>

                    {/* Polka Dot Patterns */}
                    {nail.pattern === 'polka' && (
                      <rect
                        width={spec.nailW + 10}
                        height={spec.nailH + 10}
                        fill="url(#polka-pat)"
                        opacity="0.85"
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    )}

                    {/* Stripes Pattern */}
                    {nail.pattern === 'stripes' && (
                      <rect
                        width={spec.nailW + 10}
                        height={spec.nailH + 10}
                        fill="url(#stripes-pat)"
                        opacity="0.4"
                      />
                    )}

                    {/* Marble swirling pattern */}
                    {nail.pattern === 'marble' && (
                      <g opacity="0.35">
                        <path d={`M 0,0 Q 15,22 ${spec.nailW},${spec.nailH}`} stroke="#FFF" strokeWidth="2.5" fill="none" />
                        <path d={`M ${spec.nailW},0 C ${spec.nailW * 0.3},15 10,24 0,${spec.nailH}`} stroke="#FFF" strokeWidth="1.5" fill="none" />
                        <path d={`M 5,2 C 12,11 12,24 ${spec.nailW},20`} stroke="#000" strokeWidth="1" fill="none" />
                      </g>
                    )}

                    {/* 3. Polish Types overlays (Glossy, Matte, Glitter, Metallic) */}
                    {nail.polishType === 'glossy' && (
                      // Glossy white curved shine lines
                      <path
                        d={`M 3,4 Q ${spec.nailW * 0.35},12 3,${spec.nailH * 0.75}`}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.65"
                      />
                    )}

                    {/* Matte overlay texture effect */}
                    {nail.polishType === 'matte' && (
                      <rect
                        width={spec.nailW}
                        height={spec.nailH}
                        fill="#000000"
                        opacity="0.08"
                      />
                    )}

                    {/* Glitter overlays */}
                    {nail.polishType === 'glitter' && (
                      <rect
                        width={spec.nailW}
                        height={spec.nailH}
                        fill="url(#glitter-pattern)"
                      />
                    )}

                    {/* Metallic Chrome Shine Overlay */}
                    {nail.polishType === 'metallic' && (
                      <rect
                        width={spec.nailW}
                        height={spec.nailH}
                        fill="url(#metallic-shine)"
                        style={{ mixBlendMode: 'overlay' }}
                      />
                    )}

                    {/* Sticker Rendering in Clipped bounds or centered dynamically */}
                    {nail.sticker && (
                      <g
                        transform={`translate(${spec.nailW * (nail.stickerPos.x / 100)}, ${spec.nailH * (nail.stickerPos.y / 100)}) 
                                    scale(${nail.stickerPos.scale}) 
                                    rotate(${nail.stickerPos.rotate})`}
                      >
                        <text
                          x="0"
                          y="4"
                          fontSize="13"
                          textAnchor="middle"
                          style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }}
                        >
                          {nail.sticker}
                        </text>
                      </g>
                    )}
                  </g>

                  {/* Gemstone Jewelry rendering (usually physically on top of the nail, can stick out slightly) */}
                  {nail.gem && (
                    <g transform={`translate(${spec.nailW / 2}, ${
                      nail.gemPos === 'top' 
                        ? spec.nailH * 0.25 
                        : nail.gemPos === 'bottom' 
                        ? spec.nailH * 0.75 
                        : spec.nailH * 0.5
                    })`}>
                      <text
                        x="0"
                        y="4"
                        fontSize="14"
                        textAnchor="middle"
                        style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.4))' }}
                      >
                        {nail.gem}
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Selected Finger indicator footer bar */}
      <div className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Kuku Aktif Terpilih
          </span>
          <span className="text-sm font-bold text-slate-800" id="label-active-finger">
            {FINGER_NAMING[activeFinger] || activeFinger}
          </span>
        </div>

        <div className="flex gap-1">
          {Object.keys(FINGER_SPECS).map((fid) => (
            <button
              key={fid}
              onClick={() => setActiveFinger(fid)}
              id={`tab-finger-${fid}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeFinger === fid
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {fid === 'thumb' ? 'Thumb' : fid}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
