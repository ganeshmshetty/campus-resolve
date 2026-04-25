  # Campus Civic Reporting Portal

  ## Summary

  Build a React + Node/Express MVP for campus civic issue reporting, using Supabase as the managed free-tier backend infrastructure. Supabase will handle hosted Postgres, authentication, role-aware access,
  and image storage, so no local machine is needed for uploads or persistent data.

  The app still keeps an Express backend for application APIs, validation, role enforcement, and admin workflows, while Supabase provides the managed database, auth, and file storage layer.

  ## Key Changes

  - Frontend: React + Vite with role-based pages for public users, authorities, and admins.
  - Backend: Node.js + Express API using Supabase client/service role for secure server-side operations.
  - Managed services:
      - Supabase Auth for email/password login.
      - Supabase Postgres for reports, updates, assignments, and users/roles.
      - Supabase Storage bucket for uploaded issue and resolution images.
  - No local upload storage, SQLite, or server filesystem dependency.

  ## Core Features

  - Users can register/login, create reports, upload photos, provide address and optional GPS, and track report status.
  - Authorities can view assigned/relevant reports, update status, add notes, and upload resolution proof images.
  - Admins can view all reports, assign reports to authorities, create/manage authority accounts, resolve, close, or reopen issues.
  - Initial fixed categories: waste, water, roads, streetlights, drainage, sanitation, safety, and other.
  - Report statuses: OPEN, ACKNOWLEDGED, IN_PROGRESS, RESOLVED, CLOSED, REJECTED.

  ## Data And Storage

  - Supabase tables:
      - profiles: user id, name, email, role.
      - reports: title, description, category, status, address, latitude, longitude, created_by, assigned_to, timestamps.
      - report_images: report id, uploaded_by, image path/url, image type, timestamp.
      - report_updates: report id, author id, status changes, notes, timestamp.
  - Supabase Storage:
      - Bucket: report-images.
      - Paths grouped by report id, e.g. reports/{reportId}/{timestamp}-{filename}.
      - Validate uploads by MIME type and size before sending.
      - Store image path in Postgres and generate signed/public URLs as needed.

  ## API Shape

  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/me
  - POST /api/reports
  - GET /api/reports
  - GET /api/reports/:id
  - PATCH /api/reports/:id/status
  - PATCH /api/reports/:id/assign
  - POST /api/reports/:id/images
  - POST /api/reports/:id/updates
  - GET /api/admin/stats
  - POST /api/admin/users/authorities

  ## Test Plan

  - Verify registration/login with Supabase Auth and profile role creation.
  - Verify users can create reports with camera/photo uploads to Supabase Storage.
  - Verify role restrictions: users see own reports, authorities see assigned reports, admins see all reports.
  - Verify authorities/admins can update status and upload resolution images.
  - Verify invalid image types and oversized uploads are rejected.
  - Manually run full flow: user submits issue, admin assigns it, authority resolves it, admin closes it.

  ## Assumptions

  - Supabase free tier is acceptable for the campus MVP.
  - The Express backend will hold the Supabase service role key securely; the frontend will only use public anon credentials.
  - GPS is optional and address remains required.
  - Categories remain fixed in code for the first version.
