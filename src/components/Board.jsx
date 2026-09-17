import { Card } from './Card';
import { getDict } from '../utils/i18n';

export function Board({ cards, flippedIndices, matchedIndices, onFlip, level, lang }) {
  const cols = level === 'facil' ? 4 : level === 'medio' ? 6 : 6;
  const t = getDict(lang);

  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {cards.map((card, index) => {
        const isMatched = matchedIndices.includes(index);
        const isFlipped = flippedIndices.includes(index) || isMatched;
        const position = index + 1;
        // Face-down cards get a label that does NOT spoil their content.
        // Once flipped/matched, the label includes the emoji so screen
        // reader users get the same information sighted players see.
        const label = isMatched
          ? t.card_matched(position, card.content)
          : isFlipped
            ? t.card_revealed(position, card.content)
            : t.card_hidden(position);

        return (
          <div key={card.id} className="card-wrapper" style={{ animationDelay: `${index * 0.05}s` }}>
            <Card
              content={card.content}
              isFlipped={isFlipped}
              isMatched={isMatched}
              onClick={() => onFlip(index)}
              label={label}
            />
          </div>
        );
      })}
    </div>
  );
}
