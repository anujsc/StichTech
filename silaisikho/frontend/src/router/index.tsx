import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import LandingPage from '@/pages/LandingPage';
import CourseCatalogPage from '@/pages/CourseCatalogPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import LoginPage from '@/pages/LoginPage';
import StudentDashboardPage from '@/pages/StudentDashboardPage';
import WatchVideoPage from '@/pages/WatchVideoPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminCoursesPage from '@/pages/AdminCoursesPage';
import AdminCourseEditorPage from '@/pages/AdminCourseEditorPage';
import AdminStudentsPage from '@/pages/AdminStudentsPage';

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

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/courses', element: <CourseCatalogPage /> },
  { path: '/courses/:slug', element: <CourseDetailPage /> },
  { path: '/login', element: <LoginPage /> },

  // Protected student routes
  {
    element: <PrivateRoute />,
    children: [
      { path: '/dashboard', element: <StudentDashboardPage /> },
      { path: '/watch/:courseId/:videoId', element: <WatchVideoPage /> },
    ],
  },

  // Protected admin routes
  {
    element: <AdminRoute />,
    children: [
      { path: '/admin', element: <AdminDashboardPage /> },
      { path: '/admin/courses', element: <AdminCoursesPage /> },
      { path: '/admin/courses/:courseId/edit', element: <AdminCourseEditorPage /> },
      { path: '/admin/students', element: <AdminStudentsPage /> },
    ],
  },
]);
