# Next.js Greenfield Rebuild Plan: CampusResolve

## Objective
Rebuild the Campus Civic Reporting Portal from scratch using a modern Next.js stack. The goal is to maximize development speed and maintainability by treating this as a greenfield project, retaining only the core business requirements and data structures of the original app, while entirely discarding the old React + Express codebase.

## Core Business Requirements (How the app works)
A civic issue reporting portal with three distinct user roles:
1. **Public Users:** Register/login, create reports (photo, address, optional GPS, category), and track their report statuses.
2. **Authorities:** View assigned reports, update statuses, add notes, and upload resolution proof photos.
3. **Admins:** Oversee all reports, assign reports to specific authorities, manage authority user accounts, and forcefully resolve/close issues.

**Business Rules:**
- **Categories:** waste, water, roads, streetlights, drainage, sanitation, safety, other.
- **Statuses:** OPEN, ACKNOWLEDGED, IN_PROGRESS, RESOLVED, CLOSED, REJECTED.

## Proposed Tech Stack (Optimized for DX)
- **Framework:** Next.js 15+ (App Router)
- **UI & Styling:** Tailwind CSS, `shadcn/ui` (provides beautiful, accessible copy-paste components out of the box), and `lucide-react` for icons.
- **Backend as a Service:** Supabase
  - **Auth:** Supabase Auth with `@supabase/ssr` for secure server-side session management via cookies.
  - **Database:** Supabase Postgres (using the `@supabase/supabase-js` SDK for straightforward querying).
  - **Storage:** Supabase Storage for issue/resolution images.
- **Forms & Validation:** `react-hook-form` paired with `zod` for effortless client-side form validation.
- **Server Mutations:** `next-safe-action` to handle form submissions securely on the server with end-to-end type safety.
- **Maps:** `react-map-gl` (Maplibre) for displaying report locations.

## Database Schema (Supabase)
*We will recreate the following tables in the new Supabase project:*
- **profiles:** `id` (auth.users), `name`, `email`, `role` (user, authority, admin).
- **reports:** `id`, `title`, `description`, `category`, `status`, `address`, `lat`, `lng`, `created_by`, `assigned_to`, `created_at`.
- **report_images:** `id`, `report_id`, `uploaded_by`, `image_url`, `type` (issue or resolution), `created_at`.
- **report_updates:** `id`, `report_id`, `author_id`, `status_change`, `notes`, `created_at`.

## Phased Implementation Plan

### Phase 1: Foundation & Auth
1. **Scaffold Next.js App:** Create a fresh Next.js project with Tailwind and setup `shadcn/ui`.
2. **Supabase Integration:** Connect the app to Supabase. Implement `middleware.ts` to enforce role-based access control (RBAC) at the edge.
3. **Authentication:** Build `/login` and `/register` pages using `shadcn/ui` forms. Implement Server Actions to handle sign-in/up via Supabase.

### Phase 2: Core Reporting Flow (Public Users)
1. **Report Submission:** Build the `/reports/new` page. Implement image upload to Supabase Storage and inserting report data via `next-safe-action`.
2. **User Dashboard:** Build `/dashboard` showing the user's submitted reports using Next.js Server Components for direct database fetching.
3. **Report Details:** Build `/reports/[id]` to show report info, status history, and photos.

### Phase 3: Authority & Admin Workflows
1. **Admin Dashboard:** Build `/admin` to list all reports (with filtering/sorting), view global stats, and manage authority user creation.
2. **Assignment:** Add functionality for Admins to assign reports to Authorities.
3. **Authority Dashboard:** Build `/authority` showing only assigned reports.
4. **Status Updates:** Implement forms for Authorities/Admins to add notes, change statuses, and upload resolution proof photos.

### Phase 4: Maps & Polish
1. **Map View:** Implement a map page displaying all public reports using clustering.
2. **UX Polish:** Add toast notifications (`shadcn/ui` sonner) for actions, loading states, and responsive design tweaks.
3. **Cleanup:** Delete the legacy `frontend/` and `backend/` folders completely once the new app is functional.