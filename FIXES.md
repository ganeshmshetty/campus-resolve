# UI/UX Fixes

## Completed

- [x] Removed dead or fake actions from the main experience.
  - Removed the inactive notification icon from the header.
  - Removed the non-functional `Save Draft` report form action.
  - Removed placeholder footer links and the dead helpdesk link.
  - Replaced hardcoded emergency copy with generic campus/local emergency guidance.

- [x] Fixed missing design tokens and utility classes.
  - Added missing surface, tertiary, and error-container tokens.
  - Added `.text-primary`, `.error-banner`, `.stack-md`, and `.stack-sm` utilities.
  - Standardized error banners with `role="alert"` where user-facing errors appear.

- [x] Reduced mobile bottom navigation crowding.
  - Removed the extra logout item from mobile bottom navigation.
  - Kept mobile bottom nav focused on primary destinations: Home, Reports, Create, and Login/Dashboard.

- [x] Replaced plain loading text with structured skeleton states.
  - Added a shared `LoadingState` component.
  - Applied skeletons to report feed, user dashboard, report details, map, authority dashboard, and admin reports table.

- [x] Added accessible labels to icon-only account actions.
  - Added `aria-label` to login, account dashboard, and logout icon controls.
  - Removed emoji-based backend status labels in favor of plain accessible text.

## Still Recommended

- [ ] Wire or remove the report form urgency field.
- [ ] Add image previews, file-size validation, and removable selected files.
- [ ] Add sorting/filtering to admin report management.
- [ ] Use status-colored map markers and add a map legend.
- [ ] Replace remaining inline styles with reusable components/classes.
