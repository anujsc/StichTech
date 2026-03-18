import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, IndianRupee, BookOpen, Video, Plus } from 'lucide-react';
import { AdminLayout } from '@/components/shared';
import { Button, Avatar, PriceDisplay, BilingualLabel } from '@/components/ui';
import { MOCK_COURSES, MOCK_ENROLLMENTS, MOCK_STUDENTS } from '@/mockData';
function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MOCK_DAILY_REVENUE = [1299, 799, 499, 1598, 399, 999, 1799];

// Solid colour approximations for thumbnail gradient first stop
const THUMB_SOLID: Record<string, string> = {
  rose: '#fecdd3',
  amber: '#fde68a',
  terracotta: '#fecaca',
  marigold: '#fef08a',
  burgundy: '#fecdd3',
  saffron: '#fed7aa',
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => {
    const uniqueUsers = new Set(MOCK_ENROLLMENTS.map((e) => e.userId));
    const revenue = MOCK_ENROLLMENTS.reduce((s, e) => s + e.amountPaid, 0);
    const published = MOCK_COURSES.filter((c) => c.status === 'published').length;
    const videos = MOCK_COURSES.reduce((s, c) => s + c.totalVideos, 0);
    return { students: uniqueUsers.size, revenue, published, videos };
  }, []);

  const recentEnrollments = useMemo(() => {
    return [...MOCK_ENROLLMENTS]
      .sort((a, b) => b.enrolledAt.getTime() - a.enrolledAt.getTime())
      .slice(0, 5)
      .map((enr) => ({
        enr,
        student: MOCK_STUDENTS.find((s) => s.id === enr.userId),
        course: MOCK_COURSES.find((c) => c.id === enr.courseId),
      }))
      .filter((x): x is typeof x & { student: NonNullable<typeof x.student>; course: NonNullable<typeof x.course> } =>
        !!x.student && !!x.course
      );
  }, []);

  const maxRevenue = Math.max(...MOCK_DAILY_REVENUE);

  const STAT_CARDS = [
    { icon: <Users size={28} className="text-brand" />, value: stats.students, en: 'Total Students', hi: 'कुल छात्राएं' },
    { icon: <IndianRupee size={28} className="text-brand" />, value: `₹${stats.revenue.toLocaleString('en-IN')}`, en: 'Total Revenue', hi: 'कुल कमाई' },
    { icon: <BookOpen size={28} className="text-brand" />, value: stats.published, en: 'Published Courses', hi: 'प्रकाशित कोर्स' },
    { icon: <Video size={28} className="text-brand" />, value: stats.videos, en: 'Videos Uploaded', hi: 'अपलोड किए वीडियो' },
  ];

  return (
    <AdminLayout pageTitle="Dashboard">
      <div className="page-enter">

        {isLoading ? (
          <>
            {/* Stat card skeletons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border-t-4 border-warm-border shadow-card animate-pulse">
                  <div className="w-7 h-7 bg-muted rounded-lg mb-2" />
                  <div className="h-8 bg-muted rounded w-16 mb-2" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              ))}
            </div>
            {/* Table skeleton */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
              <div className="h-10 bg-muted" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-warm-border">
                  <div className="w-8 h-8 bg-muted rounded-full shrink-0" />
                  <div className="flex-1 h-4 bg-muted rounded" />
                  <div className="w-24 h-4 bg-muted rounded" />
                  <div className="w-16 h-4 bg-muted rounded" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((s) => (
            <div key={s.en} className="bg-white rounded-2xl p-5 border-t-4 border-brand shadow-card">
              {s.icon}
              <p className="text-navy text-3xl font-bold mt-2">{s.value}</p>
              <BilingualLabel english={s.en} hindi={s.hi} englishSize="sm" hindiSize="xs" gap="tight" className="mt-1" />
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex gap-4 flex-wrap mb-8">
          <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => navigate('/admin/courses')}>
            New Course — नया कोर्स
          </Button>
          <Button variant="outline" size="md" icon={<Users size={16} />} onClick={() => navigate('/admin/students')}>
            View Students — छात्राएं देखें
          </Button>
        </div>

        {/* Recent enrollments */}
        <div className="mb-8">
          <BilingualLabel english="Recent Enrollments" hindi="हाल की Enrollments" englishSize="xl" englishWeight="semibold" hindiSize="sm" gap="tight" className="mb-4" />

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  {['Student', 'Course', 'Amount', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-warm-text uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.map(({ enr, student, course }) => (
                  <tr key={enr.id} className="border-b border-warm-border hover:bg-muted transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} size="sm" />
                        <span className="text-navy text-sm font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: THUMB_SOLID[course.thumbnailColour] }} />
                        <span className="text-navy text-sm">{course.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><PriceDisplay price={enr.amountPaid} size="sm" /></td>
                    <td className="px-6 py-4 text-warm-text text-sm">{fmtDate(enr.enrolledAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {recentEnrollments.map(({ enr, student, course }) => (
              <div key={enr.id} className="bg-white rounded-xl shadow-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={student.name} size="sm" />
                    <span className="text-navy text-sm font-medium">{student.name}</span>
                  </div>
                  <PriceDisplay price={enr.amountPaid} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-warm-text text-sm">{course.title}</span>
                  <span className="text-warm-text text-xs">{fmtDate(enr.enrolledAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue mini chart */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <BilingualLabel english="Monthly Overview" hindi="मासिक अवलोकन" englishSize="xl" englishWeight="semibold" hindiSize="sm" gap="tight" className="mb-6" />
          <div className="overflow-x-auto">
            <div className="flex items-end gap-2 min-w-[280px]">
              {MOCK_DAILY_REVENUE.map((rev, i) => {
                const barH = Math.round((rev / maxRevenue) * 80);
                return (
                  <div
                    key={i}
                    className="group relative flex flex-col items-center flex-1"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === i && (
                      <div className="absolute bottom-full mb-1 bg-navy text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                        ₹{rev.toLocaleString('en-IN')}
                      </div>
                    )}
                    <div
                      className="w-full bg-brand rounded-t-md transition-all duration-200 hover:bg-brand/80"
                      style={{ height: `${barH}px`, minHeight: '4px' }}
                    />
                    <span className="text-warm-text text-xs mt-1">{DAYS[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </>
        )}

      </div>
    </AdminLayout>
  );
}
