import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { ReportsManagementPage } from '../pages/admin/ReportsManagementPage'
import { AuthorityDashboardPage } from '../pages/authority/AuthorityDashboardPage'
import { AuthPage } from '../pages/AuthPage'
import { LandingPage } from '../pages/LandingPage'
import { MapPage } from '../pages/MapPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { NewReportPage } from '../pages/reports/NewReportPage'
import { ReportDetailsPage } from '../pages/reports/ReportDetailsPage'
import { ReportsFeedPage } from '../pages/reports/ReportsFeedPage'
import { UserDashboardPage } from '../pages/user/UserDashboardPage'

function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const userStr = localStorage.getItem('user');
  if (!userStr || userStr === 'undefined') return <Navigate to="/auth" replace />;
  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'reports', element: <ReportsFeedPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'user/dashboard', element: <UserDashboardPage /> },
          { path: 'reports/new', element: <NewReportPage /> },
          { path: 'reports/:reportId', element: <ReportDetailsPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['authority', 'admin']} />,
        children: [
          { path: 'authority/dashboard', element: <AuthorityDashboardPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { path: 'admin/dashboard', element: <AdminDashboardPage /> },
          { path: 'admin/reports', element: <ReportsManagementPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
