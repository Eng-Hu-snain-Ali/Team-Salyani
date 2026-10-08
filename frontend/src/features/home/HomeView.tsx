import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceCard } from '../../components/common/ExperienceCard';
import { LessonCard } from '../../components/common/LessonCard';
import { CategoryChip } from '../../components/common/CategoryChip';
import { SearchBar } from '../../components/common/SearchBar';
import { SkeletonList } from '../../components/common/SkeletonLoader';
import { CATEGORIES } from '../../constants';
import { experienceService } from '../../services/api';
import type { Experience, Lesson, ExperienceCategory } from '../../types';
import { Flame, Compass, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    user,
    setActiveTab,
    setExploreSearchQuery,
    setExploreSelectedCategory,
    openExperience,
    isLoadingExperiences,
  } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const [recommended, setRecommended] = useState<Experience[]>([]);
  const [trending, setTrending] = useState<Experience[]>([]);
  const [shortLessons, setShortLessons] = useState<
    Array<Lesson & { experienceId: string; experienceTitle: string; category: string }>
  >([]);
  const [loadingSections, setLoadingSections] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoadingSections(true);
        const [recRes, trendRes, lessonsRes] = await Promise.all([
          experienceService.getRecommended(user.interests),
          experienceService.getTrending(3),
          experienceService.getShortLessons(4),
        ]);
        if (recRes.data) setRecommended(recRes.data);
        if (trendRes.data) setTrending(trendRes.data);
        if (lessonsRes.data) setShortLessons(lessonsRes.data);
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
    <div className="home-view-container">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>Human Experience Repository</span>
          </div>
          <h1 className="hero-title">Learn from lives, not just books.</h1>
          <p className="hero-subtitle">
            People learn best from those who have already lived through the struggle. Discover real
            mistakes, proven solutions, and unfiltered blueprints.
          </p>

          {/* Quick Search */}
          <div className="hero-search-box">
            <SearchBar
              value={searchVal}
              onChange={setSearchVal}
              onSubmit={handleSearchSubmit}
              placeholder="Search experiences, topics, problems..."
            />
            <button
              type="button"
              className="btn-primary hero-search-btn"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="hero-categories-rail">
          <div className="rail-label">Browse by Topic:</div>
          <div className="categories-scroll-row">
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Stream */}
      <div className="home-content-stream">
        {/* 1. Recommended for You */}
        <section className="home-section">
          <div className="section-header-row">
            <div className="section-title-group">
              <div className="section-icon-wrap recommended">
                <Compass size={18} />
              </div>
              <div>
                <h2 className="section-title">Recommended for You</h2>
                <p className="section-subtext">
                  Tailored to your focus areas:{' '}
                  <strong>{user.interests.slice(0, 3).join(', ')}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              className="section-see-all-btn"
              onClick={() => setActiveTab('explore')}
            >
              <span>Explore All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {isLoadingExperiences || loadingSections ? (
            <SkeletonList count={2} />
          ) : (
            <div className="cards-feed-grid">
              {recommended.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} featured={true} />
              ))}
            </div>
          )}
        </section>

        {/* 2. Trending Experiences */}
        <section className="home-section">
          <div className="section-header-row">
            <div className="section-title-group">
              <div className="section-icon-wrap trending">
                <Flame size={18} />
              </div>
              <div>
                <h2 className="section-title">Trending Experiences</h2>
                <p className="section-subtext">
                  Most helpful real stories discussed by the community this week
                </p>
              </div>
            </div>
            <button
              type="button"
              className="section-see-all-btn"
              onClick={() => setActiveTab('explore')}
            >
              <span>View More</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {isLoadingExperiences || loadingSections ? (
            <SkeletonList count={2} />
          ) : (
            <div className="cards-feed-grid">
              {trending.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          )}
        </section>

        {/* 3. Short Lessons (Educational Bite-sized Wisdom) */}
        <section className="home-section short-lessons-section">
          <div className="section-header-row">
            <div className="section-title-group">
              <div className="section-icon-wrap lessons">
                <BookOpen size={18} />
              </div>
              <div>
                <h2 className="section-title">Short Lessons</h2>
                <p className="section-subtext">
                  Direct, actionable takeaways distilled from real triumphs and failures
                </p>
              </div>
            </div>
          </div>

          <div className="lessons-grid">
            {shortLessons.map((item) => (
              <LessonCard
                key={item.id}
                lesson={item}
                category={item.category}
                onClick={() => openExperience(item.experienceId)}
              />
            ))}
          </div>
        </section>

        {/* Bottom Banner: Call to Share Experience */}
        <section className="home-share-prompt-banner">
          <div className="prompt-banner-content">
            <span className="prompt-badge">Share Your Journey</span>
            <h3 className="prompt-title">
              "Your experience might save someone else's time."
            </h3>
            <p className="prompt-desc">
              Have you solved a tough problem, made an expensive mistake, or learned how to land a
              job? Write down what worked and what failed.
            </p>
            <button
              type="button"
              className="btn-primary share-cta-btn"
              onClick={() => setActiveTab('create')}
            >
              <Sparkles size={16} />
              <span>Share Your Experience</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
