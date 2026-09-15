import { Card } from './Card';

export function Board({ cards, flippedIndices, matchedIndices, onFlip, level }) {
  const cols = level === 'facil' ? 4 : level === 'medio' ? 6 : 6;
  
  return (
    <div 
      className="board"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {cards.map((card, index) => (
        <div key={card.id} className="card-wrapper" style={{ animationDelay: `${index * 0.05}s` }}>
          <Card 
            content={card.content}
            isFlipped={flippedIndices.includes(index) || matchedIndices.includes(index)}
            isMatched={matchedIndices.includes(index)}
            onClick={() => onFlip(index)}
          />
        </div>
      ))}
    </div>
  );
}
