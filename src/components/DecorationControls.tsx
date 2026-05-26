/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NailState, NailShape, NailPattern } from '../types';
import { STICKERS, GEMS, PATTERN_COLORS, FINGER_NAMING } from '../data';
import { Move, Layers, Settings, X, ChevronRight, Sparkles } from 'lucide-react';

interface DecorationControlsProps {
  nailState: NailState;
  onUpdateNail: (updates: Partial<NailState>) => void;
  activeFinger: string;
}

export default function DecorationControls({
  nailState,
  onUpdateNail,
  activeFinger,
}: DecorationControlsProps) {
  const shapes: { id: NailShape; name: string; icon: string }[] = [
    { id: 'round', name: 'Bulat (Oval)', icon: '🟢' },
    { id: 'square', name: 'Kotak (Square)', icon: '⬜' },
    { id: 'almond', name: 'Almond', icon: '🌰' },
    { id: 'stiletto', name: 'Stiletto', icon: '📐' },
  ];

  const patterns: { id: NailPattern; name: string; desc: string; icon: string }[] = [
    { id: 'solid', name: 'Polos Saja', desc: 'Satu warna penuh merata', icon: '🎨' },
    { id: 'french', name: 'French Tip', desc: 'Garis ujung kuku estetik putih', icon: '💅' },
    { id: 'ombre', name: 'Gradasi Ombre', desc: 'Campuran warna yang memudar halus', icon: '🌈' },
    { id: 'polka', name: 'Bintik Polkadot', desc: 'Bintik-bintik lucu klasik', icon: '⚪' },
    { id: 'stripes', name: 'Garis Geometris', desc: 'Pola garis modern bergaris', icon: '☰' },
    { id: 'marble', name: 'Marmer (Marble)', desc: 'Goresan abstrak batu marmer mewah', icon: '🌪️' },
  ];

  const handleShapeSelect = (shape: NailShape) => {
    onUpdateNail({ shape });
  };

  const handlePatternSelect = (pattern: NailPattern) => {
    onUpdateNail({ pattern });
  };

  const handlePatternColorSelect = (colorHex: string) => {
    onUpdateNail({ patternColor: colorHex });
  };

  const handleStickerSelect = (stickerEmoji: string) => {
    // If client clicks same sticker, toggles/removes it
    if (nailState.sticker === stickerEmoji) {
      onUpdateNail({ sticker: null });
    } else {
      onUpdateNail({ 
        sticker: stickerEmoji,
        // Reset positioning default nicely so it's centered
        stickerPos: { x: 50, y: 40, scale: 1, rotate: 0 }
      });
    }
  };

  const handleGemSelect = (gemEmoji: string) => {
    // Toggles gem placement on/off
    if (nailState.gem === gemEmoji) {
      onUpdateNail({ gem: null });
    } else {
      onUpdateNail({ gem: gemEmoji });
    }
  };

  const handleCoordinateChange = (prop: 'x' | 'y' | 'scale' | 'rotate', val: number) => {
    onUpdateNail({
      stickerPos: {
        ...nailState.stickerPos,
        [prop]: val
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6" id="com-decoration-ctrls">
      
      {/* 1. Nail Shape Selector (Applied to current active finger) */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
          Bentuk Pemotongan Kuku Jari
        </label>
        <div className="grid grid-cols-4 gap-2" id="nail-shape-picker">
          {shapes.map((item) => {
            const isSelected = nailState.shape === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleShapeSelect(item.id)}
                id={`btn-shape-${item.id}`}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50 shadow-inner'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-rose-700' : 'text-slate-600'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Patterns Overlay (Gaya Hiasan) */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
          Pola & Motif Gaya Kuku
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2" id="nail-patterns-picker">
          {patterns.map((pat) => {
            const isSelected = nailState.pattern === pat.id;
            return (
              <button
                key={pat.id}
                type="button"
                onClick={() => handlePatternSelect(pat.id)}
                id={`btn-pattern-${pat.id}`}
                className={`flex items-start gap-2 p-2.5 rounded-xl border text-left transition-all h-full cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/30'
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5" role="img" aria-label={pat.name}>{pat.icon}</span>
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold leading-tight ${isSelected ? 'text-rose-700' : 'text-slate-700'}`}>
                    {pat.name}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-tight line-clamp-1">
                    {pat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Pattern Color Selector (Renders if pattern NOT solid) */}
        {nailState.pattern !== 'solid' && (
          <div className="bg-rose-50/30 border border-rose-100/50 p-3 rounded-2xl animate-fade-in mt-2 space-y-2">
            <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider block">
              Pilih Warna Kombinasi / Garis Pola:
            </span>
            <div className="flex flex-wrap gap-2">
              {PATTERN_COLORS.map((col) => {
                const isColSelected = nailState.patternColor.toLowerCase() === col.toLowerCase();
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => handlePatternColorSelect(col)}
                    className={`w-6 h-6 rounded-full border border-slate-200 cursor-pointer shadow-xs transition-transform ${
                      isColSelected ? 'ring-2 ring-rose-500 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: col }}
                    title={col}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Stickers / Decals Tab */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
            Stiker Logo & Decal Lucu
          </label>
          <span className="text-[9px] text-[#A855F7] font-semibold">Togel untuk Pasang/Lepas</span>
        </div>
        
        <div className="grid grid-cols-8 gap-1.5 bg-slate-50 p-2.5 rounded-2xl max-h-[148px] overflow-y-auto border border-slate-100" id="stickers-board-grid">
          {STICKERS.map((stick) => {
            const isSelected = nailState.sticker === stick.emoji;
            return (
              <button
                key={stick.id}
                type="button"
                onClick={() => handleStickerSelect(stick.emoji)}
                id={`sticker-${stick.id}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg select-none transition-all cursor-pointer ${
                  isSelected ? 'bg-indigo-100 border border-indigo-300 scale-110' : 'hover:bg-slate-200/50'
                }`}
                title={stick.name}
              >
                {stick.emoji}
              </button>
            );
          })}
        </div>

        {/* Sticker Transformation adjustments (Sliders) - Show only if sticker exists */}
        {nailState.sticker && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Move size={11} className="text-slate-500" />
                Atur Posisi Stiker {nailState.sticker}
              </span>
              <button
                onClick={() => onUpdateNail({ sticker: null })}
                className="text-rose-500 hover:text-rose-700 flex items-center gap-0.5 font-bold cursor-pointer"
              >
                <X size={10} /> Bersihkan
              </button>
            </div>

            <div className="space-y-2" id="sticker-position-sliders">
              {/* Slider X position */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 w-16 text-left">Geser Kiri Kanan:</span>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={nailState.stickerPos.x}
                  onChange={(e) => handleCoordinateChange('x', parseInt(e.target.value))}
                  className="grow accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg outline-none"
                />
                <span className="font-mono text-[10px] text-slate-400 w-6 text-right">
                  {nailState.stickerPos.x}%
                </span>
              </div>

              {/* Slider Y position */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 w-16 text-left">Geser Atas Bawah:</span>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={nailState.stickerPos.y}
                  onChange={(e) => handleCoordinateChange('y', parseInt(e.target.value))}
                  className="grow accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg outline-none"
                />
                <span className="font-mono text-[10px] text-slate-400 w-6 text-right">
                  {nailState.stickerPos.y}%
                </span>
              </div>

              {/* Slider Scale size */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 w-16 text-left">Ukuran Stiker:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={nailState.stickerPos.scale}
                  onChange={(e) => handleCoordinateChange('scale', parseFloat(e.target.value))}
                  className="grow accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg outline-none"
                />
                <span className="font-mono text-[10px] text-slate-400 w-6 text-right">
                  {nailState.stickerPos.scale}x
                </span>
              </div>

              {/* Slider Rotate */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 w-16 text-left">Rotasi Mutar:</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={nailState.stickerPos.rotate}
                  onChange={(e) => handleCoordinateChange('rotate', parseInt(e.target.value))}
                  className="grow accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg outline-none"
                />
                <span className="font-mono text-[10px] text-slate-400 w-10 text-right">
                  {nailState.stickerPos.rotate}°
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Gemstone Jewelry Tab */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
            Permata & Taburan Berlian 3D
          </label>
          <span className="text-[9px] text-slate-400">Pemasangan Mewah</span>
        </div>

        <div className="grid grid-cols-8 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100" id="gems-board-grid">
          {GEMS.map((g) => {
            const isSelected = nailState.gem === g.element;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGemSelect(g.element)}
                id={`gem-${g.id}`}
                className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center text-lg select-none transition-all cursor-pointer ${
                  isSelected ? 'bg-rose-100 border border-rose-300 scale-110' : 'hover:bg-slate-200/50'
                }`}
                title={g.name}
              >
                {g.element}
              </button>
            );
          })}
        </div>

        {/* Gem Position switches */}
        {nailState.gem && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between text-xs transition-fade">
            <span className="font-bold text-slate-500">Tata Letak Permata:</span>
            <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {(['top', 'center', 'bottom'] as const).map((pos) => {
                const isActive = nailState.gemPos === pos;
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => onUpdateNail({ gemPos: pos })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                      isActive ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pos === 'top' ? 'Ujung' : pos === 'bottom' ? 'Bawah' : 'Tengah'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
