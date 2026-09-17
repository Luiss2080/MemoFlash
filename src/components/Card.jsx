export function Card({ content, isFlipped, isMatched, onClick, label }) {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={isFlipped || isMatched}
      aria-disabled={isMatched}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="card-inner">
        <div className="card-front" aria-hidden="true">
          ❓
        </div>
        <div className="card-back" aria-hidden="true">
          {content}
        </div>
      </div>
    </div>
  );
}
