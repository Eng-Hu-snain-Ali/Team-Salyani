import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceCard } from '../../components/common/ExperienceCard';
import { CategoryChip } from '../../components/common/CategoryChip';
import { SearchBar } from '../../components/common/SearchBar';
import { SkeletonList } from '../../components/common/SkeletonLoader';
import { CATEGORIES } from '../../constants';
import { experienceService } from '../../services/api';
import type { Experience, ExperienceCategory } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    user,
    setActiveTab,
    setExploreSearchQuery,
    setExploreSelectedCategory,
    isLoadingExperiences,
  } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const [recommended, setRecommended] = useState<Experience[]>([]);
  const [trending, setTrending] = useState<Experience[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoadingSections(true);
        const [recRes, trendRes] = await Promise.all([
          experienceService.getRecommended(user.interests),
          experienceService.getTrending(4),
        ]);
        if (recRes.data) setRecommended(recRes.data);
        if (trendRes.data) setTrending(trendRes.data);
      } catch {
        // Fallback handled in services
      } finally {
        setLoadingSections(false);
      }
    };
    loadHomeData();
  }, [user.interests]);

  const handleSearchSubmit = () => {
    if (searchVal.trim()) {
      setExploreSearchQuery(searchVal.trim());
      setActiveTab('explore');
    }
  };

  const handleCategoryClick = (cat: ExperienceCategory) => {
    setExploreSelectedCategory(cat);
    setActiveTab('explore');
  };

  return (
    <div className="home-clean-container">
      {/* Simple Header */}
      <header className="home-simple-hero">
        <h1 className="home-headline">Learn from real experiences.</h1>
        <p className="home-subheadline">
          Real stories, mistakes, and lessons from people who've already lived through the journey.
        </p>

        {/* Clean Search Bar */}
        <div className="home-search-wrap">
          <SearchBar
            value={searchVal}
            onChange={setSearchVal}
            onSubmit={handleSearchSubmit}
            placeholder="Search experiences..."
          />
        </div>

        {/* Category Chips */}
        <div className="home-categories-rail">
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>
      </header>

      {/* Main Stream */}
      <div className="home-streams-wrapper">
        {/* Recommended for You */}
        <section className="home-feed-section">
          <div className="section-title-bar">
            <h2 className="clean-section-title">Recommended for you</h2>
            <button
              type="button"
              className="clean-view-all-link"
              onClick={() => setActiveTab('explore')}
            >
              <span>Explore all</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {isLoadingExperiences || loadingSections ? (
            <SkeletonList count={2} />
          ) : (
            <div className="cards-feed-grid">
              {recommended.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Experiences */}
        {trending.length > 0 && (
          <section className="home-feed-section">
            <div className="section-title-bar">
              <h2 className="clean-section-title">Trending experiences</h2>
            </div>

            <div className="cards-feed-grid">
              {trending.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>
        )}

        {/* Simple Share Prompt */}
        <section className="home-simple-share-card">
          <div className="share-card-text">
            <h3>Lived through something worth sharing?</h3>
            <p>Post your real story in less than a minute and help someone on the same path.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setActiveTab('create')}
          >
            <Sparkles size={15} />
            <span>Share Experience</span>
          </button>
        </section>
      </div>
    </div>
  );
};
