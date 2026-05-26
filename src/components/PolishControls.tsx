/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NailState, PolishColor, PolishType } from '../types';
import { POLISH_COLORS } from '../data';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';

interface PolishControlsProps {
  nailState: NailState;
  onUpdateNail: (updates: Partial<NailState>) => void;
  onApplyAll: (updates: Partial<NailState>) => void;
}

export default function PolishControls({
  nailState,
  onUpdateNail,
  onApplyAll,
}: PolishControlsProps) {
  const polishTypes: { id: PolishType; name: string; desc: string; icon: string }[] = [
    { id: 'glossy', name: 'Glossy / Mengkilap', desc: 'Pantulan glossy klasik berkilau', icon: '✨' },
    { id: 'matte', name: 'Matte / Suede', desc: 'Tekstur dof modern premium', icon: '☁️' },
    { id: 'glitter', name: 'Glitter / Bubuk', desc: 'Serpihan glitter berkilau mewah', icon: '⭐' },
    { id: 'metallic', name: 'Metallic Chrome', desc: 'Shading chrome cermin futuristik', icon: '💿' },
  ];

  const handleColorSelect = (hex: string) => {
    onUpdateNail({ color: hex });
  };

  const handleTypeSelect = (type: PolishType) => {
    onUpdateNail({ polishType: type });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5" id="com-polish-ctrls">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          Warna & Jenis Kuteks
        </h3>
        <button
          onClick={() => onApplyAll({ color: nailState.color, polishType: nailState.polishType })}
          className="text-[11px] font-bold text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-200 hover:border-transparent px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
          id="btn-apply-all-polish"
          title="Terapkan warna kuku ini ke semua kuku jari tangan"
        >
          Terapkan ke Semua Jari 💅
        </button>
      </div>

      {/* Polish Types/Textures Selection Panel */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
          Tekstur Hasil Akhir (Finish)
        </label>
        <div className="grid grid-cols-2 gap-2" id="grid-finish-types">
          {polishTypes.map((type) => {
            const isSelected = nailState.polishType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeSelect(type.id)}
                id={`btn-finish-${type.id}`}
                className={`flex items-start gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50 shadow-inner'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/30'
                }`}
              >
                <span className="text-xl" role="img" aria-label={type.name}>{type.icon}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-rose-700' : 'text-slate-700'}`}>
                    {type.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {type.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Elegant Color Bottle Picker Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block2">
            Pilihan Warna Kuteks Jari
          </label>
          <span className="text-[10px] text-slate-400">
            Selected: <span className="font-mono font-bold text-slate-700">{nailState.color}</span>
          </span>
        </div>

        {/* Liquid Bottle Design Palette */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3" id="polish-colors-palette">
          {POLISH_COLORS.map((color) => {
            const isSelected = nailState.color.toLowerCase() === color.colorHex.toLowerCase();
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => handleColorSelect(color.colorHex)}
                id={`color-picker-${color.id}`}
                className="flex flex-col items-center justify-center relative cursor-pointer group"
                title={color.name}
              >
                {/* 3D Nail Polish Bottle representation */}
                <div className="w-10 h-14 relative flex flex-col items-center">
                  {/* Cap of bottle */}
                  <div className={`w-3.5 h-5 rounded-t-md transition-all duration-200 ${
                    isSelected ? 'bg-rose-500' : 'bg-slate-700 group-hover:bg-slate-800'
                  }`} />
                  
                  {/* Metallic Collar */}
                  <div className="w-4 h-1 bg-slate-300 border-x border-slate-400" />

                  {/* Glass Bottle fill with real liquid paint */}
                  <div 
                    className={`w-9 h-8 rounded-b-xl border relative transition-all duration-150 flex items-center justify-center shadow-xs overflow-hidden ${
                      isSelected 
                        ? 'border-rose-500 ring-2 ring-rose-300 scale-105' 
                        : 'border-slate-200 group-hover:scale-103'
                    }`}
                    style={{ backgroundColor: color.colorHex }}
                  >
                    {/* Gloss shine inside glass bottle */}
                    <div className="absolute top-0.5 left-0.5 w-1.5 h-6 bg-white opacity-40 rounded-full" />
                    
                    {/* Glitter Sparkle dots inside if current selection matches sparkles */}
                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-30 pointer-events-none" />

                    {/* Selected Checkmark Indicator */}
                    {isSelected && (
                      <div className="bg-white/95 rounded-full p-0.5 shadow-sm text-slate-800">
                        <Check size={9} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[9px] text-slate-400 mt-1 text-center font-medium line-clamp-1 max-w-[50px]">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Advanced hexadecimal color box */}
      <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between text-xs">
        <span className="font-bold text-slate-600">Warna Kustom Sendiri (Hex):</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={nailState.color}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="w-8 h-8 rounded-xl border-2 border-white shadow-xs cursor-pointer overflow-hidden p-0"
            id="color-manual-picker"
          />
          <input
            type="text"
            value={nailState.color}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="w-20 px-2 py-1 bg-white border border-slate-200 focus:border-rose-500 rounded-lg text-[11px] font-mono text-slate-700 outline-none text-center"
            id="color-text-picker"
          />
        </div>
      </div>
    </div>
  );
}
