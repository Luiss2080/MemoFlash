import { Modal } from './Modal';
import { BarChart, Trophy, Clock } from 'lucide-react';
import { getDict } from '../utils/i18n';

export function StatsModal({ isOpen, onClose, stats, lang }) {
  const t = getDict(lang);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.stats}>
      <div className="stats-container">
        <div className="stat-card">
          <Trophy size={32} style={{ color: '#fbbf24' }} />
          <div className="stat-info">
            <span className="stat-value">{stats.gamesWon}</span>
            <span className="stat-label">{t.games_won}</span>
          </div>
        </div>
        <div className="stat-card">
          <BarChart size={32} style={{ color: '#60a5fa' }} />
          <div className="stat-info">
            <span className="stat-value">{stats.gamesPlayed}</span>
            <span className="stat-label">{t.games_played}</span>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={32} style={{ color: '#34d399' }} />
          <div className="stat-info">
            <span className="stat-value">{Math.floor(stats.totalTime / 60)}m {stats.totalTime % 60}s</span>
            <span className="stat-label">{t.total_time}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
