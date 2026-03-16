import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Play, Lock, CheckCircle,
  Video, Smartphone, Repeat, Award, FileX, Folder, Check,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button, Badge, PriceDisplay, Avatar, EmptyState, BilingualLabel } from '@/components/ui';
import { Navbar, VideoPlayerModal } from '@/components/shared';
import { MOCK_COURSES } from '@/mockData';
import { ThumbnailGradientMap } from '@/types';
import type { IVideo, CourseLevel } from '@/types';

function fmtDur(s: number): string {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function fmtVidDur(s: number): string {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

const levelVariant: Record<CourseLevel, 'level-beginner' | 'level-intermediate' | 'level-advanced'> = {
  beginner: 'level-beginner', intermediate: 'level-intermediate', advanced: 'level-advanced',
};

const CONFETTI_COLOURS = ['#C0392B', '#C9A84C', '#F59E0B', '#FB923C', '#1A1A2E'];

const LEARNING_POINTS = [
  { en: 'Take accurate body measurements', hi: 'सही शरीर की नाप लेना' },
  { en: 'Draft and cut fabric patterns', hi: 'पैटर्न बनाना और कपड़ा काटना' },
  { en: 'Stitch seams with professional finish', hi: 'प्रोफेशनल सिलाई करना' },
  { en: 'Attach sleeves and necklines', hi: 'बाजू और गला लगाना' },
  { en: 'Add embellishments and embroidery', hi: 'सजावट और कढ़ाई करना' },
  { en: 'Press and finish garments perfectly', hi: 'कपड़े की फाइनल फिनिशिंग' },
];

const LOCAL_REVIEWS = [
  { name: 'Priya Sharma', city: 'Indore', rating: 5, comment: 'Excellent course! Very detailed and easy to follow.' },
  { name: 'Kavita Gupta', city: 'Agra', rating: 5, comment: 'Sunita Didi explains everything so clearly. Highly recommend!' },
  { name: 'Meena Patel', city: 'Surat', rating: 4, comment: 'Great value for money. Learned a lot in just a few days.' },
];

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const course = MOCK_COURSES.find((c) => c.id === courseId);

  const [openModuleId, setOpenModuleId] = useState<string>(course?.modules[0]?.id ?? '');
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState<boolean>(false);
  const [buyLoading, setBuyLoading] = useState<boolean>(false);

  const handleBuy = useCallback(() => {
    setBuyLoading(true);
    setTimeout(() => {
      setBuyLoading(false);
      setShowPurchaseSuccess(true);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!showPurchaseSuccess) return;
    const t = setTimeout(() => {
      setIsEnrolled(true);
      setShowPurchaseSuccess(false);
    }, 2500);
    return () => clearTimeout(t);
  }, [showPurchaseSuccess]);

  const openFreePreview = useCallback(() => {
    if (!course) return;
    for (const mod of course.modules) {
      const v = mod.videos.find((v) => v.isFreePreview);
      if (v) { setSelectedVideo(v); setShowModal(true); return; }
    }
  }, [course]);

  if (!course) {
    return (
      <div className="page-enter min-h-screen bg-surface flex items-center justify-center">
        <EmptyState
          icon={<FileX />}
          englishMessage="Course not found"
          hindiMessage="यह कोर्स उपलब्ध नहीं है"
          action={{ label: 'Back to Courses', onClick: () => navigate('/courses') }}
        />
      </div>
    );
  }

  const gradientClass = ThumbnailGradientMap[course.thumbnailColour];
  const displayPrice = course.discountedPrice ?? course.price;

  return (
    <div className="page-enter min-h-screen bg-surface pb-20 lg:pb-0">
      <Navbar transparent={false} currentPath={location.pathname} />

      {/* Header banner */}
      <div className={clsx('relative min-h-[200px] md:min-h-[280px] flex items-end', gradientClass)}>
        <div className="w-full pb-8 px-4 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-white/70 text-sm mb-3 flex-wrap">
            <span>Home</span><ChevronRight size={14} /><span>Courses</span><ChevronRight size={14} />
            <span className="text-white/90">{course.title}</span>
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-bold line-clamp-2 mb-3">{course.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant={`language-${course.language.toLowerCase()}` as 'language-hindi'} label={course.language} />
            <Badge variant={levelVariant[course.level]} label={course.level.charAt(0).toUpperCase() + course.level.slice(1)} />
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{course.totalModules} modules</span>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{fmtDur(course.totalDurationSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* LEFT */}
          <div>
            {/* What you'll learn */}
            <div className="bg-muted rounded-2xl p-6 mb-8">
              <BilingualLabel english="What You Will Learn" hindi="आप क्या सीखेंगी" englishSize="xl" englishWeight="semibold" hindiSize="sm" gap="tight" className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LEARNING_POINTS.map((lp) => (
                  <div key={lp.en} className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-navy text-sm">{lp.en}</p>
                      <p className="text-warm-text text-xs">{lp.hi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-navy text-xl font-semibold">Curriculum</h2>
                <span className="text-warm-text text-sm">{course.totalModules} modules · {course.totalVideos} videos · {fmtDur(course.totalDurationSeconds)}</span>
              </div>
              {course.modules.map((mod) => {
                const isOpen = openModuleId === mod.id;
                return (
                  <div key={mod.id} className="border border-warm-border rounded-xl mb-3 overflow-hidden">
                    <button
                      className={clsx('w-full flex items-center justify-between p-4 cursor-pointer transition-colors', isOpen ? 'bg-card' : 'bg-muted hover:bg-warm-border/30')}
                      onClick={() => setOpenModuleId(isOpen ? '' : mod.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Folder size={18} className="text-brand" />
                        <span className="text-navy font-medium text-sm text-left">{mod.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-navy/10 text-navy">{mod.videos.length}</span>
                        <ChevronDown size={16} className={clsx('text-brand transition-transform duration-200', isOpen && 'rotate-180')} />
                      </div>
                    </button>
                    <div className={clsx('overflow-hidden transition-all duration-300', isOpen ? 'max-h-[600px]' : 'max-h-0')}>
                      {mod.videos.map((v) => (
                        <div
                          key={v.id}
                          className={clsx('flex items-center justify-between px-4 py-3 border-t border-warm-border', v.isFreePreview && 'cursor-pointer hover:bg-muted')}
                          onClick={() => { if (v.isFreePreview) { setSelectedVideo(v); setShowModal(true); } }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {v.isFreePreview
                              ? <Play size={16} className="text-brand shrink-0" />
                              : <Lock size={16} className="text-warm-text shrink-0" />}
                            <span className="text-navy text-sm truncate">{v.title}</span>
                            {v.isFreePreview && <span className="text-brand text-xs shrink-0">Free</span>}
                          </div>
                          <span className="text-warm-text text-xs shrink-0 ml-2">{fmtVidDur(v.durationSeconds)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Instructor */}
            <div className="bg-card rounded-2xl shadow-card p-6 mb-8">
              <h2 className="text-navy text-xl font-semibold mb-4">Instructor</h2>
              <div className="flex items-start gap-4">
                <Avatar name={course.instructorName} size="md" />
                <div>
                  <p className="text-navy font-semibold">{course.instructorName}</p>
                  <p className="text-warm-text text-sm mt-1">{course.instructorBio ?? 'Expert tailoring instructor with years of experience.'}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="text-navy text-xl font-semibold mb-4">Student Reviews</h2>
              <div className="flex flex-col gap-4">
                {LOCAL_REVIEWS.map((r) => (
                  <div key={r.name} className="bg-card rounded-xl p-4 shadow-card">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar name={r.name} size="sm" />
                      <div>
                        <p className="text-navy font-medium text-sm">{r.name}</p>
                        <p className="text-warm-text text-xs">{r.city}</p>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < r.rating ? 'text-gold' : 'text-warm-border'}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-warm-text text-sm">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — sticky purchase card */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-card rounded-2xl shadow-card p-6">
              <PriceDisplay price={displayPrice} originalPrice={course.discountedPrice !== undefined ? course.price : undefined} size="lg" className="mb-4" />
              {!isEnrolled ? (
                <>
                  <Button variant="primary" size="lg" fullWidth loading={buyLoading} onClick={handleBuy} className="mb-3">
                    अभी खरीदें — Buy Now
                  </Button>
                  <Button variant="ghost" size="md" fullWidth onClick={openFreePreview}>
                    Watch Free Preview — फ्री Preview देखें
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="lg" fullWidth onClick={() => navigate(`/watch/${course.id}/${course.modules[0].videos[0].id}`)}>
                  Continue Watching — जारी रखें
                </Button>
              )}
              <div className="border-t border-warm-border mt-4 pt-4 flex flex-col gap-2">
                {[
                  { icon: <Video size={16} />, text: `${fmtDur(course.totalDurationSeconds)} of video` },
                  { icon: <Smartphone size={16} />, text: 'Watch on mobile' },
                  { icon: <Repeat size={16} />, text: 'Lifetime access' },
                  { icon: <Award size={16} />, text: 'Certificate of completion' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-warm-text text-sm">
                    {item.icon}<span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-warm-border px-4 py-3 flex items-center justify-between z-50">
        <PriceDisplay price={displayPrice} originalPrice={course.discountedPrice !== undefined ? course.price : undefined} size="md" />
        {!isEnrolled
          ? <Button variant="primary" size="md" loading={buyLoading} onClick={handleBuy}>अभी खरीदें</Button>
          : <Button variant="primary" size="md" onClick={() => navigate(`/watch/${course.id}/${course.modules[0].videos[0].id}`)}>जारी रखें</Button>
        }
      </div>

      {/* Purchase success overlay */}
      {showPurchaseSuccess && (
        <div className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
                animation: `fallDown ${1.5 + Math.random() * 1.5}s linear ${Math.random()}s forwards`,
              }}
            />
          ))}
          <div className="flex flex-col items-center text-center z-10">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center animate-[scaleIn_400ms_ease-out_forwards]">
              <Check size={48} className="text-white" />
            </div>
            <h2 className="text-navy text-2xl font-bold mt-6">Enrolled Successfully</h2>
            <p className="text-gold text-lg mt-1">आप enroll हो गए</p>
            <p className="text-warm-text text-base mt-2">{course.title}</p>
          </div>
        </div>
      )}

      {/* Video modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          course={course}
          isOpen={showModal}
          onClose={() => { setShowModal(false); setSelectedVideo(null); }}
          onEnrollClick={() => { setShowModal(false); setSelectedVideo(null); handleBuy(); }}
        />
      )}

      {/* fallDown keyframe injected via style tag */}
      <style>{`
        @keyframes fallDown {
          from { transform: translateY(-100px); opacity: 1; }
          to   { transform: translateY(100vh);  opacity: 0; }
        }
      `}</style>
    </div>
  );
}
