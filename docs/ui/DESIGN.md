
---
name: Rentara Brand System
colors:
  surface: '#f6f9ff'
  surface-dim: '#c8dcf0'
  surface-bright: '#f6f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf5ff'
  surface-container: '#e1f0ff'
  surface-container-high: '#d6ebff'
  surface-container-highest: '#d0e5f9'
  on-surface: '#081d2c'
  on-surface-variant: '#404847'
  inverse-surface: '#1f3242'
  inverse-on-surface: '#e6f2ff'
  outline: '#707977'
  outline-variant: '#bfc8c6'
  surface-tint: '#336761'
  primary: '#002724'
  on-primary: '#ffffff'
  primary-container: '#003f3a'
  on-primary-container: '#76aaa3'
  inverse-primary: '#9cd1c9'
  secondary: '#1c695f'
  on-secondary: '#ffffff'
  secondary-container: '#a5ede0'
  on-secondary-container: '#226e63'
  tertiary: '#002915'
  on-tertiary: '#ffffff'
  tertiary-container: '#004125'
  on-tertiary-container: '#5ab27f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b7ede5'
  primary-fixed-dim: '#9cd1c9'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#184f49'
  secondary-fixed: '#a8f0e3'
  secondary-fixed-dim: '#8cd4c7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#9bf6bd'
  tertiary-fixed-dim: '#7fd9a3'
  on-tertiary-fixed: '#002110'
  on-tertiary-fixed-variant: '#005230'
  background: '#f6f9ff'
  on-background: '#081d2c'
  surface-variant: '#d0e5f9'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  price-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-xs:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---
## Brand & Style

This design system powers a modern automotive mobility and rental platform tailored for the Indonesian market. It evokes dependability, operational transparency, calm efficiency, and effortless mobility.

### Design Movement & Mood

- **Style:** Modern Utilitarian Corporate with Soft Elevation. Grounded in functional clarity, precise card surfaces, and subtle, tactile depth.
- **Tone:** Professional, reliable, approachable, and frictionless.
- **Visual Weight:** Light, breathable surfaces balanced against a signature deep corporate teal-green anchor. High legibility with immediate visual hierarchy ensures trust during multi-step reservation processes.

## Colors

The palette balances authoritative deep forest and emerald greens with crisp, light backdrop neutrals to foster security and trust.

### Color Roles

- **Primary (`#003F3A`):** Core brand actions, primary CTAs, active segmented toggles, key navigation chrome, and main footer surface.
- **Secondary (`#075E54`):** Interactive hover states, secondary highlights, key feature badges, and checked iconography.
- **Tertiary / Success Accent (`#107548`):** Verified states, confirmation badges, success icons, and availability callouts.
- **Neutral Primary (`#172B3A`):** High-contrast typography for headings, vehicle names, pricing amounts, and primary labels.
- **Neutral Secondary (`#6B7C87`):** Meta descriptions, vehicle specs (transmission, capacity), timestamps, and breadcrumb labels.
- **Canvas & Surface:** Background canvas defaults to `#F7F9FA`. Cards, dialogs, floating search bars, and sheets use pure `#FFFFFF`.
- **Structural Outlines:** System border standard is `#E2E8EC`. Subtle divider lines use `#EEF2F4`.
- **System Feedback:**
  - *Success Surface:* `#E6F5EF` paired with `#075E54` text/iconography.
  - *Warning / Pending Surface:* `#FFF3CD` paired with `#856404` text for pending reviews.
  - *Error Surface:* `#FDF2F2` paired with `#DC3545` for alerts, form validation warnings, and unavailable vehicle notifications.

## Typography

The platform utilizes `Plus Jakarta Sans` throughout all digital touchpoints. Its balanced proportions and crisp geometric clarity optimize legibility for automotive specifications, vehicle catalog matrices, and multi-currency pricing formats (`Rp 350.000/hari`).

### Rules & Hierarchy

- **Currency & Pricing:** Always render numeric rental rates using `price-display` or `headline-md` at `fontWeight: 700`, appending the temporal unit `/hari` or `/jam` using `body-sm` in `#6B7C87`.
- **Specification Metadata:** Vehicle specs (capacity, transmission type, fuel type) consistently use `body-sm` or `label-sm` to maintain dense scannability.
- **Section Headers:** Section headings leverage `headline-md` or `headline-lg` paired with a tight negative tracking (`-0.01em`) to create commanding layout anchors.

## Layout & Spacing

The layout is built upon an 8pt architectural rhythm using a responsive 12-column grid system for desktop and tablet screens, folding down to a unified 4-column flow on mobile viewports.

### Grid & Breakpoints

- **Desktop (1200px+):** 12 columns, maximum container width `1280px`, `1.5rem` (24px) gutters, and `2rem` (32px) outer canvas margins.
- **Tablet (768px - 1199px):** 8 columns, `1.25rem` (20px) gutters, and `1.5rem` (24px) margins. Vehicle cards render in 2-column matrices.
- **Mobile (< 768px):** 4 columns, `1rem` (16px) gutters, and `1rem` (16px) canvas edge padding. Search widgets and filters convert to stacked, full-width sheets.

### Spacing Model

- Component interiors maintain a consistent padded perimeter: `space-md` for standard catalog vehicle cards, expanding to `space-lg` for checkout breakdown cards and status containers.
- Element groupings inside forms (date pickers, location selectors) strictly observe `space-sm` for label-to-input binding and `space-md` between distinct fields.

## Elevation & Depth

Visual hierarchy combines low-contrast outlines with soft, warm-tinted ambient shadows to preserve clean separation against the light gray `#F7F9FA` canvas.

### Elevation Hierarchy

- **Level 0 (Flat Surfaces):** Inset table cells, secondary spec tags, and light banner backgrounds (`#E6F5EF`, `#FFF3CD`). Outlines: none or `1px solid #E2E8EC`.
- **Level 1 (Cards & Catalog Items):** Resting vehicle cards, policy blocks, and summary sidebars. Uses border `1px solid #E2E8EC` complemented by `box-shadow: 0 2px 6px rgba(23, 43, 58, 0.04)`.
- **Level 2 (Hovered Cards & Floating Toolbars):** Active card states, sticky search filter bars, and header bars. Uses `box-shadow: 0 8px 20px rgba(0, 63, 58, 0.08)` and border `#D3DDE3`.
- **Level 3 (Modal Dialogs & Overlays):** Booking error dialogs, date pickers, image lightboxes, and status popups. Elevated with `box-shadow: 0 16px 36px rgba(0, 31, 29, 0.16)` over a dark `#172B3A` 45% opacity backdrop blur.

## Shapes

The design system uses a standard `roundedness` rating of `2` (0.5rem base border radius), maintaining geometric elegance, friendly approachability, and automotive precision.

### Specific Radius Specifications

- **Controls & Small Components (0.5rem / 8px):** Primary form inputs, secondary CTA buttons, filter dropdown triggers, and thumbnail preview chips.
- **Segmented Controls & Filter Pills (9999px / Full Pill):** Quick-filter vehicle category tags (e.g., "Semua", "Mobil", "Motor") use pill-shaped containers.
- **Cards & Data Modules (1rem / 16px):** Catalog product cards, booking breakdown summaries, hero search bars, and policy detail containers (`rounded-lg`).
- **Feature Banners & Modals (1.25rem - 1.5rem / 20px - 24px):** Booking status success banners and central feedback dialogs (`rounded-xl`).

## Components

### Buttons

- **Primary Button:** Background `#003F3A`, text `#FFFFFF`, border-radius `0.5rem`, padding `0.75rem 1.5rem`. Hover state scales to `#075E54` with a smooth 150ms ease transition. Active state sinks slightly with inset depth.
- **Secondary / Outline Button:** Transparent background, `1.5px solid #003F3A` border, text `#003F3A`. Hover transitions background to `rgba(0, 63, 58, 0.05)`.
- **Ghost Button:** Padding `0.5rem 1rem`, text `#6B7C87`. Hover shifts text to `#172B3A` and surface to `#E2E8EC`.

### Chips & Filter Pills

- **Interactive Vehicle Selector Pills:** Default state has `#FFFFFF` background, border `1px solid #E2E8EC`, text `#172B3A`. Active/Selected state takes `#003F3A` background, text `#FFFFFF`, border `1px solid #003F3A`.
- **Status Badges:**
  - *Pending / Menunggu:* `#FFF3CD` background with `#856404` text, `0.25rem 0.625rem` padding, `9999px` radius, font size `12px` bold.
  - *Confirmed / Berhasil:* `#E6F5EF` background with `#075E54` text.
  - *Cancelled / Ditolak:* `#FDF2F2` background with `#DC3545` text.

### Vehicle Catalog Cards

- **Structure:** White surface `#FFFFFF`, `1px solid #E2E8EC`, border-radius `1rem`, padding `1rem`. Contains image display canvas with soft neutral backdrop (`#F7F9FA`), title block, spec row, pricing divider, and full-width "Detail" button.
- **Interaction:** On hover, transforms `-2px` on the Y-axis with an elevated soft shadow (`0 8px 20px rgba(0, 63, 58, 0.08)`).

### Form Inputs & Search Module

- **Floating Search Capsule:** Enclosed in a `rounded-lg` container with white `#FFFFFF` surface and subtle elevation. Fields (Lokasi, Tanggal Sewa) separated by internal vertical borders (`#E2E8EC`).
- **Input Fields:** `1px solid #E2E8EC` border, `0.75rem 1rem` padding, `0.5rem` radius. On focus: border shifts to `#075E54` with `0 0 0 3px rgba(7, 94, 84, 0.12)` halo. Error state: border shifts to `#DC3545` with `#DC3545` inline micro-copy beneath.

### Status & Confirmation Banners

- **Success Banner:** Background `#E6F5EF`, `1.5rem` internal padding, `1rem` radius. Features prominent circular green check icon (`#075E54`), `#172B3A` headline, and `#6B7C87` body instructions.
- **Next Steps Timeline:** Numbered circular steps (`1`, `2`, `3`) with `28px` diameter. Completed/Active steps use `#075E54` fill with `#FFFFFF` glyph; upcoming steps use `#E2E8EC` outline with `#6B7C87` text.
