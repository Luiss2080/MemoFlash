export function Card({ content, isFlipped, isMatched, onClick }) {
  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="card-inner">
        <div className="card-front">
          ❓
        </div>
        <div className="card-back">
          {content}
        </div>
      </div>
    </div>
  );
}
