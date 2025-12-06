# 🎨 Visual Navigation Guide - 3-Level System

**Quick Reference:** How users navigate from Main Category → Sub-Category → Specific Niche

---

## 📐 Layout Structure

### Desktop View (Full Navigation)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  🔷 PromptER    [ All ] [ Image Gen ▼ ] [ Text Gen ▼ ] [ Video Gen ▼ ]    │
│                                                            🪙 Credits  👤   │
└────────────────────────────────────────────────────────────────────────────┘
```

### Interaction Example: Image Gen → Logos → Minimalist

```
STEP 1: Hover "Image Gen"
───────────────────────────────────────────────────────

┌────────────────────────────────────────────────────────────┐
│  [ All ] [ Image Gen ▼ ] [ Text Gen ▼ ] [ Video Gen ▼ ]   │
└──────────────┬─────────────────────────────────────────────┘
               │
               ▼
      ┌────────────────────┐
      │  • Logos        ►  │ ◄── Level 2 Dropdown
      │  • Web Design   ►  │
      │  • Photography  ►  │
      └────────────────────┘


STEP 2: Hover "Logos"
───────────────────────────────────────────────────────

      ┌────────────────────┐     ┌─────────────────────┐
      │  • Logos        ►  │ ──► │ • Minimalist        │ ◄── Level 3 Flyout
      │  • Web Design   ►  │     │ • Mascot / Esports  │
      │  • Photography  ►  │     │ • App Icons         │
      └────────────────────┘     └─────────────────────┘


STEP 3: Click "Minimalist"
───────────────────────────────────────────────────────

      ┌────────────────────┐     ┌─────────────────────┐
      │  • Logos        ►  │     │ • Minimalist    ✅  │ ◄── Clicked!
      │  • Web Design   ►  │     │ • Mascot / Esports  │
      │  • Photography  ►  │     │ • App Icons         │
      └────────────────────┘     └─────────────────────┘
                                            │
                                            ▼
                            Navigate to: /?category=minimalist-logos
                            Scroll to: Prompt Grid
                            Show: Only Minimalist Logo prompts
```

---

## 🎯 Complete Navigation Map

### Image Gen Branch

```
Image Gen
├── Logos
│   ├── Minimalist (?category=minimalist-logos)
│   ├── Mascot / Esports (?category=mascot-logos)
│   └── App Icons (?category=app-icons)
│
├── Web Design
│   ├── Landing Pages (?category=landing-pages)
│   ├── Mobile UI (?category=mobile-ui)
│   └── Game UI (?category=game-ui)
│
└── Photography
    ├── Portraits (?category=portraits)
    ├── Fashion (?category=fashion)
    └── Food (?category=food)
```

### Text Gen Branch

```
Text Gen
├── Marketing
│   ├── SEO Articles (?category=seo)
│   └── Social Media (?category=social)
│
└── Coding
    ├── Python Scripts (?category=python)
    └── React Components (?category=react)
```

### Video Gen Branch

```
Video Gen
└── Cinematic
    ├── Trailers (?category=trailers)
    └── Drone Shots (?category=drone)
```

---

## 🖼️ Visual States

### State 1: Default (No Hover)

```
┌─────────────────────────────────────────────────────┐
│  [ All ] [ Image Gen ▼ ] [ Text Gen ▼ ]            │
│         ─────────────                                │
│         slate-300                                    │
└─────────────────────────────────────────────────────┘
```

### State 2: Hover Level 1

```
┌─────────────────────────────────────────────────────┐
│  [ All ] [ Image Gen ▼ ] [ Text Gen ▼ ]            │
│         ─────────────                                │
│         white + bg-white/5 + rotate-180 (chevron)   │
└─────────────────────────────────────────────────────┘
```

### State 3: Level 2 Dropdown Visible

```
      ┌──────────────────────┐
      │ bg-navy-800/98       │ ◄── Glassmorphism
      │ backdrop-blur-md     │
      │ border-white/10      │
      │ shadow-2xl           │
      │                      │
      │  • Logos          ►  │
      │  • Web Design     ►  │
      │  • Photography    ►  │
      └──────────────────────┘
```

### State 4: Level 2 Item Hover

```
      ┌──────────────────────┐
      │  • Logos          ►  │ ◄── bg-purple-500/10
      │    ────────────       │     text-white
      │  • Web Design     ►  │
      │  • Photography    ►  │
      └──────────────────────┘
```

### State 5: Level 3 Flyout Visible (Side Panel)

```
      ┌──────────────────────┐     ┌────────────────────┐
      │  • Logos          ►  │ ──► │ bg-navy-800/98     │
      │    ────────────       │     │ backdrop-blur-md   │
      │  • Web Design     ►  │     │                    │
      │  • Photography    ►  │     │ • Minimalist       │
      └──────────────────────┘     │ • Mascot/Esports   │
                                   │ • App Icons        │
                                   └────────────────────┘
```

### State 6: Level 3 Item Hover

```
                                   ┌────────────────────┐
                                   │ • Minimalist       │ ◄── bg-blue-500/20
                                   │   ──────────       │     text-white
                                   │ • Mascot/Esports   │
                                   │ • App Icons        │
                                   └────────────────────┘
```

---

## 🎨 Color Scheme Reference

### Text Colors

| State | Color | Tailwind Class |
|-------|-------|----------------|
| Default | Light Gray | `text-slate-300` |
| Hover | White | `text-white` |
| Active | White | `text-white` |

### Background Colors

| Element | Color | Tailwind Class |
|---------|-------|----------------|
| Navbar | Dark Navy (50% opacity) | `bg-navy-900/50` |
| Level 2 Dropdown | Dark Navy (98% opacity) | `bg-navy-800/98` |
| Level 3 Flyout | Dark Navy (98% opacity) | `bg-navy-800/98` |
| Level 2 Hover | Purple Glow | `hover:bg-purple-500/10` |
| Level 3 Hover | Blue Glow | `hover:bg-blue-500/20` |

### Border & Effects

| Effect | Value | Tailwind Class |
|--------|-------|----------------|
| Border | White (10% opacity) | `border-white/10` |
| Shadow | Extra Large | `shadow-2xl` |
| Backdrop Blur | Medium | `backdrop-blur-md` |
| Border Radius | Large | `rounded-lg` |

### Indicators (Dots)

```
• Logos          Purple Dot:  bg-purple-400 (hidden by default)
                              opacity-0 → opacity-100 on hover

• Minimalist     Blue Dot:    bg-blue-400 (hidden by default)
                              opacity-0 → opacity-100 on hover
```

---

## 📏 Spacing & Dimensions

### Level 1 Button
```css
Padding:  px-4 py-2        (16px horizontal, 8px vertical)
Gap:      gap-1            (4px between text and icon)
Font:     text-sm          (14px)
```

### Level 2 Dropdown
```css
Min Width:  min-w-[180px]  (180px minimum)
Padding Y:  py-1.5         (6px top/bottom)
Position:   left-0 top-full pt-2
Z-Index:    z-50
```

### Level 2 Item
```css
Padding:  px-4 py-2.5      (16px horizontal, 10px vertical)
Gap:      gap-2            (8px between elements)
Font:     text-sm          (14px)
```

### Level 3 Flyout
```css
Min Width:  min-w-[160px]  (160px minimum)
Padding Y:  py-1.5         (6px top/bottom)
Position:   left-full top-0 ml-1
Z-Index:    z-50
```

### Level 3 Item
```css
Padding:  px-4 py-2.5      (16px horizontal, 10px vertical)
Gap:      gap-2            (8px between elements)
Font:     text-sm          (14px)
```

---

## 🔄 Animation & Transitions

### Chevron Rotation (Level 1)
```css
Default:     transform: rotate(0deg)
On Hover:    transform: rotate(180deg)
Transition:  transition-transform
Duration:    ~200ms (default)
```

### Hover Transitions
```css
All Buttons: transition-all duration-200
Properties:  color, background, opacity, transform
```

### Dot Indicators
```css
Default:     opacity: 0
On Hover:    opacity: 100
Transition:  transition-opacity
```

---

## 🎬 User Flow Sequence

### Scenario: User wants "Minimalist Logos"

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Initial State                                       │
│ ─────────────────────────────────────────────────────────── │
│ User sees: [ All ] [ Image Gen ▼ ] [ Text Gen ▼ ]          │
│ Action: Mouse enters "Image Gen"                            │
│ Result: Level 2 dropdown appears below                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Level 2 Visible                                     │
│ ─────────────────────────────────────────────────────────── │
│ User sees: • Logos ► • Web Design ► • Photography ►         │
│ Action: Mouse enters "Logos"                                │
│ Result: Level 3 flyout appears to the RIGHT                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Level 3 Visible                                     │
│ ─────────────────────────────────────────────────────────── │
│ User sees: • Minimalist • Mascot/Esports • App Icons        │
│ Action: Mouse hovers "Minimalist"                           │
│ Result: Blue glow appears                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 4: User Clicks                                         │
│ ─────────────────────────────────────────────────────────── │
│ Action: Click "Minimalist"                                  │
│ Result:                                                      │
│   1. All dropdowns close                                    │
│   2. Navigate to /?category=minimalist-logos                │
│   3. Smooth scroll to prompt grid                           │
│   4. Display only "Minimalist Logos" prompts                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### Desktop (≥ 768px)
```
✅ Full 3-level navigation visible
✅ Hover-based interactions
✅ Side flyouts enabled
```

### Tablet & Mobile (< 768px)
```
❌ Navigation hidden (class: hidden md:flex)
💡 Consider implementing a mobile menu in the future:
   - Hamburger icon
   - Drawer/Sheet component
   - Accordion-style navigation
```

---

## 🧪 Testing Checklist

### Visual Tests

- [ ] Hover "Image Gen" → Level 2 appears below
- [ ] Hover "Logos" → Level 3 appears to the right
- [ ] Hover "Minimalist" → Blue glow appears
- [ ] Click "Minimalist" → Navigates to correct URL
- [ ] Move mouse away → All dropdowns close
- [ ] "All" button → Clears all filters
- [ ] Chevron rotates 180° when Level 1 is hovered
- [ ] Dot indicators appear on hover
- [ ] Level 3 flyout is NOT cut off by Level 2 dropdown

### Functional Tests

- [ ] Click "Minimalist" → URL becomes `/?category=minimalist-logos`
- [ ] Page scrolls smoothly to prompt grid
- [ ] Only relevant prompts are displayed
- [ ] "All" button resets URL to `/`
- [ ] Hovering between button and dropdown doesn't close menu (bridge works)
- [ ] Multiple rapid hovers don't break the UI
- [ ] Clicking outside closes all dropdowns

### Browser Compatibility

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🎨 Customization Guide

### Change Level 2 Hover Color

**Current:** Purple (`bg-purple-500/10`)

**To change to Pink:**

```jsx
<button className="... hover:bg-pink-500/10 hover:text-white ...">
```

### Change Level 3 Hover Color

**Current:** Blue (`bg-blue-500/20`)

**To change to Green:**

```jsx
<button className="... hover:bg-green-500/20 hover:text-white ...">
```

### Change Dropdown Width

**Current:** `min-w-[180px]` (Level 2), `min-w-[160px]` (Level 3)

**To make wider:**

```jsx
<div className="... min-w-[220px] ...">  {/* Level 2 */}
<div className="... min-w-[200px] ...">  {/* Level 3 */}
```

### Add Icons to Navigation Items

**Example: Add Sparkles icon to "Image Gen"**

```jsx
import { Sparkles } from 'lucide-react';

<button>
  <Sparkles className="w-4 h-4" />
  {level1.label}
  <ChevronDown className="..." />
</button>
```

### Change Animation Speed

**Current:** `transition-all duration-200`

**To make faster:**

```jsx
<button className="... transition-all duration-100 ...">
```

---

## 🚨 Common Pitfalls

### ❌ DON'T: Remove the Bridge Div

```jsx
{/* ❌ BAD: No bridge - dropdown closes too fast */}
<div className="absolute left-0 top-full z-50">
  <div className="dropdown-menu">...</div>
</div>

{/* ✅ GOOD: Bridge prevents accidental closure */}
<div className="absolute left-0 top-full pt-2 z-50">
  <div className="h-2 w-full" /> {/* Bridge */}
  <div className="dropdown-menu">...</div>
</div>
```

### ❌ DON'T: Use overflow-hidden on Level 2

```jsx
{/* ❌ BAD: Level 3 flyout will be cut off */}
<div className="... overflow-hidden">
  {/* Level 3 flyout here */}
</div>

{/* ✅ GOOD: Level 3 can extend beyond Level 2 */}
<div className="... overflow-visible">
  {/* Level 3 flyout here */}
</div>
```

### ❌ DON'T: Forget to Reset Both Hover States

```jsx
{/* ❌ BAD: Only resets Level 1 */}
onMouseLeave={() => setHoveredL1(null)}

{/* ✅ GOOD: Resets both levels */}
onMouseLeave={() => {
  setHoveredL1(null);
  setHoveredL2(null);
}}
```

### ❌ DON'T: Use Wrong Positioning for Level 3

```jsx
{/* ❌ BAD: Appears below Level 2 item */}
<div className="absolute left-0 top-full">

{/* ✅ GOOD: Appears to the RIGHT of Level 2 item */}
<div className="absolute left-full top-0 ml-1">
```

---

## 📊 Performance Considerations

### Rendering Optimization

- **Current:** Re-renders only when hover states change
- **Future:** Consider `useMemo` for large navigation trees

### Hover Debouncing (Future Enhancement)

```javascript
const [hoveredL2, setHoveredL2] = useState(null);
const debounceTimerRef = useRef(null);

const handleMouseEnter = (path) => {
  clearTimeout(debounceTimerRef.current);
  debounceTimerRef.current = setTimeout(() => {
    setHoveredL2(path);
  }, 150); // 150ms delay
};
```

### Lazy Loading (Future Enhancement)

Instead of hardcoding `NAV_TREE`, fetch it asynchronously:

```javascript
const [navTree, setNavTree] = useState([]);

useEffect(() => {
  const fetchNavigation = async () => {
    const { data } = await supabase
      .from('navigation_structure')
      .select('*');
    setNavTree(data);
  };
  fetchNavigation();
}, []);
```

---

## 🎯 Accessibility Notes (Future Enhancement)

### Keyboard Navigation (TODO)

- **Tab:** Navigate between Level 1 items
- **Enter/Space:** Open dropdown
- **Arrow Down:** Navigate Level 2 items
- **Arrow Right:** Open Level 3 flyout
- **Arrow Up:** Navigate backwards
- **Escape:** Close all dropdowns

### Screen Readers (TODO)

Add ARIA attributes:

```jsx
<button
  aria-haspopup="true"
  aria-expanded={hoveredL1 === level1.path}
>
  {level1.label}
</button>

<div role="menu">
  <button role="menuitem">...</button>
</div>
```

---

**Status:** ✅ **VISUAL GUIDE COMPLETE**  
**Last Updated:** December 3, 2025

🎉 **Use this guide as a reference for understanding and customizing the 3-level navigation system!**

