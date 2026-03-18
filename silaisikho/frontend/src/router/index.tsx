import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';

import LandingPage from '@/pages/LandingPage';
import DesignSystemTestPage from '@/pages/DesignSystemTestPage';
import CourseCatalogPage from '@/pages/CourseCatalogPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import LoginPage from '@/pages/LoginPage';
import StudentDashboardPage from '@/pages/StudentDashboardPage';
import WatchVideoPage from '@/pages/WatchVideoPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminCoursesPage from '@/pages/AdminCoursesPage';
import AdminCourseEditorPage from '@/pages/AdminCourseEditorPage';
import AdminStudentsPage from '@/pages/AdminStudentsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProfilePage from '@/pages/ProfilePage';

// ─── Guards ───────────────────────────────────────────────────────────────────
function PrivateRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

function AdminRoute() {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
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
      { path: '/profile', element: <ProfilePage /> },

      {
        element: <PrivateRoute />,
        children: [
          { path: '/dashboard', element: <StudentDashboardPage /> },
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
