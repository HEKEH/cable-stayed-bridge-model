import React from 'react';
import { Plus, Minus, Maximize, Sun, Moon, Info } from 'lucide-react';
import { ThemeMode } from '../types';

interface UIControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onToggleInfo: () => void;
}

export const UIControls: React.FC<UIControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
  theme,
  onToggleTheme,
  onToggleInfo
}) => {
  const isNight = theme === ThemeMode.NIGHT;

  return (
    <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-50">
      <div className={`flex flex-col gap-2 p-2 rounded-xl backdrop-blur-md shadow-lg border ${
        isNight ? 'bg-slate-800/80 border-slate-600 text-white' : 'bg-white/80 border-slate-200 text-slate-800'
      }`}>
        <button
          onClick={onToggleInfo}
          className={`p-3 rounded-lg transition-colors ${
            isNight ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
          }`}
          title="Toggle Details"
        >
          <Info size={24} />
        </button>
        <button
          onClick={onToggleTheme}
          className={`p-3 rounded-lg transition-colors ${
            isNight ? 'hover:bg-slate-700 text-yellow-300' : 'hover:bg-slate-100 text-orange-500'
          }`}
          title="Toggle Theme"
        >
          {isNight ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>

      <div className={`flex flex-col gap-2 p-2 rounded-xl backdrop-blur-md shadow-lg border ${
        isNight ? 'bg-slate-800/80 border-slate-600 text-white' : 'bg-white/80 border-slate-200 text-slate-800'
      }`}>
        <button
          onClick={onZoomIn}
          className={`p-3 rounded-lg transition-colors ${
            isNight ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
          }`}
          title="Zoom In"
        >
          <Plus size={24} />
        </button>
        <div className="text-center text-xs font-mono py-1 opacity-60">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={onZoomOut}
          className={`p-3 rounded-lg transition-colors ${
            isNight ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
          }`}
          title="Zoom Out"
        >
          <Minus size={24} />
        </button>
        <button
          onClick={onReset}
          className={`p-3 rounded-lg transition-colors ${
            isNight ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
          }`}
          title="Reset View"
        >
          <Maximize size={24} />
        </button>
      </div>
    </div>
  );
};