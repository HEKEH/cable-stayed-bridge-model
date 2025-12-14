import React from 'react';
import { X, Anchor, ArrowRightLeft, Triangle } from 'lucide-react';
import { ThemeMode } from '../types';

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ isOpen, onClose, theme }) => {
  const isNight = theme === ThemeMode.NIGHT;
  
  if (!isOpen) return null;

  return (
    <div className={`absolute top-0 left-0 h-full w-96 backdrop-blur-xl z-40 transform transition-transform duration-300 ease-in-out shadow-2xl border-r ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${
      isNight 
        ? 'bg-slate-900/90 border-slate-700 text-slate-100' 
        : 'bg-white/90 border-slate-200 text-slate-800'
    }`}>
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Bridge Engineering</h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${isNight ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-3 text-blue-500">
              <Triangle className="w-6 h-6" />
              <h3 className="text-xl font-semibold">The Pylons (Towers)</h3>
            </div>
            <p className={`leading-relaxed ${isNight ? 'text-slate-400' : 'text-slate-600'}`}>
              The defining feature of a cable-stayed bridge. These massive vertical concrete or steel structures bear the primary load. 
              The cables transfer the weight of the deck directly to these towers, which then transfer the load to the foundation (piers).
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3 text-purple-500">
              <Anchor className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Stay Cables</h3>
            </div>
            <p className={`leading-relaxed ${isNight ? 'text-slate-400' : 'text-slate-600'}`}>
              High-strength steel cables arranged in a fan-like pattern. Unlike suspension bridges where cables hang vertically from a main cable, 
              in a cable-stayed bridge, cables run obliquely from the tower directly to the deck segments.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3 text-emerald-500">
              <ArrowRightLeft className="w-6 h-6" />
              <h3 className="text-xl font-semibold">The Deck</h3>
            </div>
            <p className={`leading-relaxed ${isNight ? 'text-slate-400' : 'text-slate-600'}`}>
              The roadway structure itself. It is usually an orthotropic steel deck or prestressed concrete box girder, designed to be 
              aerodynamic to resist wind flutter at high altitudes.
            </p>
          </section>

          <div className={`p-4 rounded-lg border ${
            isNight ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className="font-bold mb-2 text-sm uppercase tracking-wider opacity-70">Interactive Controls</h4>
            <ul className={`text-sm space-y-2 ${isNight ? 'text-slate-400' : 'text-slate-600'}`}>
              <li className="flex items-center gap-2">
                <span className="font-mono bg-opacity-20 bg-current px-1 rounded">Scroll</span> Zoom In/Out
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono bg-opacity-20 bg-current px-1 rounded">Drag</span> Pan view
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono bg-opacity-20 bg-current px-1 rounded">Dbl Click</span> Reset View
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};