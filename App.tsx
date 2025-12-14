import React, { useState, useCallback } from 'react';
import { BridgeViewer } from './components/BridgeViewer';
import { UIControls } from './components/UIControls';
import { InfoPanel } from './components/InfoPanel';
import { ThemeMode } from './types';

function App() {
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.DAY);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(50); // 0-100 representation
  const [controlAction, setControlAction] = useState<'zoomIn' | 'zoomOut' | 'reset' | null>(null);

  const handleZoomIn = useCallback(() => {
    setControlAction('zoomIn');
  }, []);

  const handleZoomOut = useCallback(() => {
    setControlAction('zoomOut');
  }, []);

  const handleReset = useCallback(() => {
    setControlAction('reset');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === ThemeMode.DAY ? ThemeMode.NIGHT : ThemeMode.DAY));
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      <BridgeViewer 
        theme={theme}
        onZoomChange={setZoomLevel}
        controlAction={controlAction}
        onControlActionHandled={() => setControlAction(null)}
      />
      
      <div className="absolute top-8 left-8 z-30 pointer-events-none select-none">
         <h1 className={`text-4xl font-bold tracking-tighter ${
            theme === ThemeMode.NIGHT ? 'text-white drop-shadow-lg' : 'text-slate-900 drop-shadow-sm'
         }`}>
            STRUCTURA<span className="text-blue-500">3D</span>
         </h1>
         <p className={`text-sm mt-1 font-medium ${
             theme === ThemeMode.NIGHT ? 'text-slate-300' : 'text-slate-600'
         }`}>
             Interactive Cable-Stayed Bridge Model
         </p>
      </div>

      <UIControls
        scale={zoomLevel / 100} // Map 0-100 back to 0-1 for consistent prop type usage in UIControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleInfo={() => setIsInfoOpen(true)}
      />

      <InfoPanel 
        isOpen={isInfoOpen} 
        onClose={() => setIsInfoOpen(false)} 
        theme={theme}
      />
    </div>
  );
}

export default App;