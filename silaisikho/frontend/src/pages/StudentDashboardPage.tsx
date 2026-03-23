import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BookOpen, Pencil } from 'lucide-react';
import { EmptyState, BilingualLabel } from '@/components/ui';
import { Navbar } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [activeTab] = useState<'courses'>('courses');

  const firstName = currentUser?.name?.split(' ')[0] || currentUser?.name || 'Friend';

  return (
    <div className="page-enter min-h-screen bg-surface pb-12">
      <Navbar transparent={false} currentPath={location.pathname} />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Greeting Card */}
        <div className="bg-card rounded-2xl shadow-card p-6 mb-8 relative">
          <Link
            to="/profile"
            className="absolute top-4 right-4 flex items-center gap-1.5 text-warm-text text-sm hover:text-brand transition-colors"
          >
            <Pencil size={14} />
            Edit Profile
          </Link>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-navy text-2xl font-bold mb-1">
                नमस्ते, {firstName} 🙏
              </h1>
              <p className="text-warm-text text-sm">
                {currentUser?.email || currentUser?.mobileNumber || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-r from-brand to-brand/80 rounded-2xl p-6 mb-8 text-white">
          <p className="text-lg font-semibold mb-2">Keep Learning, Keep Growing!</p>
          <p className="text-white/90 text-sm">
            सीखते रहें, बढ़ते रहें — Every stitch brings you closer to your dreams
          </p>
        </div>

        {/* TODO: wire to enrollment API in Integration Step 4 */}
        {/* Enrolled Courses Section */}
        {activeTab === 'courses' && (
          <div>
            <h2 className="text-navy text-xl font-semibold mb-4">
              <BilingualLabel
                english="My Courses"
                hindi="मेरे कोर्स"
                englishSize="xl"
                englishWeight="bold"
                hindiSize="sm"
                gap="tight"
              />
            </h2>
            <EmptyState
              icon={<BookOpen />}
              englishMessage="Your enrolled courses will appear here"
              hindiMessage="आपके enrolled कोर्स यहाँ दिखेंगे"
              action={{
                label: 'Browse Courses',
                onClick: () => navigate('/courses'),
              }}
            />
          </div>
        )}

        {/* TODO: wire to enrollment API in Integration Step 4 */}
        {/* Continue Watching Section - will be restored in Step 4 */}

        {/* TODO: wire to enrollment API in Integration Step 4 */}
        {/* Purchase History Section - will be restored in Step 4 */}
      </div>
    </div>
  );
}
