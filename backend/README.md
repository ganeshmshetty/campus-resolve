# Campus Civic Backend

Express + TypeScript backend scaffold for the Campus Civic Reporting Portal.

## Quick Start

1. Install dependencies:
   npm install
2. Copy environment file:
   cp .env.example .env
3. Start development server:
   npm run dev

Default URL: http://localhost:4000

## Modes

- Mock mode (default): Runs without Supabase credentials using in-memory users and reports.
- Supabase mode: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env. Add SUPABASE_ANON_KEY to enable password login endpoint.

## Mock Users

- Admin: admin@campus.edu / Password123!
- Authority: authority@campus.edu / Password123!
- User: user@campus.edu / Password123!

## API Surface

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/reports
- GET /api/reports
- GET /api/reports/:id
- PATCH /api/reports/:id/status
- PATCH /api/reports/:id/assign
- POST /api/reports/:id/images
- POST /api/reports/:id/updates
- GET /api/admin/stats
- POST /api/admin/users/authorities

Health check:
- GET /health

## Build

- npm run build
- npm run start
