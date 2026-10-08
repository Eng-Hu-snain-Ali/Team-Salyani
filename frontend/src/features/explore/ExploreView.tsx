import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceCard } from '../../components/common/ExperienceCard';
import { CategoryChip } from '../../components/common/CategoryChip';
import { SearchBar } from '../../components/common/SearchBar';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';
import { CATEGORIES, SORT_OPTIONS } from '../../constants';
import {
  CURATED_VIDEOS,
  IDEAS_WORTH_EXPLORING,
} from '../../data/mockData';
import { experienceService } from '../../services/api';
import type { Experience, ContentType, ExploreVideo, ExploreIdea } from '../../types';
import {
  Filter,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Play,
  Clock,
  TrendingUp,
  Bookmark,
  ThumbsUp,
  ArrowRight,
  Tv,
  Lightbulb,
} from 'lucide-react';

export const ExploreView: React.FC = () => {
  const {
    exploreSearchQuery,
    setExploreSearchQuery,
    exploreSelectedCategory,
    setExploreSelectedCategory,
    openExperience,
    toggleSave,
    openVideoDetail,
    openIdeaDetail,
  } = useApp();

  const [contentType, setContentType] = useState<ContentType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'newest' | 'most_helpful'>('most_helpful');
  const [results, setResults] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtered experiences fetch
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

  const isFiltering =
    exploreSearchQuery.trim().length > 0 ||
    exploreSelectedCategory !== 'All' ||
    contentType !== 'All';

  const handleClearFilters = () => {
    setExploreSearchQuery('');
    setExploreSelectedCategory('All');
    setContentType('All');
    setSortBy('most_helpful');
  };

  // Section collections
  const featuredExperiences = results.slice(0, 5);
  const trendingExperiences = [...results].sort(
    (a, b) => b.helpfulCount + b.likesCount - (a.helpfulCount + a.likesCount)
  );
  const recentlySharedExperiences = [...results].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="explore-view-container">
      {/* 1. Header & Search Bar */}
      <div className="explore-header-box">
        <h1 className="explore-page-title">Explore</h1>
        <p className="explore-page-desc">
          Discover experiences, ideas and lessons worth learning from.
        </p>

        <div className="explore-search-wrapper">
          <SearchBar
            value={exploreSearchQuery}
            onChange={setExploreSearchQuery}
            placeholder="Search experiences, topics, skills or ideas..."
          />
        </div>
      </div>

      {/* 2. Explore Categories (Horizontal Scrollable Rail) */}
      <div className="explore-category-rail-wrap">
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

      {/* 3. Explore Filters (Format & Sort) */}
      <div className="explore-filters-bar">
        {/* Content Type Filter Pills */}
        <div className="content-type-filter-row">
          <button
            type="button"
            className={`type-pill ${contentType === 'All' ? 'active' : ''}`}
            onClick={() => setContentType('All')}
          >
            <Layers size={13} />
            <span>All</span>
          </button>
          <button
            type="button"
            className={`type-pill ${contentType === 'story' ? 'active' : ''}`}
            onClick={() => setContentType('story')}
          >
            <span>Experiences</span>
          </button>
          <button
            type="button"
            className={`type-pill ${contentType === 'video' ? 'active' : ''}`}
            onClick={() => setContentType('video')}
          >
            <span>Videos</span>
          </button>
          <button
            type="button"
            className={`type-pill ${contentType === 'pdf' ? 'active' : ''}`}
            onClick={() => setContentType('pdf')}
          >
            <span>PDFs</span>
          </button>
          <button
            type="button"
            className={`type-pill ${contentType === 'guide' ? 'active' : ''}`}
            onClick={() => setContentType('guide')}
          >
            <span>Guides</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="sort-and-meta-row">
          <div className="sort-dropdown-wrap">
            <SlidersHorizontal size={13} className="sort-icon" />
            <span className="sort-label">Sort:</span>
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
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>

      {/* If Active Search or Filters, display targeted stream */}
      {isFiltering ? (
        <div className="explore-filtered-results-section">
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
              title="No experiences matched your query"
              description="Try adjusting your keywords or clearing category filters to discover related real-world lessons."
              actionLabel="Reset All Filters"
              onAction={handleClearFilters}
            />
          )}
        </div>
      ) : (
        /* Rich Multi-Section Discovery Hub */
        <div className="explore-rich-hub">
          {/* ============================================================== */}
          {/* SECTION 1: FEATURED EXPERIENCES (Large Premium Cards)           */}
          {/* ============================================================== */}
          <section className="explore-section">
            <div className="explore-section-header">
              <div className="explore-section-title-wrap">
                <Sparkles size={18} className="text-brand" />
                <h2>Featured Experiences</h2>
              </div>
              <span className="explore-section-tagline">
                Curated high-impact lessons from real people who lived it
              </span>
            </div>

            <div className="featured-cards-grid">
              {featuredExperiences.map((exp) => (
                <article
                  key={exp.id}
                  className="featured-experience-card"
                  onClick={() => openExperience(exp.id)}
                >
                  <div className="featured-card-top">
                    <span className="featured-category-badge">{exp.category}</span>
                    <span className="featured-format-badge">
                      {exp.contentType === 'video' ? 'Video' : 'Story'}
                    </span>
                  </div>

                  <h3 className="featured-card-title">{exp.title}</h3>
                  <p className="featured-card-desc">{exp.description}</p>

                  <div className="featured-card-footer">
                    <div className="featured-card-author">
                      <img
                        src={exp.author.avatar}
                        alt={exp.author.name}
                        className="author-mini-avatar"
                      />
                      <div className="author-mini-text">
                        <span className="author-name">{exp.author.name}</span>
                        <span className="read-time-text">
                          <Clock size={11} />
                          {exp.readTimeMinutes} min read
                        </span>
                      </div>
                    </div>

                    <div className="featured-card-actions">
                      <span className="featured-helpful-count">
                        <ThumbsUp size={13} />
                        {exp.helpfulCount}
                      </span>
                      <button
                        type="button"
                        className={`save-icon-btn ${exp.isSaved ? 'saved' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(exp.id);
                        }}
                        aria-label="Save experience"
                      >
                        <Bookmark size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2: WATCH & LEARN (Video Learning Section)               */}
          {/* ============================================================== */}
          <section className="explore-section video-learning-section">
            <div className="explore-section-header">
              <div className="explore-section-title-wrap">
                <Tv size={18} className="text-accent" />
                <h2>Watch & Learn</h2>
              </div>
              <span className="explore-section-tagline">
                Curated educational talks and frameworks • External Resources from YouTube
              </span>
            </div>

            <div className="video-cards-grid">
              {CURATED_VIDEOS.map((video: ExploreVideo) => (
                <div
                  key={video.id}
                  className="video-learning-card"
                  onClick={() => openVideoDetail(video)}
                >
                  <div className="video-thumbnail-box">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="video-thumb-img"
                    />
                    <div className="video-play-overlay">
                      <div className="play-circle-btn">
                        <Play size={18} fill="currentColor" />
                      </div>
                    </div>
                    <span className="video-duration-pill">{video.duration}</span>
                    <span className="video-source-pill">YouTube</span>
                  </div>

                  <div className="video-info-box">
                    <div className="video-cat-row">
                      <span className="video-cat-name">{video.category}</span>
                      {video.viewsCount && (
                        <span className="video-views-badge">{video.viewsCount}</span>
                      )}
                    </div>
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-creator">By {video.creator}</p>
                    <p className="video-short-desc">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 3: IDEAS WORTH EXPLORING                               */}
          {/* ============================================================== */}
          <section className="explore-section ideas-section">
            <div className="explore-section-header">
              <div className="explore-section-title-wrap">
                <Lightbulb size={18} className="text-warning" />
                <h2>Ideas Worth Exploring</h2>
              </div>
              <span className="explore-section-tagline">
                Core mental models and actionable execution blueprints
              </span>
            </div>

            <div className="ideas-cards-grid">
              {IDEAS_WORTH_EXPLORING.map((idea: ExploreIdea) => (
                <div
                  key={idea.id}
                  className="idea-concept-card"
                  onClick={() => openIdeaDetail(idea)}
                >
                  <div className="idea-card-header">
                    <span className="idea-cat-tag">{idea.category}</span>
                    <span className="idea-time-tag">
                      <Clock size={11} />
                      {idea.readTimeMinutes}m
                    </span>
                  </div>

                  <h3 className="idea-card-title">{idea.title}</h3>
                  <p className="idea-card-summary">{idea.summary}</p>

                  <div className="idea-card-cta">
                    <span>Read Blueprint</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 4: TRENDING THIS WEEK                                  */}
          {/* ============================================================== */}
          <section className="explore-section">
            <div className="explore-section-header">
              <div className="explore-section-title-wrap">
                <TrendingUp size={18} className="text-brand" />
                <h2>Trending This Week</h2>
              </div>
              <span className="explore-section-tagline">
                Most appreciated lessons and discussions across the community
              </span>
            </div>

            <div className="cards-feed-grid">
              {trendingExperiences.slice(0, 4).map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 5: RECENTLY SHARED                                     */}
          {/* ============================================================== */}
          <section className="explore-section">
            <div className="explore-section-header">
              <div className="explore-section-title-wrap">
                <Clock size={18} />
                <h2>Recently Shared</h2>
              </div>
              <span className="explore-section-tagline">
                The newest unvarnished stories posted by learners and builders
              </span>
            </div>

            <div className="cards-feed-grid">
              {recentlySharedExperiences.slice(0, 4).map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
