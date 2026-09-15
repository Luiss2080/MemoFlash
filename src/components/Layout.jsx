import { BookOpen, Settings as SettingsIcon, BarChart2, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { ManualModal } from './ManualModal';
import { SettingsModal } from './SettingsModal';
import { StatsModal } from './StatsModal';
import { ProfileModal } from './ProfileModal';
import { getDict } from '../utils/i18n';

export function Layout({ children, resetBestScore, soundEnabled, setSoundEnabled, bgmEnabled, setBgmEnabled, globalStats, profile, setProfile, lang, setLang, themeMode, setThemeMode }) {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const t = getDict(lang);

  return (
    <div className="layout">
      <main className="layout-content">
        {children}
      </main>
      <nav className="floating-dock">
        <div className="logo cursor-pointer" onClick={() => setIsProfileOpen(true)} title={t.profile}>
          <span>{profile.avatar}</span>
        </div>
        <button className="nav-btn" onClick={() => setIsStatsOpen(true)} title={t.stats}>
          <BarChart2 size={20} />
        </button>
        <button className="nav-btn" onClick={() => setIsManualOpen(true)} title={t.manual}>
          <BookOpen size={20} />
        </button>
        <button className="nav-btn" onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} title={t.theme}>
          {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="nav-btn" onClick={() => setIsSettingsOpen(true)} title={t.settings}>
          <SettingsIcon size={20} />
        </button>
      </nav>

      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} lang={lang} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        resetBestScore={resetBestScore}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        bgmEnabled={bgmEnabled}
        setBgmEnabled={setBgmEnabled}
        lang={lang}
        setLang={setLang}
      />
      <StatsModal 
        isOpen={isStatsOpen} 
        onClose={() => setIsStatsOpen(false)}
        stats={globalStats}
        lang={lang}
      />
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        setProfile={setProfile}
        lang={lang}
      />
    </div>
  );
}
