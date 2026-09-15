import { BookOpen, Settings as SettingsIcon, Github } from 'lucide-react';
import { useState } from 'react';
import { ManualModal } from './ManualModal';
import { SettingsModal } from './SettingsModal';

export function Layout({ children, resetBestScore, soundEnabled, setSoundEnabled }) {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">🧠</span>
          <span>Memorama Premium</span>
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => setIsManualOpen(true)} title="Manual de Uso">
            <BookOpen size={20} />
          </button>
          <button className="nav-btn" onClick={() => setIsSettingsOpen(true)} title="Configuración">
            <SettingsIcon size={20} />
          </button>
          <a href="#" className="nav-btn" title="Ver código fuente">
            <Github size={20} />
          </a>
        </div>
      </nav>

      <main className="layout-content">
        {children}
      </main>

      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        resetBestScore={resetBestScore}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
    </div>
  );
}
