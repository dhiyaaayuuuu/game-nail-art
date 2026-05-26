/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import NailCanvas from './components/NailCanvas';
import PolishControls from './components/PolishControls';
import DecorationControls from './components/DecorationControls';
import HandAccessories from './components/HandAccessories';
import { HandState, NailState } from './types';
import { INITIAL_HAND_STATE, BACKGROUNDS, FINGER_NAMING, DEFAULT_NAIL_STATE } from './data';
import { 
  Sparkles, 
  Camera, 
  RotateCcw, 
  Heart, 
  Trash2, 
  Check, 
  Info,
  Gift,
  Award,
  Download,
  X
} from 'lucide-react';

export default function App() {
  // Central game state with client persistence
  const [handState, setHandState] = useState<HandState>(() => {
    const saved = localStorage.getItem('nail_art_studio_state_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Gagal memuat desain dari localStorage:', e);
      }
    }
    return INITIAL_HAND_STATE;
  });

  // State for currently selected finger (defaults to index finger)
  const [activeFinger, setActiveFinger] = useState<string>('index');

  // Photo session states
  const [showPolaroid, setShowPolaroid] = useState<boolean>(false);
  const [polaroidCaption, setPolaroidCaption] = useState<string>('Kuku Cantikku ✨');
  const [flashActive, setFlashActive] = useState<boolean>(false);

  // Client feedback notification bubble
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state changes to browser cache
  useEffect(() => {
    localStorage.setItem('nail_art_studio_state_v1', JSON.stringify(handState));
  }, [handState]);

  // Clean trigger helper for quick toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synthesize game sound effects using Web Audio API safely
  const playSoundEffect = (type: 'paint' | 'gem' | 'camera' | 'reset' | 'preset') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      switch (type) {
        case 'paint': {
          // Bubbling liquid pop sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
          break;
        }
        case 'gem': {
          // Glass sparkle bell sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
          break;
        }
        case 'camera': {
          // Shutter sound (noise white noise burst followed by clicks)
          const bufferSize = ctx.sampleRate * 0.12;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1000;
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start();
          break;
        }
        case 'preset': {
          // Sweeping magical sparkle
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'sawtooth';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(300, ctx.currentTime);
          osc1.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);
          osc2.frequency.setValueAtTime(600, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start();
          osc2.start();
          osc1.stop(ctx.currentTime + 0.35);
          osc2.stop(ctx.currentTime + 0.35);
          break;
        }
        case 'reset': {
          // Falling sweep sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(400, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
          break;
        }
      }
    } catch (err) {
      console.warn('AudioContext blocks:', err);
    }
  };

  // State modifier wrappers
  const handleUpdateNailState = (finger: string, updates: Partial<NailState>) => {
    const isComplex = Object.keys(updates).some(k => ['sticker', 'gem', 'pattern'].includes(k));
    playSoundEffect(isComplex ? 'gem' : 'paint');

    setHandState((prev) => ({
      ...prev,
      nails: {
        ...prev.nails,
        [finger]: {
          ...prev.nails[finger],
          ...updates,
        },
      },
    }));
  };

  const handleUpdateHandState = (updates: Partial<HandState>) => {
    playSoundEffect('paint');
    setHandState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleApplyAllNails = (updates: Partial<NailState>) => {
    playSoundEffect('preset');
    triggerToast('🎨 Berhasil menerpakan warna ini ke lima kuku jari tangan Anda!');
    setHandState((prev) => {
      const updatedNails = { ...prev.nails };
      Object.keys(updatedNails).forEach((finger) => {
        updatedNails[finger] = {
          ...updatedNails[finger],
          ...updates,
        };
      });
      return {
        ...prev,
        nails: updatedNails,
      };
    });
  };

  // Reset current workspace to fresh defaults
  const handleResetWorkspace = () => {
    if (confirm('Apakah Anda yakin ingin menghapus desain kuku saat ini dan mengulang kembali?')) {
      playSoundEffect('reset');
      setHandState(INITIAL_HAND_STATE);
      setActiveFinger('index');
      triggerToast('🧹 Studio dibersihkan kembali ke kuku polos alami!');
    }
  };

  // Quick preset loader templates
  const handleLoadPreset = (presetId: string) => {
    playSoundEffect('preset');
    
    let updatedNails = { ...handState.nails };
    let updatedRings = { ...handState.rings };
    let skinTone = 'fair';
    let bgColor = 'pastel-pink';
    let bracelet = null;

    if (presetId === 'unicorn') {
      skinTone = 'porcelain';
      bgColor = 'sparkly';
      bracelet = 'gold-bracelet';
      
      const colors = ['#FF80AB', '#E040FB', '#80D8FF', '#FF80AB', '#A7FFEB'];
      const stickers = ['💖', '✨', '🦄', '🎀', '😊'];
      
      Object.keys(updatedNails).forEach((key, index) => {
        updatedNails[key] = {
          ...DEFAULT_NAIL_STATE,
          shape: 'round',
          color: colors[index % colors.length],
          polishType: 'glitter',
          pattern: 'solid',
          sticker: stickers[index % stickers.length],
          stickerPos: { x: 50, y: 40, scale: 1.1, rotate: 10 },
        };
      });
      updatedRings = { thumb: null, index: 'heart_ring', middle: null, ring: 'flower_ring', pinky: null };
      triggerToast('🦄 Preset Permen Unicorn Berwarna-Warni Berhasil Dimuat!');
    
    } else if (presetId === 'glass-queen') {
      skinTone = 'porcelain';
      bgColor = 'cozy-salon';
      bracelet = null;

      Object.keys(updatedNails).forEach((key) => {
        updatedNails[key] = {
          ...DEFAULT_NAIL_STATE,
          shape: 'almond',
          color: '#ECEFF1',
          polishType: 'glossy',
          pattern: 'french',
          patternColor: '#D4AF37', // Gold linings
          gem: '💎',
          gemPos: 'bottom',
        };
      });
      updatedRings = { thumb: null, index: 'princess', middle: null, ring: 'gold', pinky: null };
      triggerToast('👑 Preset Ratu Kristal Mewah Berhasil Dimuat!');

    } else if (presetId === 'goth-glam') {
      skinTone = 'honey';
      bgColor = 'neon-dark';
      bracelet = null;

      Object.keys(updatedNails).forEach((key, index) => {
        updatedNails[key] = {
          ...DEFAULT_NAIL_STATE,
          shape: 'stiletto',
          color: index % 2 === 0 ? '#212121' : '#880E4F',
          polishType: 'matte',
          pattern: 'solid',
          sticker: index === 2 ? '🍒' : index === 3 ? '🦋' : null,
          stickerPos: { x: 50, y: 40, scale: 1.2, rotate: -5 },
        };
      });
      updatedRings = { thumb: null, index: 'minimalist', middle: null, ring: 'butterfly_ring', pinky: null };
      triggerToast('🎸 Preset Goth Glam Rocker Gelang Berhasil Dimuat!');

    } else if (presetId === 'marmer-gold') {
      skinTone = 'warm';
      bgColor = 'cozy-salon';
      bracelet = 'gold-bracelet';

      Object.keys(updatedNails).forEach((key) => {
        updatedNails[key] = {
          ...DEFAULT_NAIL_STATE,
          shape: 'square',
          color: '#1DE9B6', // Turquoise base
          polishType: 'metallic',
          pattern: 'marble',
          patternColor: '#FFFFFF',
          gem: '⚪',
          gemPos: 'center',
        };
      });
      updatedRings = { thumb: null, index: null, middle: 'minimalist', ring: null, pinky: null };
      triggerToast('🌪️ Preset Marmer Hijau Berurat Emas Berhasil Dimuat!');
    }

    setHandState({
      skinTone,
      nails: updatedNails,
      rings: updatedRings,
      bracelet,
      bgColor,
    });
  };

  // Triggers mock camera snapshot
  const handleTakeSnapshot = () => {
    playSoundEffect('camera');
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);
    setShowPolaroid(true);
    triggerToast('📸 Jepret! Foto kuku tangan cantik Anda selesai diproses!');
  };

  // Mock download of files
  const handleDownloadPolaroid = () => {
    triggerToast('📥 Polaroid diunduh langsung ke galeri gawai Anda!');
    setShowPolaroid(false);
  };

  const activeNail = handState.nails[activeFinger] || handState.nails.index;
  const currentBgClass = BACKGROUNDS.find(b => b.id === handState.bgColor)?.class || BACKGROUNDS[0].class;

  return (
    <div className="min-h-screen bg-rose-50/40 text-slate-800 font-sans antialiased pb-12 transition-all relative overflow-hidden" id="nail-art-app-root">
      
      {/* Dynamic Flash Overlay effect on click camera button */}
      {flashActive && (
        <div className="fixed inset-0 bg-white z-[9999] opacity-100 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Aesthetic Toast Notification Bubble Row */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9000] max-w-sm bg-slate-900/95 backdrop-blur-md text-white py-3.5 px-5 rounded-2xl shadow-xl border border-slate-800 text-xs font-bold tracking-wide animate-bounce flex items-center gap-2" id="pop-toast">
          <Sparkles size={14} className="text-pink-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section in neat Bento style floating header layout */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500 text-white p-3 rounded-2xl shadow-md shadow-rose-200">
            <span className="text-2xl font-bold">💅</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              CuteNail Art Studio. <span className="text-xs bg-rose-100/90 text-rose-600 px-2 py-0.5 rounded-full font-bold">V1.5</span>
            </h1>
            <p className="text-slate-500 text-xs font-semibold">Salon & spa kecantikan kuku virtual estetik seru Indonesia</p>
          </div>
        </div>

        {/* Action Header controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={handleResetWorkspace}
            className="text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 hover:text-rose-500 border border-slate-200 px-3.5 py-2.5 rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            id="btn-nav-reset"
            title="Bersihkan Desain Baru"
          >
            <RotateCcw size={12} />
            <span>Kuku Alami</span>
          </button>

          <button
            onClick={handleTakeSnapshot}
            className="text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 active:scale-95 px-4 py-2.5 rounded-2xl shadow-md shadow-rose-100 hover:shadow-rose-200 transition-all flex items-center gap-1.5 cursor-pointer"
            id="btn-nav-take-photo"
          >
            <Camera size={13} />
            <span>Foto Hasil Studio</span>
          </button>
        </div>
      </header>

      {/* Main Container Studio App Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* LEFT COLUMN: 5/12 grid contains the Visual interactive hand state & salon layout */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Main Hand Studio container wraps with the selected wallpaper gradient */}
          <div className={`w-full rounded-[40px] p-5 border-4 border-white shadow-lg transition-all duration-300 relative ${currentBgClass}`} id="studio-hand-backdrop">
            
            {/* Ambient Lighting elements on Wallpaper */}
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 blur-md" />
            
            {/* Interactive Nail Canvas component */}
            <NailCanvas
              handState={handState}
              activeFinger={activeFinger}
              setActiveFinger={setActiveFinger}
              onUpdateNailState={handleUpdateNailState}
            />
            
            {/* Quick tips label footer */}
            <div className="mt-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500/80 tracking-wider bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-white/50 inline-block">
                Studio: <span className="text-rose-600">{FINGER_NAMING[activeFinger]}</span> Sedang Dihias
              </span>
            </div>
          </div>

          {/* Quick instructions panel inside side widget */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 flex items-start gap-3 shadow-xs">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl shrink-0 mt-0.5">
              <Info size={16} />
            </div>
            <div className="text-xs leading-relaxed text-slate-500">
              <h4 className="font-extrabold text-slate-800 mb-0.5">Cara Bermain Nail Art:</h4>
              <p>1. Klik kuku jari manapun pada gambar atau tombol untuk memilih kuku.</p>
              <p>2. Warnai dengan kuteks, atur kemilau di panel kanan.</p>
              <p>3. Tempel stiker lucu, geser menggunakan tuas slider di bawah stiker.</p>
              <p>4. Kenakan perhiasan cincin mewah & gelang, lalu klik <strong>Foto Hasil</strong>!</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 7/12 grid contains the design options bento grid panels */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Nail Polish customization (Colors & Gloss/Matte/Glitter Finish) */}
          <PolishControls
            nailState={activeNail}
            onUpdateNail={(updates) => handleUpdateNailState(activeFinger, updates)}
            onApplyAll={handleApplyAllNails}
          />

          {/* Double Column Sub Bento Row for accessories and custom decals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hand Accessories component (Skin tone, wallpapers, ring jewel placements) */}
            <HandAccessories
              handState={handState}
              activeFinger={activeFinger}
              onUpdateHand={handleUpdateHandState}
              onUpdateNail={handleUpdateNailState}
              onLoadPreset={handleLoadPreset}
            />

            {/* Custom overlays, Stickers coordinates sliders, jewel configurations */}
            <DecorationControls
              nailState={activeNail}
              onUpdateNail={(updates) => handleUpdateNailState(activeFinger, updates)}
              activeFinger={activeFinger}
            />
          </div>
        </div>
      </main>

      {/* Polaroid Snapshot Camera Capture Modal/Dialog */}
      {showPolaroid && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in" id="modal-snapshot">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative text-center">
            
            <button
              onClick={() => setShowPolaroid(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full cursor-pointer transition-all"
              id="btn-close-polaroid"
            >
              <X size={15} />
            </button>

            {/* Title */}
            <span className="text-2xl" role="img" aria-label="Camera Sparks">✨📸✨</span>
            <h3 className="font-black text-slate-800 text-base mt-2">Polaroid Hasil Karyamu</h3>
            <p className="text-slate-400 text-xs mb-4">Cantik dan sangat kreatif sekali desainnya!</p>

            {/* Visual Polaroid Card */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 shadow-inner flex flex-col items-center">
              
              {/* Renders miniaturized representation of the hand in Polaroid */}
              <div className={`w-[240px] aspect-[1/1.1] rounded-xl relative overflow-hidden flex items-center justify-center shadow-xs border border-white/40 ${currentBgClass}`}>
                <div className="scale-65 absolute inset-0 -top-6">
                  <NailCanvas
                    handState={handState}
                    activeFinger={activeFinger}
                    setActiveFinger={() => {}}
                    onUpdateNailState={() => {}}
                  />
                </div>
                {/* Decoration */}
                <span className="absolute bottom-2 right-2 text-xs">💅⭐</span>
              </div>

              {/* Caption Input */}
              <div className="w-full mt-4 px-2 pb-2">
                <input
                  type="text"
                  maxLength={24}
                  value={polaroidCaption}
                  onChange={(e) => setPolaroidCaption(e.target.value)}
                  className="w-full text-center bg-transparent border-b border-dashed border-rose-300 focus:border-rose-500 font-mono text-xs font-bold text-slate-800 outline-none pb-1"
                  placeholder="Ketik keterangan polaroid..."
                  id="polaroid-caption-input"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">Silakan ketik nama/Keterangan foto Anda</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-3" id="polaroid-actions">
              <button
                onClick={() => setShowPolaroid(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer transition-all"
              >
                Kembali Hias
              </button>
              
              <button
                onClick={handleDownloadPolaroid}
                id="btn-download-polaroid"
                className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold cursor-pointer hover:shadow-lg hover:shadow-rose-100 transition-all flex items-center justify-center gap-1"
              >
                <Download size={13} /> Simpan Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aesthetic Indonesian Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200/60 text-center text-xs text-slate-400 font-semibold space-y-1">
        <p>🎀 Game Nail Art virtual yang dirancang khusus untuk hobi mewarnai & dekorasi kuku estetik 🎀</p>
        <p className="text-[10px] text-slate-300">Dibuat menggunakan React, Tailwind CSS, & Lucide Icons</p>
      </footer>
    </div>
  );
}
