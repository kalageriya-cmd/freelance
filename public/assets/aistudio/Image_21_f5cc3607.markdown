---
name: Executive Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d4d9f0'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dce2f9'
  on-surface: '#151b2c'
  on-surface-variant: '#46464d'
  inverse-surface: '#2a3041'
  inverse-on-surface: '#eef0ff'
  outline: '#76767e'
  outline-variant: '#c7c5ce'
  surface-tint: '#575d7d'
  primary: '#101632'
  on-primary: '#ffffff'
  primary-container: '#252b48'
  on-primary-container: '#8d92b5'
  inverse-primary: '#bfc4e9'
  secondary: '#4d41df'
  on-secondary: '#ffffff'
  secondary-container: '#675df9'
  on-secondary-container: '#fffbff'
  tertiary: '#001e08'
  on-tertiary: '#ffffff'
  tertiary-container: '#003513'
  on-tertiary-container: '#00ab4d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#bfc4e9'
  on-primary-fixed: '#131a36'
  on-primary-fixed-variant: '#3f4564'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c4c0ff'
  on-secondary-fixed: '#100069'
  on-secondary-fixed-variant: '#3622ca'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#faf8ff'
  on-background: '#151b2c'
  surface-variant: '#dce2f9'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.625rem
    fontWeight: '600'
    lineHeight: 2.125rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  title-md:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '600'
    lineHeight: 1.375rem
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
  mono-metric:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system targets independent knowledge professionals, boutique agencies, and high-output contractors who operate at enterprise tier. The aesthetic conveys surgical efficiency, financial command, and focused calm, synthesizing Linear’s keyboard-driven clarity, Stripe’s mechanical perfection, and Notion’s frictionless surface organization.

The UI avoids decorative excess. Instead, it utilizes structural clarity, micro-borders, razor-sharp typography, and measured state transitions to evoke confidence and institutional durability.

## Colors
The color architecture relies on a controlled neutral foundation with intentional, high-contrast focal points:

- **Canvas & Surface System**: Grounded in `#F7F8FC` for the global canvas, with elevated component surfaces in pure `#FFFFFF`.
- **Primary Navy (`#252B48`)**: Applied to foundational structural elements, primary actions, and top-tier typographic headings.
- **Accent Indigo (`#6C63FF`)**: Reserved strictly for high-intent interactive states, focus indicators, active metric callouts, and progress highlights.
- **System Feedback**:
  - Success: `#22C55E` for completed invoices, tracked time triggers, and paid deliverables.
  - Warning: `#F59E0B` for pending client reviews and approaching milestones.
  - Danger: `#EF4444` for overdue contracts, unpaid balances, and destructive actions.
- **Micro-Borders (`#E8EAF2`)**: Structural boundary lines separating layout zones, table rows, and card perimeters without adding visual weight.

## Typography
`Inter` is utilized exclusively across all typographic levels, relying on tracking adjustments and proportional sizing to construct hierarchical distinction:

- Metric figures, financial tallies, and timestamps leverage `font-feature-settings: 'tnum' 1, 'cv05' 1` for tabular vertical alignment and clean numerical stacking.
- Display and headline levels run negative tracking (`-0.015em` to `-0.025em`) to ensure tight layout density comparable to technical productivity tools.
- Metadata and uppercase labels (`label-sm`) use elevated letter spacing (`0.04em`) to maintain legibility at sub-12px thresholds.

## Layout & Spacing
The layout follows a fluid 12-column grid constrained to a maximum content width of `1440px`, supported by a persistent collapsible desktop sidebar (`260px` default, `64px` iconified).

- **Desktop (1024px+)**: 12-column grid with `1.5rem` gutters and `2rem` outer padding. Two- and three-tier dashboard widgets span 4, 6, 8, or 12 columns.
- **Tablet (768px - 1023px)**: 8-column layout with `1.25rem` gutters and `1.5rem` outer canvas padding. Metric grids collapse to two columns.
- **Mobile (&lt;768px)**: 4-column single-axis layout using `0.75rem` gutters and `1rem` outer screen margins. Complex tables shift to swipeable cards or horizontal scrolling frames with trailing indicators.

## Elevation & Depth
Depth is produced through subtle hairline borders and ultra-diffused, ambient shadow profiles:

- **Border Hierarchy**: Every card, popover, modal, and table cell uses a single 1px solid border (`#E8EAF2`). Overlapping elevation avoids stark black shadows in favor of ambient navy-tinted dissipation.
- **Level 0 (Flat/Base)**: `#F7F8FC` canvas with no shadow.
- **Level 1 (Card Default)**: `#FFFFFF` surface with a 1px `#E8EAF2` border and `box-shadow: 0 1px 3px 0 rgba(32, 36, 58, 0.03), 0 1px 2px -1px rgba(32, 36, 58, 0.02)`.
- **Level 2 (Hover & Active Surfaces)**: Elevated cards on interaction receive `box-shadow: 0 4px 12px 0 rgba(32, 36, 58, 0.05), 0 2px 4px -2px rgba(32, 36, 58, 0.03)` with a border shift to `rgba(108, 99, 255, 0.25)`.
- **Level 3 (Overlays & Dialogs)**: Modals and dropdown command palettes receive `box-shadow: 0 12px 32px -4px rgba(32, 36, 58, 0.12), 0 4px 8px -2px rgba(32, 36, 58, 0.04)`.

## Shapes
The shape hierarchy establishes consistent rounding proportions:

- **Cards & Data Panels**: Apply `rounded-xl` (`1.5rem` / `24px`) to ensure an approachable silhouette across substantial surface areas.
- **Modals & Flyout Sheets**: Utilize `rounded-lg` (`1rem` / `16px`).
- **Buttons, Form Inputs, & Dropdowns**: Default to baseline `0.5rem` (`8px`) for compact tool density.
- **Status Pills, Badges, & Avatars**: Set to full continuous pill shapes (`9999px`).

## Components

### Buttons
- **Primary**: Background `#252B48`, text `#FFFFFF`, radius `0.5rem`, padding `0.5rem 1rem`. Hover state transitions background to `#1B1F34` with an inner top highlight of `inset 0 1px 0 rgba(255, 255, 255, 0.12)`.
- **Accent (High Intent)**: Background `#6C63FF`, text `#FFFFFF`. Hover transitions to `#5B52E0`.
- **Secondary / Outline**: Background `#FFFFFF`, border `1px solid #E8EAF2`, text `#20243A`. Hover transitions background to `#F7F8FC` with border `#D5D8E4`.
- **Ghost**: Background transparent, text `#8A90A5`. Hover yields text `#20243A` and background `#F0F2F8`.

### Status Badges & Chips
- Capsule-rounded (`9999px`), padding `0.25rem 0.625rem`, typography `label-sm`.
- **Success (e.g., Paid)**: Background `rgba(34, 197, 94, 0.1)`, text `#15803D`, border `1px solid rgba(34, 197, 94, 0.2)`.
- **Pending (e.g., In Review)**: Background `rgba(245, 158, 11, 0.1)`, text `#B45309`, border `1px solid rgba(245, 158, 11, 0.2)`.
- **Overdue (e.g., Action Required)**: Background `rgba(239, 68, 68, 0.1)`, text `#B91C1C`, border `1px solid rgba(239, 68, 68, 0.2)`.
- **Neutral / Metadata**: Background `#F0F2F8`, text `#20243A`, border `1px solid #E8EAF2`.

### Cards & Metrics
- All primary containers use background `#FFFFFF`, border `1px solid #E8EAF2`, and corner radius `1.5rem` (`rounded-xl`).
- Internal padding: `1.5rem` for desktop; `1.25rem` for mobile.
- Metric cards pair a `label-sm` heading in `#8A90A5` with a `mono-metric` figure in `#20243A`, complemented by a directional pill indicating week-over-week deltas.

### Input Fields & Controls
- Height `2.5rem` (`40px`), padding `0.5rem 0.875rem`, radius `0.5rem`.
- Base style: Background `#FFFFFF`, border `1px solid #E8EAF2`, text `#20243A`, typography `body-md`. Placeholder color: `#8A90A5`.
- Focus state: Border color `#6C63FF`, accompanied by an exterior ring `box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15)`.
- Checkboxes & Radios: Square (`0.25rem` radius) and circular variants sized at `1rem x 1rem`. Unchecked: `1.5px solid #E8EAF2`. Checked: background `#6C63FF` with white check glyph.

### Data Tables & Lists
- Table headers utilize `label-sm`, text `#8A90A5`, background `#FAFBFD`, and bottom border `1px solid #E8EAF2`.
- Row items run height `3.25rem` (`52px`), typography `body-md`, and border bottom `1px solid #E8EAF2`. Row hover transitions to `#F9FAFD`.

### Time Tracker & Invoice Dock (Platform Specific)
- Persistent floating widget anchored bottom-right.
- Styled with Level 3 elevation, `#FFFFFF` background, `0.75rem` corner radius, and an active pulse indicator in `#6C63FF` to denote running project timers.