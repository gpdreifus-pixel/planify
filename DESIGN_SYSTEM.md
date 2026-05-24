# Planify — Design System

> Canonical visual source of truth. All UI decisions derive from this document.

---

## 1. Background System

**One background for all screens** — the warm purple-to-orange gradient:

```css
linear-gradient(180deg, #8178a8 0%, #c49ba2 35%, #ff8c42 70%, #ff6b1f 100%)
background-attachment: fixed
```

Ambient decorative circles (`bg-circle-1/2/3`) are fixed behind all content:
- Top-right: white radial, `blur(60px)`, 400×400 px
- Bottom-left: warm orange radial, `blur(50px)`, 300×300 px
- Middle-left: white radial, `blur(60px)`, 350×350 px

> No "dark mode" or alternative background exists. The `variant="chat"` AppBackground is the only variant used.

---

## 2. Color Tokens (`@theme` in index.css)

### Brand
| Token | Hex | Role |
|---|---|---|
| `--color-primary` | `#a53d00` | Deep orange (deep press states) |
| `--color-primary-container` | `#ff6b1f` | CTA buttons, active states, orange fills |
| `--color-primary-light` | `#ff8c42` | Gradient start, soft orange |
| `--color-secondary` | `#5b3cdd` | Deep purple accent |
| `--color-secondary-container` | `#7459f7` | Ambient blobs, tags |

### Surface (white-card context)
| Token | Hex | Role |
|---|---|---|
| `--color-background` | `#fcf9f8` | Off-white page bg |
| `--color-surface` | `#fcf9f8` | Card base |
| `--color-on-surface` | `#1b1c1c` | Primary text on white |
| `--color-on-surface-variant` | `#5a4137` | Secondary text on white |
| `--color-surface-container` | `#f0eded` | Subtle tinted surface |
| `--color-surface-container-high` | `#eae7e7` | Hover/pressed surfaces |
| `--color-outline` | `#8e7166` | Borders, muted text |
| `--color-outline-variant` | `#e2bfb2` | Subtle dividers |

### Semantic
| Token | Hex | Role |
|---|---|---|
| `--color-error` | `#ba1a1a` | Destructive actions |
| `--color-error-container` | `#ffdad6` | Error surface |

---

## 3. Typography

### Fonts
- **Syne 700** — Display headings, brand wordmark, section titles, CTA button text
- **Plus Jakarta Sans 400/600** — Body text, labels, chip text, meta info

### Scale
| Role | Size | Weight | Font |
|---|---|---|---|
| Display | `2rem` | 700 | Syne |
| Headline LG | `1.75rem` | 700 | Syne |
| Headline MD | `1.5rem` | 700 | Syne |
| Headline SM | `1.25rem` | 700 | Syne |
| Body LG | `1.125rem` | 400 | Jakarta |
| Body MD | `1rem` | 400/600 | Jakarta |
| Label MD | `0.875rem` | 600 | Jakarta |
| Label SM | `0.75rem` | 600 | Jakarta |

### Text Colors
**On gradient background (glass surfaces):**
- Primary: `white` / `rgba(255,255,255,1.0)`
- Secondary: `rgba(255,255,255,0.70)`
- Muted: `rgba(255,255,255,0.45–0.55)`

**On white cards (`surface-card`):**
- Primary: `#1b1c1c`
- Secondary: `#5a4137`
- Muted: `#8e7166`

---

## 4. Surface System

### Glass Surfaces (used on gradient background)

```css
/* Primary container card */
.glass-molded
  background: rgba(255,255,255,0.15)
  backdrop-filter: blur(16px)
  border: 1px solid rgba(255,255,255,0.20)
  shadows: inset highlight + outer shadow

/* Interactive element (buttons, tabs, chips) */
.glass-raised
  background: rgba(255,255,255,0.20)
  backdrop-filter: blur(12px)
  border: 1px solid rgba(255,255,255,0.25)

/* Pressed / input background */
.glass-pressed
  background: rgba(0,0,0,0.10)
  backdrop-filter: blur(8px)
  border: 1px solid rgba(255,255,255,0.10)
```

### White Cards (content listings on gradient background)

```css
.surface-card
  background: rgba(255,255,255,0.92)
  border: 1px solid rgba(255,255,255,0.60)
  box-shadow: 0 4px 20px rgba(0,0,0,0.08)
  border-radius: 1.5rem
```

Use `surface-card` for: property cards, trip cards, community cards, profile sections.

### Glass Input Field

```css
.input-glass          /* container div */
  display: flex + align-items: center
  background: rgba(255,255,255,0.12)
  border: 1px solid rgba(255,255,255,0.22)
  border-radius: 1rem
  padding: 0.875rem 1rem
  gap: 0.75rem
  transition: border-color 0.2s

.input-glass:focus-within
  border-color: rgba(255,255,255,0.55)

/* Icon inside .input-glass */
  color: rgba(255,255,255,0.50)
  font-size: 20px

/* Input element inside .input-glass */
  background: transparent | border: none | color: white
  placeholder: rgba(255,255,255,0.45)
```

---

## 5. Spacing System

Base unit: **4px (0.25rem)**

| Step | Value | Tailwind |
|---|---|---|
| XS | 4px | `gap-1` / `p-1` |
| SM | 8px | `gap-2` / `p-2` |
| MD | 16px | `gap-4` / `p-4` |
| LG | 24px | `gap-6` / `p-6` |
| XL | 32px | `gap-8` / `p-8` |
| 2XL | 48px | `gap-12` / `p-12` |

**Screen gutter:** `px-6` (24px) on all screens
**Max content width:** `max-w-md` (448px), `mx-auto`
**Card gap:** `gap-4` to `gap-5` (16–20px)
**Section margin:** `mb-6` (24px)

---

## 6. Border Radius

| Token | Value | Usage |
|---|---|---|
| SM | `0.25rem` | Micro chips |
| Default | `0.5rem` | Tiny controls |
| LG | `0.75rem` | Small chips |
| XL | `1rem` | Input fields |
| 2XL | `1.5rem` | Cards, panels |
| 3XL | `2rem` | Large cards |
| Full | `9999px` | Pills, buttons, avatars |

---

## 7. Shadow Language

| Context | Value |
|---|---|
| White cards | `0 4px 20px rgba(0,0,0,0.08)` |
| Orange CTA buttons | `0 4px 20px rgba(255,107,31,0.40)` |
| Floating CTAs | `0 8px 32px rgba(255,107,31,0.30)` |
| Bottom nav | `0 -8px 32px rgba(0,0,0,0.30)` |
| Glass raised | `0 4px 15px rgba(0,0,0,0.10)` |

---

## 8. Component Patterns

### Buttons

**Primary CTA** (`btn-primary`)
- Orange gradient fill: `linear-gradient(135deg, #ff8c42, #ff6b1f)`
- Shape: `rounded-full` pill
- Padding: `py-4 px-6` (full-width) or `py-2 px-4` (inline)
- Text: white, Syne 700, 1rem–1.125rem
- Shadow: `0 4px 20px rgba(255,107,31,0.40)`
- Active: `scale(0.97)`, shadow collapses inward

**Secondary / Ghost**
- Glass surface: `glass-raised` + `border border-white/20`
- Text: white, Jakarta 600
- No fill background

**Icon buttons**
- 40×40px circle, `glass-raised` on gradient background
- 36×36px circle, `surface-container-high` background on white cards

### Input Fields

**On glass/gradient backgrounds:**
```jsx
<div className="input-glass">
  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>
    {icon}
  </span>
  <input type={type} placeholder={placeholder} />
</div>
```

**On white card backgrounds:**
```jsx
<input className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:border-outline" />
```

### Tab Switcher (Segmented Control)

```jsx
<div className="glass-raised rounded-full flex p-1">
  <button className={active ? 'bg-white/25 text-white rounded-full py-2.5' : 'text-white/55 py-2.5'}>
    Tab 1
  </button>
  <button ...>Tab 2</button>
</div>
```

### Cards

**White content card (`surface-card`)**
- Use for: property listings, trip cards, community posts, profile sections
- Border radius: `1.5rem` (rounded-3xl via surface-card)
- Overflow: `hidden` when containing images
- Padding: `p-4` standard, `p-5` emphasized

**Glass container card (`glass-molded`)**
- Use for: HomeScreen main card, AuthScreen card, ChatSummary, primary focus areas

**Dark glass panel (inline)**
- Inline `rgba(0,0,0,0.20–0.28)` + `backdrop-filter: blur(12px)` + `border: 1px solid rgba(255,255,255,0.12)`
- Use sparingly for: price breakdown tables, activity lists inside detail screens

---

## 9. Navigation

### Bottom Navigation Bar (`BottomNav`)
- Fixed bottom, `rounded-t-[2rem]`
- Style: `neu-bottombar` — `rgba(30,30,30,0.40)` + `backdrop-filter: blur(16px)` + `border-top: 1px solid rgba(255,255,255,0.20)`
- Shadow: `0 -8px 32px rgba(0,0,0,0.30)`
- Height: ~72px + `pb-safe`
- Items: icon only at 26px + tiny label at 10px
- Active: `neu-nav-item-active` circle (inset shadow, white text, filled icon)
- Inactive: outline icon, `white/50` text

### Top App Bar (`TopAppBar`)
- Transparent (inherits background)
- Back button: 40×40 `glass-raised` circle, `arrow_back` icon
- Title: Syne 700, 1.5rem, white, centered
- Padding: `px-6 py-4`
- Right slot: any React node (icon button, step counter, etc.)

---

## 10. Animation & Motion

### Page Transitions
```ts
pageVariants = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -24 } }
pageTransition = { type: 'tween', ease: 'easeInOut', duration: 0.22 }
```

### Stagger Lists
```ts
staggerContainer = { animate: { transition: { staggerChildren: 0.07, delayChildren: 0.10 } } }
staggerItem = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }
```

### Sheet Entrance
```ts
slideUpVariants = { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
sheetTransition = { type: 'spring', damping: 30, stiffness: 300 }
```

### Chat Bubbles
```ts
chatBubbleVariants = { initial: { opacity: 0, scale: 0.85, y: 10 }, animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } } }
```

### Interaction States
| Interaction | Value |
|---|---|
| Button tap | `whileTap={{ scale: 0.97 }}` |
| Icon button tap | `whileTap={{ scale: 0.90 }}` |
| Like/small tap | `whileTap={{ scale: 0.88 }}` |
| Card hover | `whileHover={{ scale: 1.01 }}` (optional) |

### Principles
- GPU-accelerated only: `transform` + `opacity`
- No slow transitions (max 400ms for most UI, 220ms for page transitions)
- Subtle spring for sheets and modals
- No scale > 1.05 for any element
- `prefers-reduced-motion`: respect — remove `y`/`scale` transforms, keep `opacity`

---

## 11. Bottom Sheet Pattern

Used for: Filters overlay

```
┌──────────────────────────────┐
│  [dark blurred backdrop]      │
│  tap to close                 │
├──────────────────────────────┤
│  ──── (handle bar)            │
│  Filtros             ✕        │
│                               │
│  [filter controls]            │
│                               │
│  [Aplicar filtros]            │
└──────────────────────────────┘
```

- Backdrop: `rgba(0,0,0,0.45)` + `backdrop-filter: blur(4px)`
- Sheet: `bg-white`, `rounded-t-[2rem]`, `max-h-[90vh]`, overflow scroll
- Handle: `w-10 h-1 rounded-full bg-gray-300`
- Title: Syne 700, `#ff6b1f` (orange)
- Close: 36×36 circle, `background: #f0eded`
- Entrance: spring slide-up `{ damping: 30, stiffness: 300 }`
- Filter controls use dark text (on-surface system)
- Active filter chips: `border-[#ff6b1f] text-[#ff6b1f] bg-orange-50`
- Inactive: `border-[#e2bfb2] text-[#5a4137]`

---

## 12. Layout Density Rules

- **Compact density**: prioritize information over whitespace
- Line height: 1.4–1.6 for body, 1.1–1.2 for headings
- Icon size: 20–24px for content icons, 26px for nav, 36–40px for feature icons
- Touch targets: minimum 44×44px (buttons, nav items)
- Card image heights: 140–220px depending on context
- Hero image: 280–300px
- Avatar: 40×40px standard, 80×80px profile header

---

## 13. Screen Architecture Summary

| Screen | Background | Cards | Primary Text |
|---|---|---|---|
| HomeScreen | warm gradient | `glass-molded` main card | white |
| AuthScreen | warm gradient | `glass-molded` main card | white |
| ChatScreen | warm gradient | `glass-raised` bubbles | white |
| ChatSummaryScreen | warm gradient | `glass-molded` | white |
| ResultsScreen | warm gradient | `surface-card` (white) | dark |
| TripDetailScreen | warm gradient | white content panel | dark |
| BookingScreen | warm gradient | `surface-card` (white) | dark |
| MyTripsScreen | warm gradient | `surface-card` (white) | dark |
| CommunityScreen | warm gradient | `surface-card` (white) | dark |
| FiltersScreen | overlay sheet | white sheet | dark |
| ProfileScreen | warm gradient | `surface-card` (white) | dark |
