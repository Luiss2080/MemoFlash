import { Modal } from './Modal';
import { Volume2, VolumeX, Trash2 } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, resetBestScore, soundEnabled, setSoundEnabled }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración">
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-icon">{soundEnabled ? <Volume2 /> : <VolumeX />}</span>
            <div>
              <h4>Efectos de Sonido</h4>
              <p>Activar o desactivar sonidos del juego</p>
            </div>
          </div>
          <button 
            className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="setting-item danger">
          <div className="setting-info">
            <span className="setting-icon"><Trash2 /></span>
            <div>
              <h4>Borrar Datos</h4>
              <p>Eliminar tu mejor puntuación guardada</p>
            </div>
          </div>
          <button className="btn-danger" onClick={resetBestScore}>
            Resetear
          </button>
        </div>
      </div>
    </Modal>
  );
}
