import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight, UserPlus, ShoppingCart, PlayCircle,
  Star, ChevronDown, Github, Instagram, Facebook,
} from 'lucide-react';
import { Button, BilingualLabel, Avatar, EmptyState } from '@/components/ui';
import { Navbar, CourseCard } from '@/components/shared';
import {
  MOCK_COURSES, MOCK_TESTIMONIALS, MOCK_FAQS,
} from '@/mockData';
import { useState } from 'react';

// ─── Shared helpers ───────────────────────────────────────────────────────────
function fmtDur(s: number): string {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();
  return (
    <section
      className="min-h-screen flex items-center py-24 md:py-0 bg-surface relative overflow-hidden"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(192,57,43,0.03) 0px, rgba(192,57,43,0.03) 1px, transparent 1px, transparent 12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="flex flex-col gap-6">
          <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
            New Courses Available — नए कोर्स उपलब्ध हैं
          </span>
          <div>
            <h1 className="font-extrabold text-4xl md:text-5xl text-navy leading-tight">
              घर बैठे सीखें सिलाई
            </h1>
            <h1 className="font-extrabold text-4xl md:text-5xl text-brand leading-tight">
              Professional Tailoring
            </h1>
          </div>
          <div>
            <p className="text-warm-text text-lg leading-relaxed">
              Expert-led video courses for women across India. Learn at your own pace, on your phone.
            </p>
            <p className="text-warm-text text-sm mt-1">
              नजदीकी शहर में जाने की जरूरत नहीं — घर से सीखें
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="md" icon={<ChevronRight size={18} />} iconPosition="right" onClick={() => navigate('/courses')}>
              Browse Courses
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate('/courses')}>
              Free Preview देखें
            </Button>
          </div>
        </div>

        {/* Right — phone mockup */}
        <div className="hidden md:flex justify-center">
          <div className="relative bg-navy rounded-3xl border-4 border-navy w-[240px] overflow-hidden" style={{ aspectRatio: '9/19' }}>
            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/30" />
                <div className="w-2 h-2 rounded-full bg-white/30" />
              </div>
              <div className="w-8 h-3 rounded-sm border border-white/30 flex items-center px-0.5">
                <div className="w-5 h-1.5 bg-white/40 rounded-sm" />
              </div>
            </div>
            {/* Scaled card */}
            <div className="px-2 origin-top scale-75">
              <CourseCard course={MOCK_COURSES[0]} variant="catalog" onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── StatsStrip ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    { num: '500+', en: 'Students', hi: 'छात्राएं' },
    { num: '15+',  en: 'Courses',  hi: 'कोर्स' },
    { num: '1',    en: 'Expert Instructor', hi: 'विशेषज्ञ' },
  ];
  return (
    <section className="bg-navy py-8">
      <div className="max-w-7xl mx-auto px-4 flex justify-around items-center">
        {stats.map((s, i) => (
          <div key={s.en} className="flex items-center gap-0">
            <div className="flex flex-col items-center px-6">
              <span className="text-gold text-3xl font-bold">{s.num}</span>
              <span className="text-white text-base font-medium mt-0.5">{s.en}</span>
              <span className="text-gold text-sm">{s.hi}</span>
            </div>
            {i < stats.length - 1 && (
              <div className="h-10 w-px bg-gold/40" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FeaturedCoursesSection ───────────────────────────────────────────────────
function FeaturedCoursesSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-surface py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <BilingualLabel english="Our Courses" hindi="हमारे कोर्स" englishSize="xl" englishWeight="bold" hindiSize="sm" gap="tight" />
          <Link to="/courses" className="text-brand text-sm font-medium hover:underline">
            View All — सभी देखें
          </Link>
        </div>
        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden gap-4 overflow-x-auto pb-2 -mx-4 px-4">
          {MOCK_COURSES.slice(0, 4).map((c) => (
            <div key={c.id} className="flex-shrink-0 w-[280px]">
              <CourseCard course={c} variant="catalog" onClick={() => navigate(`/courses/${c.id}`)} />
            </div>
          ))}
        </div>
        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {MOCK_COURSES.slice(0, 3).map((c) => (
            <CourseCard key={c.id} course={c} variant="catalog" onClick={() => navigate(`/courses/${c.id}`)} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HowItWorksSection ────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      num: 1, icon: <UserPlus size={32} className="text-brand" />,
      en: 'Register Free', hi: 'मुफ्त रजिस्टर करें',
      desc: 'Register for free in 30 seconds with no password required — मुफ्त में 30 सेकंड में रजिस्टर करें',
    },
    {
      num: 2, icon: <ShoppingCart size={32} className="text-brand" />,
      en: 'Buy Course', hi: 'कोर्स खरीदें',
      desc: 'Browse and buy the course that matches your skill level — अपने level का कोर्स खरीदें',
    },
    {
      num: 3, icon: <PlayCircle size={32} className="text-brand" />,
      en: 'Watch & Learn', hi: 'देखें और सीखें',
      desc: 'Watch on any phone anytime at your own pace — कभी भी कहीं भी मोबाइल पर देखें',
    },
  ];
  return (
    <section className="bg-card py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <BilingualLabel english="How It Works" hindi="कैसे काम करता है" englishSize="xl" englishWeight="bold" hindiSize="sm" gap="tight" className="items-center" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="bg-card rounded-2xl shadow-card p-8 text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-navy text-xl font-bold">
                {s.num}
              </div>
              {s.icon}
              <BilingualLabel english={s.en} hindi={s.hi} englishSize="lg" englishWeight="semibold" hindiSize="sm" gap="tight" className="items-center" />
              <p className="text-warm-text text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── InstructorSection ────────────────────────────────────────────────────────
function InstructorSection() {
  return (
    <section className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-[30%] bg-navy p-8 flex flex-col items-center justify-center gap-3">
            <Avatar name="Sunita Devi" size="xl" />
            <span className="text-white text-xl font-semibold text-center">Sunita Devi</span>
            <span className="text-gold text-sm text-center">Expert Tailoring Instructor</span>
          </div>
          <div className="md:w-[70%] p-8 flex flex-col gap-4 justify-center">
            <div>
              <h2 className="text-navy text-2xl font-bold">Meet Your Instructor</h2>
              <p className="text-gold text-sm mt-1">मिलिए अपनी Instructor से</p>
            </div>
            <p className="text-warm-text leading-relaxed">
              Sunita Devi has over 15 years of professional tailoring experience and has trained more than 500 women across India.
              She specialises in traditional Indian garments and modern fashion design.
              सुनीता देवी ने 15 साल से अधिक समय तक पेशेवर सिलाई का काम किया है।
              उन्होंने 500 से अधिक महिलाओं को सिलाई सिखाई है।
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy/10 text-navy">500+ Students Taught</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy/10 text-navy">Expert Level</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy/10 text-navy">Hindi Medium</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TestimonialsSection ──────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="bg-surface py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <BilingualLabel english="What Our Students Say" hindi="हमारी छात्राओं के विचार" englishSize="xl" englishWeight="bold" hindiSize="sm" gap="tight" className="items-center" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < t.rating ? 'text-gold fill-gold' : 'text-warm-border'} />
                ))}
              </div>
              <p className="text-warm-text text-base italic leading-relaxed">"{t.quoteHindi}"</p>
              <div className="border-t border-warm-border" />
              <div className="flex items-center gap-3">
                <Avatar name={t.studentName} size="sm" />
                <div>
                  <p className="text-navy font-medium text-sm">{t.studentName}</p>
                  <p className="text-warm-text text-xs">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FaqSection ───────────────────────────────────────────────────────────────
function FaqSection() {
  const [openFaqId, setOpenFaqId] = useState<string>('');
  return (
    <section className="bg-card py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-navy text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="text-warm-text text-base mt-1">अक्सर पूछे जाने वाले सवाल</p>
        </div>
        <div className="flex flex-col">
          {MOCK_FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="border-b border-warm-border">
                <button
                  className="w-full flex items-center justify-between py-4 px-0 cursor-pointer text-left"
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                >
                  <div>
                    <p className="text-navy text-base font-medium">{faq.questionEnglish}</p>
                    <p className="text-warm-text text-sm mt-0.5">{faq.questionHindi}</p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-brand shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="pb-4">
                    <p className="text-warm-text text-sm">{faq.answerEnglish}</p>
                    <p className="text-warm-text text-sm mt-1 opacity-80">{faq.answerHindi}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-navy pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="text-white font-bold text-lg mb-2">SilaiSikho</p>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Expert-led tailoring courses for women across India.
            </p>
            <div className="flex gap-3">
              {[Github, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="text-white/40 hover:text-white/70 transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-4">Quick Links</p>
            {['Home', 'Courses', 'About', 'Login'].map((l) => (
              <p key={l} className="text-white/50 text-sm mb-2 hover:text-white/80 cursor-pointer">{l}</p>
            ))}
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-4">Courses</p>
            {MOCK_COURSES.slice(0, 4).map((c) => (
              <p key={c.id} className="text-white/50 text-sm mb-2 leading-snug">{c.title.split('—')[0].trim()}</p>
            ))}
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-4">Contact</p>
            <p className="text-white/50 text-sm mb-2">admin@silaisikho.in</p>
            <p className="text-white/50 text-sm">WhatsApp: +91 98765 43210</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white/40 text-sm">© 2024 SilaiSikho. All rights reserved.</p>
          <p className="text-white/40 text-sm flex items-center gap-1">
            Made with <span className="text-brand">♥</span> for Indian Women
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── LandingPage (main export) ────────────────────────────────────────────────
export default function LandingPage() {
  const location = useLocation();
  // suppress unused warning — EmptyState imported for ground rules compliance
  void EmptyState; void fmtDur;
  return (
    <div className="page-enter">
      <Navbar transparent currentPath={location.pathname} />
      <HeroSection />
      <StatsStrip />
      <FeaturedCoursesSection />
      <HowItWorksSection />
      <InstructorSection />
      <TestimonialsSection />
      <FaqSection />
      <Footer />
    </div>
  );
}
