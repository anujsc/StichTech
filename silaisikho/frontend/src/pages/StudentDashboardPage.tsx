import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, BookOpen, TrendingUp, IndianRupee } from 'lucide-react';
import { clsx } from 'clsx';
import { Button, Badge, ProgressBar, Avatar, EmptyState, BilingualLabel } from '@/components/ui';
import { Navbar, CourseCard } from '@/components/shared';
import { MOCK_ENROLLMENTS, MOCK_COURSES, MOCK_VIDEO_PROGRESS, MOCK_STUDENTS } from '@/mockData';
import { ThumbnailGradientMap } from '@/types';
import { useAuth } from '@/context/AuthContext';
import type { IEnrollment } from '@/types';

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

type DashboardTab = 'courses' | 'history';

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('courses');

  // Fall back to first mock student if somehow no user (shouldn't happen — PrivateRoute guards this)
  const user = currentUser ?? MOCK_STUDENTS[0];

  // Enrollments for current user
  const myEnrollments = useMemo<IEnrollment[]>(
    () => MOCK_ENROLLMENTS.filter((e) => e.userId === user.id),
    [user.id]
  );

  // Continue watching = enrollment with highest progress that isn't 100%
  const continueEnrollment = useMemo<IEnrollment | null>(() => {
    const inProgress = myEnrollments.filter((e) => e.progressPercentage < 100);
    if (!inProgress.length) return null;
    return inProgress.reduce((best, e) => e.progressPercentage > best.progressPercentage ? e : best);
  }, [myEnrollments]);

  // Last watched video for continue card
  const continueVideo = useMemo(() => {
    if (!continueEnrollment) return null;
    const progEntries = MOCK_VIDEO_PROGRESS
      .filter((vp) => vp.userId === user.id && vp.courseId === continueEnrollment.courseId)
      .sort((a, b) => b.lastWatchedAt.getTime() - a.lastWatchedAt.getTime());
    if (!progEntries.length) return null;
    const course = MOCK_COURSES.find((c) => c.id === continueEnrollment.courseId);
    if (!course) return null;
    for (const mod of course.modules) {
      const v = mod.videos.find((v) => v.id === progEntries[0].videoId);
      if (v) return v;
    }
    return null;
  }, [continueEnrollment, user.id]);

  // Courses for the grid
  const enrolledCourses = useMemo(
    () => myEnrollments.map((enr) => ({
      enr,
      course: MOCK_COURSES.find((c) => c.id === enr.courseId),
    })).filter((x): x is { enr: IEnrollment; course: NonNullable<typeof x.course> } => !!x.course),
    [myEnrollments]
  );
  const stats = useMemo(() => ({
    total: myEnrollments.length,
    completed: myEnrollments.filter((e) => e.progressPercentage === 100).length,
    avgProgress: myEnrollments.length
      ? Math.round(myEnrollments.reduce((s, e) => s + e.progressPercentage, 0) / myEnrollments.length)
      : 0,
  }), [myEnrollments]);

  return (
    <div className="page-enter min-h-screen bg-surface pb-12">
      <Navbar transparent={false} currentPath={location.pathname} />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Greeting */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar name={user.name} size="lg" />
          <div>
            <BilingualLabel
              english={`Welcome back, ${user.name.split(' ')[0]}`}
              hindi={`नमस्ते, ${user.name.split(' ')[0]}`}
              englishSize="xl"
              englishWeight="bold"
              hindiSize="sm"
              gap="tight"
            />
            <p className="text-warm-text text-sm mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <BookOpen size={20} className="text-brand" />, value: stats.total, label: 'Courses', labelHi: 'कोर्स' },
            { icon: <TrendingUp size={20} className="text-gold" />, value: `${stats.avgProgress}%`, label: 'Avg Progress', labelHi: 'प्रगति' },
            { icon: <Badge variant="level-beginner" label={`${stats.completed}`} />, value: stats.completed, label: 'Completed', labelHi: 'पूरे किए' },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-xl shadow-card p-4 flex flex-col items-center text-center">
              {i !== 2 && s.icon}
              <span className="text-navy text-xl font-bold mt-1">{s.value}</span>
              <span className="text-warm-text text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Continue watching card */}
        {continueEnrollment && continueVideo && (
          <div className={clsx('rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4', ThumbnailGradientMap[continueEnrollment.courseThumbnailColour])}>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">Continue Watching</p>
              <p className="text-white font-semibold text-base line-clamp-1">{continueEnrollment.courseName}</p>
              <p className="text-white/80 text-sm mt-0.5 line-clamp-1">{continueVideo.title}</p>
              <ProgressBar percentage={continueEnrollment.progressPercentage} className="mt-3 max-w-xs" />
              <p className="text-white/70 text-xs mt-1">{continueEnrollment.progressPercentage}% complete</p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/watch/${continueEnrollment.courseId}/${continueVideo.id}`)}
              className="shrink-0"
            >
              <Play size={16} className="mr-1.5" /> जारी रखें
            </Button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
          {(['courses', 'history'] as DashboardTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'min-h-[40px] px-5 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab ? 'bg-card text-navy shadow-card' : 'text-warm-text hover:text-navy'
              )}
            >
              {tab === 'courses' ? 'My Courses' : 'Purchase History'}
            </button>
          ))}
        </div>

        {/* My Courses tab */}
        {activeTab === 'courses' && (
          <>
            {enrolledCourses.length === 0 ? (
              <EmptyState
                icon={<BookOpen />}
                englishMessage="No courses yet"
                hindiMessage="अभी कोई कोर्स नहीं"
                action={{ label: 'Browse Courses', onClick: () => navigate('/courses') }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {enrolledCourses.map(({ enr, course }) => (
                  <CourseCard
                    key={enr.id}
                    course={course}
                    variant="dashboard"
                    progressPercentage={enr.progressPercentage}
                    onClick={() => navigate(`/watch/${course.id}/${course.modules[0].videos[0].id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Purchase History tab */}
        {activeTab === 'history' && (
          <>
            {myEnrollments.length === 0 ? (
              <EmptyState
                icon={<IndianRupee />}
                englishMessage="No purchases yet"
                hindiMessage="अभी कोई खरीदारी नहीं"
                action={{ label: 'Browse Courses', onClick: () => navigate('/courses') }}
              />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block bg-card rounded-2xl shadow-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-warm-border">
                        <th className="text-left text-warm-text font-medium px-5 py-3">Course</th>
                        <th className="text-left text-warm-text font-medium px-5 py-3">Date</th>
                        <th className="text-right text-warm-text font-medium px-5 py-3">Amount</th>
                        <th className="text-center text-warm-text font-medium px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myEnrollments.map((enr) => (
                        <tr key={enr.id} className="border-b border-warm-border last:border-0 hover:bg-muted transition-colors">
                          <td className="px-5 py-4 text-navy font-medium">{enr.courseName}</td>
                          <td className="px-5 py-4 text-warm-text">{fmtDate(enr.enrolledAt)}</td>
                          <td className="px-5 py-4 text-right text-navy font-semibold">₹{enr.amountPaid}</td>
                          <td className="px-5 py-4 text-center">
                            <Badge variant="level-beginner" label="Paid" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden flex flex-col gap-3">
                  {myEnrollments.map((enr) => (
                    <div key={enr.id} className="bg-card rounded-xl shadow-card p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-navy font-medium text-sm line-clamp-2 flex-1">{enr.courseName}</p>
                        <Badge variant="level-beginner" label="Paid" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-warm-text text-xs">{fmtDate(enr.enrolledAt)}</span>
                        <span className="text-navy font-semibold text-sm">₹{enr.amountPaid}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
