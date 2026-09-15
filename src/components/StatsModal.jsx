import { Modal } from './Modal';
import { BarChart, Trophy, Clock } from 'lucide-react';

export function StatsModal({ isOpen, onClose, stats }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Estadísticas">
      <div className="stats-container">
        <div className="stat-card">
          <Trophy size={32} style={{ color: '#fbbf24' }} />
          <div className="stat-info">
            <span className="stat-value">{stats.gamesWon}</span>
            <span className="stat-label">Victorias</span>
          </div>
        </div>
        <div className="stat-card">
          <BarChart size={32} style={{ color: '#60a5fa' }} />
          <div className="stat-info">
            <span className="stat-value">{stats.gamesPlayed}</span>
            <span className="stat-label">Partidas Jugadas</span>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={32} style={{ color: '#34d399' }} />
          <div className="stat-info">
            <span className="stat-value">{Math.floor(stats.totalTime / 60)}m {stats.totalTime % 60}s</span>
            <span className="stat-label">Tiempo Total</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
