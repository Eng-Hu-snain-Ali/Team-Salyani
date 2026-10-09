import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 1 to 5
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (newRating: number) => void;
  showNumeric?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  interactive = false,
  onRatingChange,
  showNumeric = false,
}) => {
  return (
    <div className={`rating-stars-group ${interactive ? 'interactive' : ''}`}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            type="button"
            key={index}
            className={`star-button ${isFilled ? 'filled' : 'empty'}`}
            disabled={!interactive}
            onClick={() => {
              if (interactive && onRatingChange) {
                onRatingChange(starValue);
              }
            }}
            aria-label={`${starValue} stars`}
          >
            <Star
              size={size}
              fill={isFilled ? '#F59E0B' : 'transparent'}
              stroke={isFilled ? '#F59E0B' : '#94A3B8'}
            />
          </button>
        );
      })}
      {showNumeric && (
        <span className="rating-numeric-val">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};
