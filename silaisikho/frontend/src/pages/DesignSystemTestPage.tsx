import { useState } from 'react';
import { BookOpen, Inbox, Star } from 'lucide-react';
import {
  Button, Badge, ProgressBar, PriceDisplay,
  BilingualLabel, Avatar, EmptyState, Spinner,
} from '@/components/ui';
import { Navbar, CourseCard, VideoPlayerModal } from '@/components/shared';
import { ThumbnailGradientMap } from '@/types';
import { MOCK_COURSES } from '@/mockData';

export default function DesignSystemTestPage() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="page-enter min-h-screen bg-surface space-y-12">
      {/* Navbar preview */}
      <Navbar currentPath="/design-system" />

      <div className="px-8 space-y-12">
      <h1 className="text-2xl font-bold text-navy">SilaiSikho — Design System</h1>

      {/* ── Button ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy">Button</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" size="sm">Primary SM</Button>
          <Button variant="primary" size="md">Primary MD</Button>
          <Button variant="primary" size="lg">Primary LG</Button>
          <Button variant="secondary" size="md">Secondary</Button>
          <Button variant="outline" size="md">Outline</Button>
          <Button variant="ghost" size="md">Ghost</Button>
          <Button variant="primary" size="md" loading>Loading</Button>
          <Button variant="primary" size="md" disabled>Disabled</Button>
          <Button variant="outline" size="md" icon={<Star size={16} />}>With Icon</Button>
          <Button variant="primary" size="md" icon={<Star size={16} />} iconPosition="right">Icon Right</Button>
          <Button variant="primary" size="md" fullWidth>Full Width</Button>
        </div>
      </section>

      {/* ── Badge ──────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy">Badge</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="level-beginner" label="Beginner" />
          <Badge variant="level-intermediate" label="Intermediate" />
          <Badge variant="level-advanced" label="Advanced" />
          <Badge variant="status-published" label="Published" />
          <Badge variant="status-draft" label="Draft" />
          <Badge variant="language-hindi" label="Hindi" />
          <Badge variant="language-english" label="English" />
          <Badge variant="language-mixed" label="Mixed" />
          <Badge variant="count" label="42 students" />
        </div>
      </section>

      {/* ── ProgressBar ────────────────────────────────────────── */}
      <section className="space-y-4 max-w-md">
        <h2 className="text-lg font-semibold text-navy">ProgressBar</h2>
        <ProgressBar percentage={0} showLabel labelPosition="right" />
        <ProgressBar percentage={35} showLabel labelPosition="right" />
        <ProgressBar percentage={65} showLabel labelPosition="top" />
        <ProgressBar percentage={100} showLabel labelPosition="right" />
        <ProgressBar percentage={50} size="sm" />
        <ProgressBar percentage={-10} showLabel />
        <ProgressBar percentage={150} showLabel />
      </section>

      {/* ── PriceDisplay ───────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy">PriceDisplay</h2>
        <PriceDisplay price={499} size="sm" />
        <PriceDisplay price={599} originalPrice={799} size="md" />
        <PriceDisplay price={999} originalPrice={1299} size="lg" />
        <PriceDisplay price={0} />
      </section>

      {/* ── BilingualLabel ─────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-navy">BilingualLabel</h2>
        <BilingualLabel english="Basic Blouse Stitching" hindi="ब्लाउज़ सिलाई" />
        <BilingualLabel english="Advanced Patterns" hindi="एडवांस पैटर्न" englishSize="xl" englishWeight="bold" gap="normal" />
        <BilingualLabel english="Short" hindi="छोटा" englishSize="sm" hindiSize="xs" gap="none" />
        <BilingualLabel
          english="A very long English title that might wrap onto multiple lines in a narrow container"
          hindi="एक बहुत लंबा हिंदी शीर्षक"
          englishSize="lg"
        />
      </section>

      {/* ── Avatar ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy">Avatar</h2>
        <div className="flex items-end gap-4">
          <Avatar name="Priya Sharma" size="xs" />
          <Avatar name="Sunita Yadav" size="sm" />
          <Avatar name="Kavita Gupta" size="md" />
          <Avatar name="Meena Patel" size="lg" />
          <Avatar name="Rekha" size="xl" />
          <Avatar name="Anita Verma" imageUrl="https://invalid-url.example.com/img.jpg" size="md" />
        </div>
      </section>

      {/* ── EmptyState ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-navy">EmptyState</h2>
        <EmptyState
          icon={<Inbox />}
          englishMessage="No courses found"
          hindiMessage="कोई कोर्स नहीं मिला"
        />
        <EmptyState
          icon={<BookOpen />}
          englishMessage="Start learning today"
          hindiMessage="आज से सीखना शुरू करें"
          action={{ label: 'Browse Courses', onClick: () => alert('Browse!') }}
        />
      </section>

      {/* ── Spinner ────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy">Spinner</h2>
        <div className="flex items-center gap-6">
          <Spinner size="sm" colour="brand" />
          <Spinner size="md" colour="navy" />
          <Spinner size="lg" colour="gold" />
          <div className="bg-navy p-3 rounded-lg">
            <Spinner size="md" colour="white" />
          </div>
        </div>
      </section>

      {/* ── ThumbnailGradientMap ────────────────────────────────── */}
      </div>{/* end px-8 wrapper */}

      <section className="space-y-3 px-8">
        <h2 className="text-lg font-semibold text-navy">ThumbnailGradientMap (safelist check)</h2>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(ThumbnailGradientMap) as [string, string][]).map(([key, cls]) => (
            <div
              key={key}
              className={`${cls} w-24 h-16 rounded-lg flex items-end p-2`}
            >
              <span className="text-xs font-medium text-navy/70">{key}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CourseCard ─────────────────────────────────────────── */}
      <section className="space-y-4 px-8">
        <h2 className="text-lg font-semibold text-navy">CourseCard — catalog variant</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_COURSES.slice(0, 3).map((c) => (
            <CourseCard key={c.id} course={c} variant="catalog" onClick={() => alert(c.title)} />
          ))}
        </div>
        <h2 className="text-lg font-semibold text-navy pt-4">CourseCard — dashboard variant</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_COURSES.slice(3).map((c, i) => (
            <CourseCard key={c.id} course={c} variant="dashboard" progressPercentage={[65, 20, 100][i]} onClick={() => alert(c.title)} />
          ))}
        </div>
      </section>

      {/* ── VideoPlayerModal ───────────────────────────────────── */}
      <section className="space-y-3 px-8 pb-16">
        <h2 className="text-lg font-semibold text-navy">VideoPlayerModal</h2>
        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          Open Video Modal
        </Button>
        <VideoPlayerModal
          isOpen={modalOpen}
          video={MOCK_COURSES[0].modules[0].videos[0]}
          course={MOCK_COURSES[0]}
          onClose={() => setModalOpen(false)}
          onEnrollClick={() => { setModalOpen(false); alert('Enroll clicked!'); }}
        />
      </section>
    </div>
  );
}
