import React from 'react';
import type { Challenge } from '../../types';
import { useApp } from '../../context/AppContext';
import { Clock, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../constants';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const { openChallengePlayer } = useApp();

  const categoryMeta = SKILL_CATEGORIES.find((c) => c.id === challenge.category) || SKILL_CATEGORIES[0];

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return <span className="badge badge-green">Beginner</span>;
      case 'Advanced':
        return <span className="badge badge-purple">Advanced</span>;
      default:
        return <span className="badge badge-orange">Intermediate</span>;
    }
  };

  return (
    <article
      className="challenge-card"
      onClick={() => openChallengePlayer(challenge)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') openChallengePlayer(challenge);
      }}
    >
      <div className="challenge-card-top">
        <span
          className="badge"
          style={{
            backgroundColor: categoryMeta.badgeBg,
            color: categoryMeta.color,
          }}
        >
          {categoryMeta.name}
        </span>
        {getDifficultyBadge(challenge.difficulty)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 className="challenge-card-title">{challenge.title}</h3>
        <p className="challenge-card-desc">{challenge.summary}</p>
      </div>

      <div className="challenge-card-bottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} />
            {challenge.estimatedMinutes}m
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 700 }}>
            <Zap size={13} />
            +{challenge.xpReward} XP
          </span>
        </div>

        {challenge.completed ? (
          <span className="challenge-completed-tag">
            <CheckCircle2 size={15} />
            <span>Solved</span>
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>Play</span>
            <ChevronRight size={14} />
          </span>
        )}
      </div>
    </article>
  );
};
