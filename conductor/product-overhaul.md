# Project Overhaul: Design, Auth, and Maps

## Objective
To elevate the CampusResolve application to a production-grade SaaS level by migrating the design system, implementing modern Single Sign-On (SSO), upgrading the map engine, and refining the navigation UX.

## Scope of Work

### Phase 1: Navigation & UI/UX Fixes
1. **Rename Navigation Links:**
   - Change "Reports" to "Create New" in the main and bottom navigation.
   - Add a new "Reports" link that displays a feed of all reports.
2. **Dashboard Sign-in Fix:**
   - Ensure the "Sign In" button is completely hidden when a user is authenticated.
3. **Profile Button:**
   - Implement a clickable profile button in the top navigation that dynamically links to the respective user's dashboard (`/user/dashboard`, `/authority/dashboard`, or `/admin/dashboard`).

### Phase 2: Design System Upgrade (Tailwind + shadcn/ui)
1. **Infrastructure:**
   - Install and configure `tailwindcss`, `postcss`, and `autoprefixer` in the `frontend` workspace.
   - Initialize `shadcn/ui` components setup.
2. **Component Migration:**
   - Replace custom UI components (`Button`, `Card`, `TextInput`) with `shadcn/ui` equivalents.
   - Strip out legacy CSS and replace with Tailwind utility classes across pages.

### Phase 3: Maps Upgrade
1. **Replace Leaflet:**
   - Uninstall Leaflet dependencies.
2. **Implement Mapbox GL:**
   - Install `mapbox-gl` and `react-map-gl`.
   - Re-write `MapPage.tsx` to use Mapbox GL for hardware-accelerated, smooth rendering.
   - *Note: This will require a Mapbox Public Access Token.*

### Phase 4: Single Sign-On (SSO) Setup
1. **Auth UI Overhaul:**
   - Remove manual email/password input fields from `AuthPage.tsx`.
   - Add dedicated OAuth login buttons for "Google" and "Microsoft (Azure AD)".
2. **Backend/Supabase Integration:**
   - Update `auth.service.ts` to support OAuth flow via Supabase.
   - Prepare necessary `.env` variables and documentation for configuring the OAuth providers in the Supabase Dashboard.

## Alternatives Considered
- **UI Frameworks:** Considered Chakra UI, but `shadcn/ui` offers more copy-paste flexibility and deeper Tailwind integration which is industry standard.
- **Maps:** Considered Google Maps API, but Mapbox GL offers superior vector rendering and clustering performance for high-volume pin scenarios.

## Next Steps
Upon approval, I will begin executing Phase 1 and Phase 2 immediately.
