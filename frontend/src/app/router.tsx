import { createBrowserRouter } from 'react-router-dom'
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
import { UserDashboardPage } from '../pages/user/UserDashboardPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'user/dashboard', element: <UserDashboardPage /> },
      { path: 'authority/dashboard', element: <AuthorityDashboardPage /> },
      { path: 'admin/dashboard', element: <AdminDashboardPage /> },
      { path: 'admin/reports', element: <ReportsManagementPage /> },
      { path: 'reports/new', element: <NewReportPage /> },
      { path: 'reports/:reportId', element: <ReportDetailsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
