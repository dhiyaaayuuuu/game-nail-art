/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SkinTone, PolishColor, Sticker, Gem, Ring, NailState, HandState } from './types';

export const SKIN_TONES: SkinTone[] = [
  { id: 'porcelain', name: 'Putih Porselen', color: '#FCDDEC', accentColor: '#F5B8DC' },
  { id: 'fair', name: 'Kuning Langsat', color: '#FFE0B2', accentColor: '#F5CD8A' },
  { id: 'warm', name: 'Sawo Matang', color: '#D7CCC8', accentColor: '#BCAAA4' },
  { id: 'honey', name: 'Cokelat Manis', color: '#A1887F', accentColor: '#8D6E63' },
  { id: 'deep', name: 'Eksotis Gelap', color: '#5D4037', accentColor: '#4E342E' },
];

export const POLISH_COLORS: PolishColor[] = [
  { id: 'pink', name: 'Soft Pink', colorHex: '#FF80AB' },
  { id: 'hotpink', name: 'Fuchsia', colorHex: '#FF1744' },
  { id: 'peach', name: 'Peach', colorHex: '#FFAB91' },
  { id: 'lavender', name: 'Lavender', colorHex: '#E040FB' },
  { id: 'royalpurple', name: 'Royal Purple', colorHex: '#651FFF' },
  { id: 'babyblue', name: 'Baby Blue', colorHex: '#80D8FF' },
  { id: 'teal', name: 'Turquoise / Teal', colorHex: '#1DE9B6' },
  { id: 'mint', name: 'Mint Green', colorHex: '#A7FFEB' },
  { id: 'lemon', name: 'Lemon Yellow', colorHex: '#FFE082' },
  { id: 'coral', name: 'Coral Red', colorHex: '#FF5252' },
  { id: 'rosegold', name: 'Rose Gold', colorHex: '#D4AF37' },
  { id: 'silver', name: 'Metallic Silver', colorHex: '#CFD8DC' },
  { id: 'white', name: 'Milky White', colorHex: '#ECEFF1' },
  { id: 'black', name: 'Midnight Black', colorHex: '#212121' },
  { id: 'burgundy', name: 'Burgundy🍷', colorHex: '#880E4F' },
  { id: 'nude', name: 'Nude Almond', colorHex: '#D7CCC8' },
];

export const PATTERN_COLORS = [
  '#FFFFFF', // White
  '#FF4081', // Pink Accent
  '#FFEB3B', // Yellow Accent
  '#18FFFF', // Cyan Accent
  '#212121', // Dark Gray
  '#651FFF', // Purple Accent
  '#FFD700', // Gold
  '#81C784', // Mint Green Accent
];

export const STICKERS: Sticker[] = [
  { id: 'love', name: 'Pita Cinta 💖', emoji: '💖' },
  { id: 'heart', name: 'Hati Pink 💕', emoji: '💕' },
  { id: 'sparkle', name: 'Kilau Bintang ✨', emoji: '✨' },
  { id: 'star', name: 'Bintang Emas ⭐', emoji: '⭐' },
  { id: 'cherry', name: 'Buah Ceri 🍒', emoji: '🍒' },
  { id: 'ribbon', name: 'Pita Cantik 🎀', emoji: '🎀' },
  { id: 'butterfly', name: 'Kupu-Kupu 🦋', emoji: '🦋' },
  { id: 'flower', name: 'Bunga Sakura 🌸', emoji: '🌸' },
  { id: 'tulip', name: 'Bunga Tulip 🌷', emoji: '🌷' },
  { id: 'crown', name: 'Puteri Mahkota 👑', emoji: '👑' },
  { id: 'unicorn', name: 'Kuda Poni 🦄', emoji: '🦄' },
  { id: 'bear', name: 'Teddy Bear 🧸', emoji: '🧸' },
  { id: 'kitten', name: 'Kucing Imut 🐱', emoji: '🐱' },
  { id: 'clover', name: 'Daun Hoki 🍀', emoji: '🍀' },
  { id: 'smiley', name: 'Senyuman 😊', emoji: '😊' },
  { id: 'daisy', name: 'Bunga Daisy 🌼', emoji: '🌼' },
];

export const GEMS: Gem[] = [
  { id: 'diamond', name: 'Berlian Jernih', color: '#E0F7FA', element: '💎' },
  { id: 'ruby', name: 'Ruby Merah', color: '#FF1744', element: '❤️' },
  { id: 'emerald', name: 'Zamrud Hijau', color: '#00E676', element: '💚' },
  { id: 'sapphire', name: 'Safir Biru', color: '#2979FF', element: '💙' },
  { id: 'pearl', name: 'Mutiara Putih', color: '#FFF9C4', element: '⚪' },
  { id: 'goldstar', name: 'Bros Emas', color: '#FFD700', element: '⚜️' },
  { id: 'royal', name: 'Permata Pink', color: '#FF3D00', element: '✨' },
  { id: 'crown_mini', name: 'Mahkota Kuku', color: '#FFC400', element: '👑' },
];

export const RINGS: Ring[] = [
  { id: 'gold', name: 'Cincin Emas Mewah', emoji: '💍' },
  { id: 'princess', name: 'Tiara Silver', emoji: '👑' },
  { id: 'flower_ring', name: 'Cincin Bunga Daisy', emoji: '🌸' },
  { id: 'heart_ring', name: 'Cincin Cinta Pink', emoji: '💝' },
  { id: 'minimalist', name: 'Band Ring Gold', emoji: '⭕' },
  { id: 'butterfly_ring', name: 'Cincin Kupu-Kupu', emoji: '🦋' },
];

export const BACKGROUNDS = [
  { id: 'pastel-pink', name: 'Kamar Pastel Merah Muda', class: 'bg-gradient-to-tr from-rose-100 to-indigo-100' },
  { id: 'cozy-salon', name: 'Salon Estetik Cream', class: 'bg-gradient-to-tr from-[#FFF3e0] to-[#E8e0d5]' },
  { id: 'sparkly', name: 'Kamarmandi Mewah Ungu', class: 'bg-gradient-to-tr from-[#F3E5F5] to-[#E1BEE7]' },
  { id: 'neon-dark', name: 'Salon Cyberpunk Malam', class: 'bg-gradient-to-br from-slate-900 to-purple-950' },
];

export const DEFAULT_NAIL_STATE: NailState = {
  shape: 'round',
  color: '#FF80AB', // Soft pink
  polishType: 'glossy',
  pattern: 'solid',
  patternColor: '#FFFFFF',
  sticker: null,
  stickerPos: { x: 50, y: 40, scale: 1, rotate: 0 },
  gem: null,
  gemPos: 'center',
};

export const INITIAL_HAND_STATE: HandState = {
  skinTone: 'fair',
  nails: {
    thumb: { ...DEFAULT_NAIL_STATE, color: '#FF80AB' },
    index: { ...DEFAULT_NAIL_STATE, color: '#FF80AB' },
    middle: { ...DEFAULT_NAIL_STATE, color: '#FF80AB' },
    ring: { ...DEFAULT_NAIL_STATE, color: '#FF80AB' },
    pinky: { ...DEFAULT_NAIL_STATE, color: '#FF80AB' },
  },
  rings: {
    thumb: null,
    index: null,
    middle: null,
    ring: null,
    pinky: null,
  },
  bracelet: null,
  bgColor: 'pastel-pink',
};

export const FINGER_NAMING: Record<string, string> = {
  thumb: 'Ibu Jari (Jempol)',
  index: 'Jari Telunjuk',
  middle: 'Jari Tengah',
  ring: 'Jari Manis',
  pinky: 'Jari Kelingking',
};
