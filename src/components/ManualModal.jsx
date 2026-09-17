import { Modal } from './Modal';
import { BookOpen, Trophy, Clock } from 'lucide-react';
import { getDict } from '../utils/i18n';

export function ManualModal({ isOpen, onClose, lang }) {
  const t = getDict(lang);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.manual}>
      <div className="manual-section">
        <h3><BookOpen size={20} /> Reglas Básicas</h3>
        <p>El objetivo del Memorama es encontrar todos los pares de cartas idénticas en el menor tiempo y con la menor cantidad de intentos posibles.</p>
        <ul>
          <li>Voltea dos cartas por turno.</li>
          <li>Si coinciden, se quedarán boca arriba.</li>
          <li>Si no coinciden, se volverán a ocultar después de un breve momento.</li>
        </ul>
      </div>

      <div className="manual-section">
        <h3><Trophy size={20} /> Sistema de Puntuación</h3>
        <p>Tu puntuación final se calcula usando la siguiente fórmula:</p>
        <ul>
          <li><strong>Pareja encontrada:</strong> +100 puntos.</li>
          <li><strong>Bono por rapidez:</strong> Ganas puntos extra por encontrar la pareja en pocos segundos.</li>
          <li><strong>Bono final:</strong> Al ganar, recibes una bonificación masiva si tu tiempo total es muy bajo.</li>
        </ul>
      </div>

      <div className="manual-section">
        <h3><Clock size={20} /> Dificultades</h3>
        <ul>
          <li><strong>Fácil:</strong> 4x4 (8 parejas).</li>
          <li><strong>Medio:</strong> 4x6 (12 parejas).</li>
          <li><strong>Difícil:</strong> 6x6 (18 parejas).</li>
        </ul>
      </div>
    </Modal>
  );
}
