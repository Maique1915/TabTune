
import React from 'react';
import { 
  Music, 
  Minus, 
  Activity, 
  Hash, 
  Waves, 
  GripHorizontal 
} from 'lucide-react';

export const INITIAL_THEME = {
  clefs: '#ffffff',
  timeSignature: '#ffffff',
  notes: '#00e5ff',
  rests: '#00e5ff',
  tabNumbers: '#00e5ff',
  symbols: '#ffffff',
  staffLines: '#3f3f46',
  background: '#09090b' // Sincronizado com o CSS do index.html
};

export const DURATIONS = [
  { label: 'Whole', value: 'w', icon: <div className="w-1 h-4 bg-white/20 rounded-full" /> },
  { label: 'Half', value: 'h', icon: <div className="w-2 h-4 border border-white/40 rounded-sm" /> },
  { label: 'Quarter', value: 'q', icon: <Music className="w-4 h-4" /> },
  { label: '8th', value: '8', icon: <Music className="w-4 h-4 rotate-12" /> },
  { label: '16th', value: '16', icon: <Music className="w-4 h-4 rotate-45" /> },
  { label: '32nd', value: '32', icon: <Music className="w-4 h-4 rotate-90" /> },
];

export const CLEFS = [
  { label: 'Treble', value: 'treble' },
  { label: 'Bass', value: 'bass' },
  { label: 'Tab', value: 'tab' },
];

export const TECHNIQUES = [
  { label: 'Hammer-on', value: 'h' },
  { label: 'Pull-off', value: 'p' },
  { label: 'Slide', value: 's' },
  { label: 'Bend', value: 'b' },
  { label: 'Vibrato', value: 'v' },
];
