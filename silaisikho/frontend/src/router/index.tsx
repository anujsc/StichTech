import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Spinner } from '@/components/ui';

import LandingPage from '@/pages/LandingPage';
import DesignSystemTestPage from '@/pages/DesignSystemTestPage';
import CourseCatalogPage from '@/pages/CourseCatalogPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import StudentDashboardPage from '@/pages/StudentDashboardPage';
import WatchVideoPage from '@/pages/WatchVideoPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminCoursesPage from '@/pages/AdminCoursesPage';
import AdminCourseEditorPage from '@/pages/AdminCourseEditorPage';
import AdminStudentsPage from '@/pages/AdminStudentsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProfilePage from '@/pages/ProfilePage';
import ChangePinPage from '@/pages/ChangePinPage';

// ─── Guards ───────────────────────────────────────────────────────────────────
function PrivateRoute() {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // Wait for auth state to be resolved before making routing decision
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Spinner size="lg" colour="brand" />
      </div>
    );
  }

  // Not authenticated - redirect to login with return path
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  // Authenticated - render protected content
  return <Outlet />;
}

function AdminRoute() {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Wait for auth state to be resolved
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Spinner size="lg" colour="brand" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  // Authenticated but not admin - redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated as admin - render admin content
  return <Outlet />;
}

// ─── Root layout — scroll-to-top lives here ───────────────────────────────────
function RootLayout() {
  useScrollToTop();
  return <Outlet />;
}

// ─── Router ───────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: '/design-system', element: <DesignSystemTestPage /> },
      { path: '/courses', element: <CourseCatalogPage /> },
      { path: '/courses/:courseId', element: <CourseDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },

      {
        element: <PrivateRoute />,
        children: [
          { path: '/dashboard', element: <StudentDashboardPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/change-pin', element: <ChangePinPage /> },
          { path: '/watch/:courseId/:videoId', element: <WatchVideoPage /> },
        ],
      },

      {
        element: <AdminRoute />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/courses', element: <AdminCoursesPage /> },
          { path: '/admin/courses/:courseId/edit', element: <AdminCourseEditorPage /> },
          { path: '/admin/students', element: <AdminStudentsPage /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
