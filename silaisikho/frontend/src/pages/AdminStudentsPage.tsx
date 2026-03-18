import { useState, useMemo, useCallback, useEffect } from 'react';
import { Users, BookOpen, IndianRupee, Search, Download, Eye, Mail } from 'lucide-react';
import { clsx } from 'clsx';
import { AdminLayout, useToast } from '@/components/shared';
import { Button, Badge, Avatar, BilingualLabel, ProgressBar, PriceDisplay, EmptyState } from '@/components/ui';
import { MOCK_STUDENTS, MOCK_ENROLLMENTS } from '@/mockData';
import { ThumbnailGradientMap } from '@/types';
import type { IUser, IEnrollment } from '@/types';

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Enrolled courses detail ──────────────────────────────────────────────────
function EnrolledCoursesDetail({ enrollments }: { enrollments: IEnrollment[] }) {
  if (enrollments.length === 0) {
    return <p className="text-warm-text text-sm">No enrollments — कोई enrollment नहीं</p>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {enrollments.map((enr) => (
        <div key={enr.id} className="bg-white rounded-xl p-3 border border-warm-border">
          <div className="flex items-start gap-2 mb-2">
            <div className={clsx('w-8 h-8 rounded-full shrink-0', ThumbnailGradientMap[enr.courseThumbnailColour])} />
            <div className="min-w-0">
              <p className="text-navy text-sm font-medium line-clamp-2">{enr.courseName}</p>
              <p className="text-warm-text text-xs">{fmtDate(enr.enrolledAt)}</p>
            </div>
          </div>
          <ProgressBar percentage={enr.progressPercentage} showLabel size="sm" />
          <PriceDisplay price={enr.amountPaid} size="sm" className="mt-1" />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminStudentsPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [enrollmentFilter, setEnrollmentFilter] = useState<string>('all');
  const [expandedStudentId, setExpandedStudentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const enrolledUserIds = useMemo(() => new Set(MOCK_ENROLLMENTS.map((e) => e.userId)), []);

  const studentEnrollments = useCallback((userId: string): IEnrollment[] =>
    MOCK_ENROLLMENTS.filter((e) => e.userId === userId), []);

  const studentTotalPaid = useCallback((userId: string): number =>
    studentEnrollments(userId).reduce((s, e) => s + e.amountPaid, 0), [studentEnrollments]);

  const filteredStudents = useMemo<IUser[]>(() => {
    return MOCK_STUDENTS.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const isEnrolled = enrolledUserIds.has(s.id);
      const matchFilter =
        enrollmentFilter === 'all' ||
        (enrollmentFilter === 'enrolled' && isEnrolled) ||
        (enrollmentFilter === 'not-enrolled' && !isEnrolled);
      return matchSearch && matchFilter;
    });
  }, [searchQuery, enrollmentFilter, enrolledUserIds]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedStudentId((prev) => prev === id ? '' : id);
  }, []);

  const handleSendEmail = useCallback((e: React.MouseEvent, student: IUser) => {
    e.stopPropagation();
    showToast(`Email sent — ईमेल भेजा गया to ${student.name}`);
  }, [showToast]);

  const handleExportCSV = useCallback(() => {
    const headers = ['Name', 'Email', 'Courses Enrolled', 'Total Paid', 'Joined'];
    const rows = MOCK_STUDENTS.map((s) => [
      s.name,
      s.email,
      studentEnrollments(s.id).length.toString(),
      `₹${studentTotalPaid(s.id)}`,
      fmtDate(s.createdAt),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'silaisikho-students.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [studentEnrollments, studentTotalPaid]);

  const totalRevenue = useMemo(() => MOCK_ENROLLMENTS.reduce((s, e) => s + e.amountPaid, 0), []);

  const STAT_CARDS = [
    { icon: <Users size={20} className="text-brand" />, value: MOCK_STUDENTS.length, en: 'Total Students', hi: 'कुल छात्राएं' },
    { icon: <BookOpen size={20} className="text-gold" />, value: MOCK_ENROLLMENTS.length, en: 'Total Enrollments', hi: 'कुल Enrollments' },
    { icon: <IndianRupee size={20} className="text-green-600" />, value: `₹${totalRevenue.toLocaleString('en-IN')}`, en: 'Total Revenue', hi: 'कुल कमाई' },
  ];

  const inputCls = 'border border-warm-border rounded-full px-4 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors';

  return (
    <AdminLayout
      pageTitle="Students — छात्राएं"
      actionButton={
        <Button variant="ghost" size="md" icon={<Download size={16} />} onClick={handleExportCSV}>
          Export CSV — CSV Export
        </Button>
      }
    >
      <div className="page-enter">

        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {/* Stat skeletons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-card">
                  <div className="w-8 h-8 bg-muted rounded-lg shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-5 bg-muted rounded w-12" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
            {/* Row skeletons */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
                <div className="w-9 h-9 bg-muted rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-muted rounded w-36" />
                  <div className="h-3 bg-muted rounded w-48" />
                </div>
                <div className="w-12 h-6 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {STAT_CARDS.map((s) => (
            <div key={s.en} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-card">
              {s.icon}
              <div>
                <p className="text-navy text-xl font-bold">{s.value}</p>
                <BilingualLabel english={s.en} hindi={s.hi} englishSize="sm" hindiSize="xs" gap="tight" />
              </div>
            </div>
          ))}
        </div>

        {/* Search & filter */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-text pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email…"
              className={clsx(inputCls, 'pl-10 w-full')}
            />
          </div>
          <select value={enrollmentFilter} onChange={(e) => setEnrollmentFilter(e.target.value)} className={inputCls}>
            <option value="all">All Students</option>
            <option value="enrolled">Enrolled</option>
            <option value="not-enrolled">Not Enrolled</option>
          </select>
        </div>

        {/* Empty state */}
        {filteredStudents.length === 0 && (
          <EmptyState
            icon={<Users />}
            englishMessage="No students found"
            hindiMessage="कोई छात्र नहीं मिली"
            action={{ label: 'Clear Search', onClick: () => { setSearchQuery(''); setEnrollmentFilter('all'); } }}
          />
        )}

        {/* Desktop table */}
        {filteredStudents.length > 0 && (
          <div className="hidden md:block bg-white rounded-2xl shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  {['Student', 'Courses', 'Total Paid', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-warm-text uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const enrs = studentEnrollments(student.id);
                  const isExpanded = expandedStudentId === student.id;
                  return (
                    <>
                      <tr
                        key={student.id}
                        className="border-b border-warm-border hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => toggleExpanded(student.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={student.name} size="sm" />
                            <div>
                              <p className="text-navy text-sm font-medium">{student.name}</p>
                              <p className="text-warm-text text-xs">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="count" label={enrs.length.toString()} />
                        </td>
                        <td className="px-6 py-4">
                          <PriceDisplay price={studentTotalPaid(student.id)} size="sm" />
                        </td>
                        <td className="px-6 py-4 text-warm-text text-sm">{fmtDate(student.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={(e) => { e.stopPropagation(); toggleExpanded(student.id); }}
                              className="p-1.5 text-warm-text hover:text-brand transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center">
                              <Eye size={16} />
                            </button>
                            <button type="button" onClick={(e) => handleSendEmail(e, student)}
                              className="p-1.5 text-warm-text hover:text-brand transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center">
                              <Mail size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${student.id}-expanded`}>
                          <td colSpan={5} className="px-0 py-0 border-b border-warm-border">
                            <div className="bg-surface rounded-xl mx-4 my-2 p-4">
                              <p className="text-navy text-sm font-semibold mb-3">Enrolled Courses — enrolled कोर्स</p>
                              <EnrolledCoursesDetail enrollments={enrs} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile card list */}
        {filteredStudents.length > 0 && (
          <div className="md:hidden flex flex-col gap-3">
            {filteredStudents.map((student) => {
              const enrs = studentEnrollments(student.id);
              const isExpanded = expandedStudentId === student.id;
              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl shadow-card p-4 cursor-pointer"
                  onClick={() => toggleExpanded(student.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={student.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-navy text-sm font-medium truncate">{student.name}</p>
                        <p className="text-warm-text text-xs truncate">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <Badge variant="count" label={enrs.length.toString()} />
                      <PriceDisplay price={studentTotalPaid(student.id)} size="sm" />
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-warm-border pt-3 mt-3">
                      <p className="text-navy text-sm font-semibold mb-3">Enrolled Courses — enrolled कोर्स</p>
                      <EnrolledCoursesDetail enrollments={enrs} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
          </>
        )}
      </div>

    </AdminLayout>
  );
}
