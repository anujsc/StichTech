import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, SearchX } from 'lucide-react';
import { clsx } from 'clsx';
import { EmptyState } from '@/components/ui';
import { Navbar, CourseCard } from '@/components/shared';
import { MOCK_COURSES } from '@/mockData';
import type { CourseLevel, CourseLanguage } from '@/types';

type FilterOption = 'All' | CourseLevel | CourseLanguage;

const FILTERS: { label: string; hindi: string; value: FilterOption }[] = [
  { label: 'All',          hindi: 'सभी',      value: 'All' },
  { label: 'Beginner',     hindi: 'शुरुआत',   value: 'beginner' },
  { label: 'Intermediate', hindi: 'मध्यम',    value: 'intermediate' },
  { label: 'Advanced',     hindi: 'एडवांस',   value: 'advanced' },
  { label: 'Hindi',        hindi: 'हिंदी',    value: 'Hindi' },
  { label: 'English',      hindi: 'अंग्रेजी', value: 'English' },
];

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card">
      <div className="h-[180px] animate-pulse bg-warm-border" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 animate-pulse bg-muted rounded w-3/4" />
        <div className="h-3 animate-pulse bg-muted rounded w-1/2" />
        <div className="h-3 animate-pulse bg-muted rounded w-1/3" />
        <div className="h-9 animate-pulse bg-muted rounded-pill mt-1" />
      </div>
    </div>
  );
}

export default function CourseCatalogPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter((c) => {
      const matchesSearch = search === '' || c.title.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (activeFilter === 'All') return true;
      if (['beginner', 'intermediate', 'advanced'].includes(activeFilter)) {
        return c.level === (activeFilter as CourseLevel);
      }
      return c.language === (activeFilter as CourseLanguage);
    });
  }, [search, activeFilter]);

  const resetFilters = () => { setSearch(''); setActiveFilter('All'); };

  return (
    <div className="page-enter min-h-screen bg-surface">
      <Navbar transparent={false} currentPath={location.pathname} />

      {/* Header strip */}
      <div className="bg-muted py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-navy text-3xl font-bold">Browse All Courses</h1>
          <p className="text-gold text-lg mt-1">सभी कोर्स देखें</p>
          {/* Search */}
          <div className="relative max-w-2xl mx-auto mt-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-text" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-full border border-warm-border bg-card pl-12 pr-10 py-3 text-base text-navy placeholder:text-warm-text focus:ring-2 focus:ring-brand focus:border-brand transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-text hover:text-navy"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="bg-card border-b border-warm-border py-4 px-4">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex gap-3 w-max">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all min-h-[40px] whitespace-nowrap',
                  activeFilter === f.value
                    ? 'bg-brand text-white'
                    : 'bg-muted text-warm-text border border-warm-border hover:bg-warm-border'
                )}
              >
                {f.label} — {f.hindi}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isLoading && (
          <p className="text-warm-text text-sm mb-4">
            Showing {filteredCourses.length} courses — {filteredCourses.length} कोर्स मिले
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            icon={<SearchX />}
            englishMessage="No courses found for your search"
            hindiMessage="आपकी खोज में कोई कोर्स नहीं मिला"
            action={{ label: 'Clear Filters — फ़िल्टर हटाएं', onClick: resetFilters }}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredCourses.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                variant="catalog"
                onClick={() => navigate(`/courses/${c.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
