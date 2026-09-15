import { BookOpen, Settings as SettingsIcon, Github, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { ManualModal } from './ManualModal';
import { SettingsModal } from './SettingsModal';
import { StatsModal } from './StatsModal';
import { ProfileModal } from './ProfileModal';

export function Layout({ children, resetBestScore, soundEnabled, setSoundEnabled, bgmEnabled, setBgmEnabled, globalStats, profile, setProfile }) {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="logo cursor-pointer" onClick={() => setIsProfileOpen(true)} title="Editar Perfil">
          <span>{profile.avatar} {profile.name}</span>
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => setIsStatsOpen(true)} title="Estadísticas">
            <BarChart2 size={20} />
          </button>
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
        bgmEnabled={bgmEnabled}
        setBgmEnabled={setBgmEnabled}
      />
      <StatsModal 
        isOpen={isStatsOpen} 
        onClose={() => setIsStatsOpen(false)}
        stats={globalStats} 
      />
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        setProfile={setProfile}
      />
    </div>
  );
}
