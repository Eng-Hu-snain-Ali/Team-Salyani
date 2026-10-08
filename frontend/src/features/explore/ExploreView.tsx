import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceCard } from '../../components/common/ExperienceCard';
import { CategoryChip } from '../../components/common/CategoryChip';
import { SearchBar } from '../../components/common/SearchBar';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';
import { CATEGORIES, CONTENT_TYPES, SORT_OPTIONS } from '../../constants';
import { experienceService } from '../../services/api';
import type { Experience, ContentType } from '../../types';
import { Filter, SlidersHorizontal, Layers } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const {
    exploreSearchQuery,
    setExploreSearchQuery,
    exploreSelectedCategory,
    setExploreSelectedCategory,
  } = useApp();

  const [contentType, setContentType] = useState<ContentType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'newest' | 'most_helpful'>('most_helpful');
  const [results, setResults] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync exploration filters with API query
  useEffect(() => {
    let isCancelled = false;

    const fetchFiltered = async () => {
      try {
        setLoading(true);
        const res = await experienceService.getExperiences({
          searchQuery: exploreSearchQuery,
          category: exploreSelectedCategory,
          contentType: contentType,
          sortBy: sortBy,
        });

        if (!isCancelled && res.data) {
          setResults(res.data);
        }
      } catch {
        if (!isCancelled) setResults([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchFiltered();

    return () => {
      isCancelled = true;
    };
  }, [exploreSearchQuery, exploreSelectedCategory, contentType, sortBy]);

  const handleClearFilters = () => {
    setExploreSearchQuery('');
    setExploreSelectedCategory('All');
    setContentType('All');
    setSortBy('most_helpful');
  };

  return (
    <div className="explore-view-container">
      {/* Header & Search */}
      <div className="explore-header-box">
        <h1 className="explore-page-title">Explore Experiences</h1>
        <p className="explore-page-desc">
          Search by real-world problem, failure, industry, or specific life transition.
        </p>

        <div className="explore-search-wrapper">
          <SearchBar
            value={exploreSearchQuery}
            onChange={setExploreSearchQuery}
            placeholder="Search by topic, problem, skill or experience..."
          />
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="explore-filters-bar">
        {/* Content Type Filter Pills */}
        <div className="content-type-filter-row">
          <button
            type="button"
            className={`type-pill ${contentType === 'All' ? 'active' : ''}`}
            onClick={() => setContentType('All')}
          >
            <Layers size={13} />
            <span>All Formats</span>
          </button>
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`type-pill ${contentType === type.id ? 'active' : ''}`}
              onClick={() => setContentType(type.id)}
            >
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Sort and Topic Selectors */}
        <div className="sort-and-meta-row">
          <div className="sort-dropdown-wrap">
            <SlidersHorizontal size={14} className="sort-icon" />
            <span className="sort-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'popularity' | 'newest' | 'most_helpful')
              }
              className="sort-select-input"
              aria-label="Sort experiences"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <span className="results-count-text">
            {results.length} {results.length === 1 ? 'experience' : 'experiences'} found
          </span>
        </div>

        {/* Category Horizontal Chips */}
        <div className="explore-category-chips-rail">
          <CategoryChip
            category="All"
            isSelected={exploreSelectedCategory === 'All'}
            onClick={() => setExploreSelectedCategory('All')}
          />
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat.id}
              isSelected={exploreSelectedCategory === cat.id}
              onClick={() => setExploreSelectedCategory(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Results Stream */}
      <div className="explore-results-stream">
        {loading ? (
          <SkeletonList count={3} />
        ) : results.length > 0 ? (
          <div className="cards-feed-grid">
            {results.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Filter size={32} />}
            title="No experiences matched your criteria"
            description="Try clearing your search terms or selecting 'All Formats' to discover stories across all categories."
            actionLabel="Reset All Filters"
            onAction={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
};
