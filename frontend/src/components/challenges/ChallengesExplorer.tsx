import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Filter
} from 'lucide-react';
import type { ModuleKey } from '../../types';

export const ChallengesExplorer: React.FC = () => {
  const { scenarios, attempts, startScenario, modules } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleKey | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const completedScenarioIds = new Set(attempts.map((a) => a.scenarioId));

  const filteredScenarios = scenarios.filter((s) => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesModule = selectedModule === 'all' || s.moduleKey === selectedModule;
    const matchesDiff = selectedDifficulty === 'all' || s.difficulty === selectedDifficulty;

    return matchesSearch && matchesModule && matchesDiff;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Title & Filter Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Explore Real-World Scenarios
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 4 }}>
          Choose from realistic everyday challenges to build practical intuition without real-world consequences.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--glass-border)',
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dilemmas by keyword (e.g., money, deadline, boss, friends)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '0.92rem',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Module Chips Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
            <Filter size={14} /> Module:
          </span>

          <button
            onClick={() => setSelectedModule('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: selectedModule === 'all' ? 'var(--brand-gradient)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedModule === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
              border: '1px solid var(--glass-border)',
              transition: 'all var(--transition-fast)',
            }}
          >
            All Modules ({scenarios.length})
          </button>

          {modules.map((mod) => {
            const isSelected = selectedModule === mod.key;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: isSelected ? mod.color : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isSelected ? `1px solid ${mod.color}` : '1px solid var(--glass-border)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {mod.name}
              </button>
            );
          })}
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: 4 }}>
            Difficulty:
          </span>

          {['all', 'beginner', 'intermediate', 'advanced'].map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20,
      }}>
        {filteredScenarios.map((scen) => {
          const isCompleted = completedScenarioIds.has(scen.id);
          return (
            <div
              key={scen.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
                borderTop: scen.isDailyChallenge ? '3px solid #F59E0B' : '1px solid var(--glass-border)',
              }}
            >
              {/* Header tags */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span className={`badge-pill badge-module-${scen.moduleKey.split('_')[0]}`}>
                    {scen.moduleKey.replace('_', ' ')}
                  </span>
                  {scen.isDailyChallenge && (
                    <span className="badge-pill badge-daily">
                      <Sparkles size={11} /> Daily
                    </span>
                  )}
                </div>

                {isCompleted && (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.78rem',
                    color: '#34D399',
                    fontWeight: 700,
                  }}>
                    <CheckCircle2 size={15} /> Completed
                  </span>
                )}
              </div>

              {/* Title & summary */}
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.4 }}>
                  {scen.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.6 }}>
                  {scen.summary}
                </p>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {scen.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Footer info & Play button */}
              <div style={{
                marginTop: 'auto',
                paddingTop: 14,
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} /> {scen.estimatedMinutes}m
                  </span>
                  <span style={{ textTransform: 'capitalize', color: scen.difficulty === 'beginner' ? '#34D399' : scen.difficulty === 'intermediate' ? '#FBBF24' : '#F472B6' }}>
                    {scen.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => startScenario(scen.id)}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                >
                  <span>{isCompleted ? 'Replay' : 'Practice'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            No scenarios found matching your filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedModule('all'); setSelectedDifficulty('all'); }}
            className="btn-secondary"
            style={{ marginTop: 12 }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
