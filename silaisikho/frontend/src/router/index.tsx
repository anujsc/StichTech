import { lazy } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { ErrorBoundary, RouteGuard, RouteSuspense } from '@/components/shared';

// ─── Eager-loaded pages (critical for initial render) ────────────────────────
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';

// ─── Lazy-loaded pages (code-splitting for better performance) ───────────────
const CourseCatalogPage = lazy(() => import('@/pages/CourseCatalogPage'));
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'));
const StudentDashboardPage = lazy(() => import('@/pages/StudentDashboardPage'));
const WatchVideoPage = lazy(() => import('@/pages/WatchVideoPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ChangePinPage = lazy(() => import('@/pages/ChangePinPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const AdminCoursesPage = lazy(() => import('@/pages/AdminCoursesPage'));
const AdminCourseEditorPage = lazy(() => import('@/pages/AdminCourseEditorPage'));
const AdminStudentsPage = lazy(() => import('@/pages/AdminStudentsPage'));
const DesignSystemTestPage = lazy(() => import('@/pages/DesignSystemTestPage'));

// ─── Root layout with scroll-to-top ───────────────────────────────────────────
function RootLayout() {
  useScrollToTop();
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
}

// ─── Protected route wrapper ──────────────────────────────────────────────────
function ProtectedRoute() {
  return (
    <RouteGuard requireAuth>
      <RouteSuspense>
        <Outlet />
      </RouteSuspense>
    </RouteGuard>
  );
}

// ─── Admin route wrapper ──────────────────────────────────────────────────────
function AdminRoute() {
  return (
    <RouteGuard requireAuth requireAdmin>
      <RouteSuspense>
        <Outlet />
      </RouteSuspense>
    </RouteGuard>
  );
}

// ─── Router configuration ─────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes (no lazy loading for critical pages)
      { 
        index: true, 
        element: <LandingPage />,
      },
      { 
        path: '/login', 
        element: <LoginPage />,
      },
      { 
        path: '/register', 
        element: <RegisterPage />,
      },

      // Public routes (lazy-loaded)
      {
        path: '/courses',
        element: (
          <RouteSuspense>
            <CourseCatalogPage />
          </RouteSuspense>
        ),
      },
      {
        path: '/courses/:courseId',
        element: (
          <RouteSuspense>
            <CourseDetailPage />
          </RouteSuspense>
        ),
      },

      // Protected routes (student)
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <StudentDashboardPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/change-pin', element: <ChangePinPage /> },
          { path: '/watch/:courseId/:videoId', element: <WatchVideoPage /> },
        ],
      },

      // Admin routes
      {
        element: <AdminRoute />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/courses', element: <AdminCoursesPage /> },
          { path: '/admin/courses/:courseId/edit', element: <AdminCourseEditorPage /> },
          { path: '/admin/students', element: <AdminStudentsPage /> },
        ],
      },

      // Development route (lazy-loaded)
      {
        path: '/design-system',
        element: (
          <RouteSuspense>
            <DesignSystemTestPage />
          </RouteSuspense>
        ),
      },

      // 404 fallback
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

// ─── Router provider ──────────────────────────────────────────────────────────
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
