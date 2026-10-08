import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChallengeCard } from './ChallengeCard';
import { SearchBar } from '../../components/common/SearchBar';
import { EmptyState } from '../../components/common/EmptyState';
import { SKILL_CATEGORIES, DIFFICULTY_LEVELS } from '../../constants';
import type { SkillCategory, ChallengeDifficulty } from '../../types';
import { Compass, Sparkles, Filter } from 'lucide-react';

export const ChallengesView: React.FC = () => {
  const { challenges, openChallengePlayer } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | 'All'>('All');

  // Filter challenges
  const filtered = challenges.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'All' && c.difficulty !== selectedDifficulty) return false;
    if (searchVal.trim()) {
      const q = searchVal.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchSummary = c.summary.toLowerCase().includes(q);
      const matchTags = c.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchTags) return false;
    }
    return true;
  });

  const dailyChallenge = challenges.find((c) => c.isDaily);

  return (
    <div className="challenges-view-wrap">
      {/* Header & Description */}
      <div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
          Real-Life Scenario Challenges
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Practice tough everyday situations, see consequences unfold, and build antifragile instincts.
        </p>
      </div>

      {/* Daily Challenge Banner if available */}
      {dailyChallenge && (
        <section className="daily-challenge-hero">
          <div className="daily-header-tag">
            <span className="badge badge-blue">
              <Sparkles size={12} />
              <span>Daily Challenge</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Updated Daily • +{dailyChallenge.xpReward} XP
            </span>
          </div>

          <div>
            <h2 className="daily-title">{dailyChallenge.title}</h2>
            <p className="daily-summary">{dailyChallenge.summary}</p>
          </div>

          <div className="daily-meta-bar">
            <div className="meta-badges-group">
              <span className="badge badge-orange">{dailyChallenge.difficulty}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                ~{dailyChallenge.estimatedMinutes} minutes
              </span>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => openChallengePlayer(dailyChallenge)}
            >
              {dailyChallenge.completed ? 'Review Solution' : 'Solve Daily Scenario'}
            </button>
          </div>
        </section>
      )}

      {/* Search & Category Filter Pills */}
      <div className="search-filters-bar">
        <SearchBar
          value={searchVal}
          onChange={setSearchVal}
          placeholder="Search by keyword, scenario or dilemma..."
        />

        {/* Skill Category Filter Pills */}
        <div className="filter-pills-row">
          <button
            type="button"
            className={`filter-pill ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All Skills
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Difficulty Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} />
            Difficulty:
          </span>
          <button
            type="button"
            className={`filter-pill ${selectedDifficulty === 'All' ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            onClick={() => setSelectedDifficulty('All')}
          >
            All
          </button>
          {DIFFICULTY_LEVELS.map((diff) => (
            <button
              key={diff}
              type="button"
              className={`filter-pill ${selectedDifficulty === diff ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              onClick={() => setSelectedDifficulty(diff)}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List Grid */}
      {filtered.length > 0 ? (
        <div className="challenges-grid">
          {filtered.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Compass size={32} />}
          title="No challenges found"
          description="Try selecting a different skill category, clearing your search query, or resetting the difficulty tier."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchVal('');
            setSelectedCategory('All');
            setSelectedDifficulty('All');
          }}
        />
      )}
    </div>
  );
};
