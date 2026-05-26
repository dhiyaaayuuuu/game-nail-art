/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NailShape = 'round' | 'square' | 'almond' | 'stiletto';

export type PolishType = 'glossy' | 'matte' | 'glitter' | 'metallic';

export type NailPattern = 'solid' | 'french' | 'ombre' | 'polka' | 'stripes' | 'marble';

export interface SkinTone {
  id: string;
  name: string;
  color: string; // hex code for skin gradient
  accentColor: string; // for knuckles/shadows
}

export interface PolishColor {
  id: string;
  name: string;
  colorHex: string;
  secondColorHex?: string; // used for ombre/gradient styles
}

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
}

export interface Gem {
  id: string;
  name: string;
  color: string;
  element: string; // emoji or SVG design path
}

export interface Ring {
  id: string;
  name: string;
  emoji: string;
}

export interface NailState {
  shape: NailShape;
  color: string; // Color hex
  polishType: PolishType;
  pattern: NailPattern;
  patternColor: string; // Hex for pattern markings
  sticker: string | null; // Selected sticker ID
  stickerPos: { x: number; y: number; scale: number; rotate: number };
  gem: string | null; // Selected gem ID
  gemPos: 'top' | 'center' | 'bottom';
}

// Full hand structure
export interface HandState {
  skinTone: string; // Selected skin tone ID
  nails: Record<string, NailState>; // Map of finger ID (thumb, index, middle, ring, pinky) to NailState
  rings: Record<string, string | null>; // Map of finger ID to Ring ID (or null)
  bracelet: string | null; // Bracket item if placed
  bgColor: string; // Salon background style
}
