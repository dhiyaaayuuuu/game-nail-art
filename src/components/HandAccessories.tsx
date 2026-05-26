/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HandState, NailState } from '../types';
import { SKIN_TONES, RINGS, BACKGROUNDS } from '../data';
import { Sparkles, Palette, Crown, Sun } from 'lucide-react';

interface HandAccessoriesProps {
  handState: HandState;
  activeFinger: string;
  onUpdateHand: (updates: Partial<HandState>) => void;
  onUpdateNail: (finger: string, updates: Partial<NailState>) => void;
  onLoadPreset: (presetName: string) => void;
}

export default function HandAccessories({
  handState,
  activeFinger,
  onUpdateHand,
  onUpdateNail,
  onLoadPreset,
}: HandAccessoriesProps) {
  
  // Set ring on active finger
  const handleRingSelect = (ringId: string) => {
    const currentRings = { ...handState.rings };
    
    // Toggle ring off if clicked again
    if (currentRings[activeFinger] === ringId) {
      currentRings[activeFinger] = null;
    } else {
      currentRings[activeFinger] = ringId;
    }
    
    onUpdateHand({ rings: currentRings });
  };

  const handleSkinSelect = (id: string) => {
    onUpdateHand({ skinTone: id });
  };

  const handleBackgroundSelect = (id: string) => {
    onUpdateHand({ bgColor: id });
  };

  const handleToggleBracelet = () => {
    onUpdateHand({
      bracelet: handState.bracelet ? null : 'gold-bracelet'
    });
  };

  const presets = [
    { id: 'unicorn', name: '☁️ Unicorn Candy', desc: 'Soft pastel pink, lavender & stickers' },
    { id: 'glass-queen', name: '👑 Glass Queen', desc: 'Satin gloss, gold, crystal diamonds' },
    { id: 'goth-glam', name: '🎸 Goth Glam Dark', desc: 'Gloss black, silver, cherry decals' },
    { id: 'marmer-gold', name: '🌪️ Golden Marble', desc: 'Green jade base with gold lines' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5" id="com-hand-accessories">
      
      {/* 1. Preset Styles Loader */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-widest text-[#DB2777] flex items-center gap-1">
          <Sparkles size={11} className="text-pink-500 animate-pulse" />
          Inspirasi Desain Kuku (Presets)
        </label>
        <div className="grid grid-cols-2 gap-2" id="design-presets-grid">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onLoadPreset(preset.id)}
              id={`preset-btn-${preset.id}`}
              className="p-2.5 rounded-xl border border-rose-100 bg-gradient-to-tr from-rose-50/40 to-white hover:from-rose-50 hover:to-rose-100/20 text-left transition-all text-xs font-semibold text-slate-700 hover:text-slate-800 cursor-pointer"
            >
              <div className="font-extrabold text-[11px] text-slate-800 leading-tight">
                {preset.name}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5 line-clamp-1 leading-none font-medium">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Skin Tone Selector */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
          Warna Kulit Tangan
        </label>
        <div className="flex gap-2.5 bg-slate-50 p-2 rounded-2xl border border-slate-100" id="skin-tones-row">
          {SKIN_TONES.map((tone) => {
            const isSelected = handState.skinTone === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => handleSkinSelect(tone.id)}
                id={`skin-tone-${tone.id}`}
                className={`w-10 h-10 rounded-full cursor-pointer relative transition-transform ${
                  isSelected ? 'ring-2 ring-rose-500 scale-108 shadow-md' : 'hover:scale-104 shadow-xs'
                }`}
                style={{ backgroundColor: tone.color }}
                title={tone.name}
              >
                {/* Tone shadow look */}
                <div 
                  className="absolute bottom-0 inset-x-0 h-1/2 rounded-b-full opacity-30" 
                  style={{ backgroundColor: tone.accentColor }} 
                />
                
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center text-rose-600 bg-white/20 rounded-full text-[10px] font-bold">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Rings & Wrists Jewelry Selector (Placed on active finger) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
            Aksesoris Jari & Perhiasan
          </label>
          <span className="text-[9px] text-slate-400 truncate max-w-[150px]">
            Dipasang pada Jari Terpilih
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2" id="rings-grid">
          {RINGS.map((ring) => {
            const isSelected = handState.rings[activeFinger] === ring.id;
            return (
              <button
                key={ring.id}
                type="button"
                onClick={() => handleRingSelect(ring.id)}
                id={`ring-acc-${ring.id}`}
                className={`h-11 rounded-xl flex flex-col items-center justify-center text-xl transition-all border cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-50/50 scale-105' 
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/50'
                }`}
                title={ring.name}
              >
                {ring.emoji}
              </button>
            );
          })}
        </div>

        {/* Bracelet placement on/off button */}
        <button
          type="button"
          onClick={handleToggleBracelet}
          id="btn-toggle-bracelet"
          className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            handState.bracelet 
              ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-inner' 
              : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100/60'
          }`}
        >
          <Crown size={14} className={handState.bracelet ? 'text-amber-500' : 'text-slate-400'} />
          {handState.bracelet ? 'Lepas Gelang Gelang Keberuntungan' : 'Pasang Gelang Gelang Emas Mewah'}
        </button>
      </div>

      {/* 4. Background Studio Styles Picker */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
          Latar Ruang Studio / Wallpaper
        </label>
        <div className="grid grid-cols-2 gap-2" id="bg-selector-grid">
          {BACKGROUNDS.map((bg) => {
            const isSelected = handState.bgColor === bg.id;
            return (
              <button
                key={bg.id}
                type="button"
                onClick={() => handleBackgroundSelect(bg.id)}
                id={`bg-option-${bg.id}`}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected 
                    ? 'border-rose-500 bg-rose-50/30 font-bold' 
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/30'
                }`}
              >
                <div className={`w-5 h-5 rounded-md ${bg.class} border border-white shrink-0`} />
                <span className={`text-[11px] line-clamp-1 ${isSelected ? 'text-rose-700' : 'text-slate-700'}`}>
                  {bg.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
