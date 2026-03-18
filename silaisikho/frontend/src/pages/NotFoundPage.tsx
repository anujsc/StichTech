import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center flex-col text-center px-4">
      <p className="text-gold text-8xl font-bold opacity-50">404</p>
      <h1 className="text-navy text-2xl font-semibold mt-4">Page Not Found — यह पेज नहीं मिला</h1>
      <p className="text-warm-text text-base mt-2">The page you are looking for does not exist or has been moved.</p>
      <p className="text-warm-text text-sm">आप जो पेज ढूंढ रही हैं वह मौजूद नहीं है</p>
      <div className="mt-8 flex gap-4 justify-center flex-wrap">
        <Button variant="primary" size="md" onClick={() => navigate('/')}>Go Home — होम जाएं</Button>
        <Button variant="outline" size="md" onClick={() => navigate('/courses')}>Browse Courses — कोर्स देखें</Button>
      </div>
    </div>
  );
}
