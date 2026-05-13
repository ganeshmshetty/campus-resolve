# CampusResolve | Project Instructions

## Project Overview
CampusResolve is a production-grade civic reporting portal designed for campus environments. It empowers students and staff to report infrastructure, safety, and maintenance issues, which are then triaged and resolved by campus authorities and admins.

### Main Technologies & Architecture
- **Framework:** Next.js 16 (App Router) with Turbopack.
- **Backend-as-a-Service:** Supabase (Auth, PostgreSQL, and Storage).
- **Styling:** Tailwind CSS 4 with custom fonts (Fredoka for headings, Nunito for body).
- **UI Components:** shadcn/ui components built with Radix UI primitives.
- **State & Logic:**
    - **Forms:** React Hook Form + Zod validation.
    - **Server Logic:** Next.js Server Actions for secure database operations.
    - **Maps:** MapLibre GL for interactive issue mapping.
- **Legacy Code:** A previous implementation (React Vite + Express) is preserved in the `/legacy` directory for reference.

## Building and Running
- `npm install`: Install project dependencies.
- `npm run dev`: Launch the development server (available at `http://localhost:3000`).
- `npm run build`: Create a production-optimized build. **Always test the build locally using this command before pushing or deploying to Vercel to catch compile-time errors.**
- `npm run start`: Run the production server.
- `npm run lint`: Execute ESLint for code quality checks.

## Development Conventions

### File Structure & Routing
- **Routes:** All routes are defined in `src/app/`.
- **Components:**
    - `src/components/ui/`: Atomic UI components (shadcn/ui).
    - `src/components/layout/`: Shared layout components like navigation.
- **Logic & Utils:**
    - `src/lib/`: Core libraries and shared utilities (e.g., `utils.ts` for `cn`).
    - `src/utils/supabase/`: Supabase client factories for server-side, client-side, and middleware contexts.
    - `src/app/**/actions.ts`: Server Actions for encapsulating backend logic.

### Authentication & Authorization
- **Auth:** Managed by Supabase Auth with session persistence via cookies.
- **Session Management:** The `src/proxy.ts` (Next.js middleware) ensures sessions are refreshed and protected routes are enforced.
- **Roles:** The application supports `user`, `authority`, and `admin` roles, stored in the `profiles` table.

### Styling & Design System
- **Tailwind CSS:** Use Tailwind utility classes for all styling.
- **Theming:** CSS variables are used for theme tokens (colors, radii, etc.), integrated with `next-themes` for potential dark mode support.
- **Icons:** Use `lucide-react` for all system icons.

### Database & Storage
- **Postgres:** Primary data store for reports, profiles, and updates.
- **RLS (Row Level Security):** Enabled on Supabase tables to protect data at the database level.
- **Storage:** Use the `report-images` Supabase bucket for all image uploads related to reports and resolutions.

## Project Guidelines
- **Modern Standards:** Prioritize React 19 features and Next.js App Router best practices.
- **Security:** Always use Server Actions for database mutations and ensure Supabase RLS is properly configured.
- **Types:** Maintain strict TypeScript typing across the project to ensure structural integrity and developer productivity.