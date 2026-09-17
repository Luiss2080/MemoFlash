import { Modal } from './Modal';
import { Volume2, Trash2, Music, Globe } from 'lucide-react';
import { getDict } from '../utils/i18n';

export function SettingsModal({ isOpen, onClose, resetBestScore, soundEnabled, setSoundEnabled, bgmEnabled, setBgmEnabled, lang, setLang }) {
  const t = getDict(lang);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.settings}>
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-info">
            <Volume2 size={20} className="text-blue-400"/>
            <span>{t.sfx}</span>
          </div>
          <button 
            className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <Music size={20} className="text-purple-400"/>
            <span>{t.bgm}</span>
          </div>
          <button 
            className={`toggle-btn ${bgmEnabled ? 'active' : ''}`}
            onClick={() => setBgmEnabled(!bgmEnabled)}
          >
            {bgmEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <Globe size={20} />
            <span>{t.lang}</span>
          </div>
          <select className="styled-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="settings-divider"></div>

        <div className="setting-item danger">
          <div className="setting-info">
            <span className="setting-icon"><Trash2 /></span>
            <span>Borrar Historial</span>
          </div>
          <button className="btn-danger" onClick={() => {
            if(window.confirm('¿Estás seguro?')) {
              resetBestScore();
              onClose();
            }
          }}>Borrar</button>
        </div>
      </div>
    </Modal>
  );
}
