---
name: Campus Service Design System
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf8'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e2e1ed'
  on-surface: '#191b23'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c5d7'
  surface-tint: '#1353d8'
  primary: '#003fb1'
  on-primary: '#ffffff'
  primary-container: '#1a56db'
  on-primary-container: '#d4dcff'
  inverse-primary: '#b5c4ff'
  secondary: '#555f6d'
  on-secondary: '#ffffff'
  secondary-container: '#d6e0f1'
  on-secondary-container: '#596372'
  tertiary: '#852b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ad3b00'
  on-tertiary-container: '#ffd4c5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00174d'
  on-primary-fixed-variant: '#003dab'
  secondary-fixed: '#d9e3f4'
  secondary-fixed-dim: '#bdc7d8'
  on-secondary-fixed: '#121c28'
  on-secondary-fixed-variant: '#3e4755'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e2e1ed'
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Public Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.35'
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1200px
---

## Brand & Style

The design system is rooted in the principles of civic utility and communal responsibility. It prioritizes clarity over decoration, ensuring that users—students, faculty, and staff—feel supported and heard when reporting issues. The brand personality is one of a "reliable partner": steady, transparent, and efficient. 

The aesthetic style is **Modern Minimalism** with a focus on **Tonal Layering**. By utilizing a soft, multi-layered background strategy instead of aggressive shadows or gradients, the UI achieves a "practical feel" that avoids corporate coldness. The interface is designed to disappear, leaving only the information and the path to resolution visible. This approach fosters trust through accessibility and organized information density.

## Colors

This color palette is anchored by a trustworthy Blue primary, signifying authority and reliability. To avoid an overly institutional feel, the secondary "Clean Slate" provides a neutral grounding for utilitarian elements like labels and borders.

The system relies heavily on its **Status Colors** to communicate progress at a glance. These colors are calibrated for high legibility against white card surfaces. The **Background** uses a soft light gray (#F9FAFB) to create a subtle contrast with the white cards, providing a sense of depth and physical presence without the need for heavy shadows.

## Typography

The design system utilizes **Public Sans** across all levels. Originally designed for government systems, it provides the perfect balance of institutional neutrality and modern approachability. 

The type scale is optimized for readability in a data-rich environment. Headlines use a tighter letter-spacing and heavier weights to command attention, while body text uses a generous line height (1.5–1.6) to reduce cognitive load during the reporting process. Uppercase labels are used sparingly for metadata and status indicators to differentiate "system data" from "user content."

## Layout & Spacing

The design system employs a **Fixed Grid** model on desktop to ensure that reporting forms and dashboards remain readable and organized. Content is centered within a 1200px container, utilizing a 12-column system.

The spacing rhythm is built on a 4px/8px baseline. Large internal card padding (24px) is essential to the "clean" feel, giving each report breathing room. Vertical rhythm should be strictly maintained, with larger gaps (40px) between distinct sections to help users mentally categorize different parts of the portal.

## Elevation & Depth

To maintain a "practical" and "accessible" feel, the design system avoids complex shadows. Depth is communicated through **Low-Contrast Outlines** and **Tonal Layers**.

1.  **Level 0 (Canvas):** The soft light gray background (#F9FAFB).
2.  **Level 1 (Cards):** Pure white surfaces with a subtle 1px border (#E5E7EB). This level is used for primary content.
3.  **Level 2 (Interaction/Popovers):** A very soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)) is used only when an element sits physically above the page, such as a dropdown or a modal.

This flat-but-layered approach ensures the UI feels like a structured document rather than a flashy software application.

## Shapes

The design system uses a **Rounded** shape language (8px / 0.5rem) for standard components. This corner radius is intentional: it is soft enough to feel community-oriented and approachable, yet sharp enough to retain a sense of institutional order. 

Large containers like cards utilize `rounded-lg` (16px), while smaller elements like buttons and input fields use the standard 8px radius. Status chips should use a pill-shape (full round) to distinguish them from interactive buttons.

## Components

### Cards
Cards are the primary container. They must feature white backgrounds, 16px corner radius, and a subtle 1px slate border. Internal padding should be a consistent 24px.

### Buttons
*   **Primary:** Solid Trustworthy Blue with white text. High contrast is mandatory.
*   **Secondary:** Outlined Slate (#4B5563) with a 1px border.
*   **Ghost:** Used for less frequent actions, using Slate text with no border.

### Status Chips
Status chips are non-interactive indicators. They should use a subtle background tint (10% opacity of the status color) with high-contrast bold text of the status color to ensure accessibility compliance (WCAG AA).

### Input Fields
Inputs must have a clearly defined 1px border (#D1D5DB). When focused, the border transitions to Primary Blue with a 2px thickness. Labels must always be visible above the field (never placeholder-only) to maintain accessibility.

### Progress Timeline
A vertical or horizontal timeline component should be used to show a report's journey from "Open" to "Resolved," using the status color palette to indicate the current stage.