# Navigation & Filtering Critical Bug Fixes

This document details the fixes applied to resolve case sensitivity issues and broken navigation in the PromptER application.

---

## 🐛 PROBLEM 1: Case Sensitivity Mismatch ("No Prompts" Bug)

### The Issue:

```
Admin uploads: category = "gaming" (lowercase)
Filter sends: category = "Gaming" (capitalized)
Supabase .eq(): CASE-SENSITIVE comparison
Result: ❌ No prompts found (even though data exists)
```

### Root Cause:

```javascript
// ❌ BEFORE (Case-sensitive)
query = query.eq('category', 'Gaming'); // Won't match "gaming"
query = query.eq('model', 'Veo3'); // Won't match "veo3"
query = query.eq('media_type', 'Video'); // Won't match "video"
```

### The Fix: Use `.ilike()` Instead

Supabase's `.ilike()` performs **case-insensitive** pattern matching (like SQL's `ILIKE`).

```javascript
// ✅ AFTER (Case-insensitive)
query = query.ilike('category', 'Gaming'); // WILL match "gaming", "GAMING", "GaMiNg"
query = query.ilike('model', 'Veo3'); // WILL match "veo3", "VEO3", "Veo3"
query = query.ilike('media_type', 'Video'); // WILL match "video", "VIDEO", "Video"
```

### Updated Code: `src/pages/Home.jsx`

```23:44:src/pages/Home.jsx
        // Filter by AI tool (model) - from URL params or aiFilter prop
        // Use .ilike() for case-insensitive matching to handle "gaming" vs "Gaming"
        const toolFilter = urlTool || aiFilter?.tool;
        if (toolFilter) {
          query = query.ilike('model', toolFilter);
        }

        // Filter by media type - from URL params or aiFilter prop
        // Use .ilike() for case-insensitive matching
        const typeFilter = urlType || aiFilter?.type;
        if (typeFilter) {
          query = query.ilike('media_type', typeFilter);
        }

        // Filter by category from FilterBar (if not 'All')
        // Use .ilike() for case-insensitive matching
        if (selectedFilter !== 'All') {
          query = query.ilike('category', selectedFilter);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
```

### Benefits:

- ✅ Works regardless of database casing (`"gaming"`, `"Gaming"`, `"GAMING"`)
- ✅ Works regardless of admin input (`"midjourney"`, `"Midjourney"`)
- ✅ No more "No prompts found" when data exists
- ✅ More forgiving user experience

---

## 🐛 PROBLEM 2: Header AI Tools Not Functional

### The Issue:

```
User clicks "Veo3" in navbar → Nothing happens
User hovers and clicks "Video" → Nothing happens
AI Tools are just decorative, not functional filters
```

### Root Cause:

The AI Tools navigation was calling `onFilterChange` but not updating the URL, and the filtering logic wasn't properly integrated.

### The Fix: URL-Based Navigation + Query Params

Implemented proper navigation with URL query parameters for bookmarkable, shareable filters.

---

## ✅ SOLUTION OVERVIEW

### 1. Updated AI Navigation Structure

**File: `src/data/aiNavigation.js`**

```1:28:src/data/aiNavigation.js
// AI Tools Navigation Structure
// Used in Navbar for filtering prompts by AI model and media type
export const AI_NAV_ITEMS = [
  { 
    id: 'chatgpt', 
    label: 'ChatGPT', 
    types: ['Text', 'Code'] 
  },
  { 
    id: 'veo3', 
    label: 'Veo3', 
    types: ['Video', 'Image'] // User specifically requested Image support
  },
  { 
    id: 'midjourney', 
    label: 'Midjourney', 
    types: ['Image'] 
  },
  { 
    id: 'sora', 
    label: 'Sora', 
    types: ['Video'] 
  },
  { 
    id: 'leonardo', 
    label: 'Leonardo AI', 
    types: ['Image', 'Video'] 
  },
];
```

**Key Changes:**
- ✅ Added `'Image'` to Veo3's types (per user request)
- ✅ Clear structure: `id` (lowercase for DB), `label` (formatted for UI), `types` (media types)

---

### 2. Updated Navbar Navigation Logic

**File: `src/components/Navbar.jsx`**

**Before:**
```javascript
const handleToolClick = (tool, type) => {
  setHoveredTool(null);
  if (onFilterChange) {
    onFilterChange({ tool: tool.id, type });
  }
  // ❌ No URL update - not bookmarkable/shareable
};
```

**After:**
```38:61:src/components/Navbar.jsx
  const handleToolClick = (tool, type) => {
    setHoveredTool(null);
    
    // Update URL params for filtering
    const params = new URLSearchParams();
    params.set('tool', tool.id);
    if (type) {
      params.set('type', type.toLowerCase());
    }
    navigate(`/?${params.toString()}`);
    
    // Also update filter state
    if (onFilterChange) {
      onFilterChange({ tool: tool.id, type: type?.toLowerCase() });
    }
  };

  const handleShowAll = () => {
    // Clear URL params
    navigate('/');
    
    // Clear filter state
    if (onFilterChange) {
      onFilterChange({ tool: null, type: null });
    }
  };
```

**Key Features:**
- ✅ Updates URL with query params (`?tool=veo3&type=video`)
- ✅ Bookmarkable URLs (copy/paste link to share filters)
- ✅ Converts type to lowercase for consistency
- ✅ Navigates to clean `/` when "All" is clicked
- ✅ Updates both URL and filter state

---

### 3. URL-Aware Filtering in Home Page

**File: `src/pages/Home.jsx`**

**Imports:**
```javascript
import { useSearchParams } from 'react-router-dom';
```

**Extract URL Params:**
```12:18:src/pages/Home.jsx
  const [searchParams] = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const promptsRef = useRef(null);

  // Extract filters from URL params
  const urlTool = searchParams.get('tool');
  const urlType = searchParams.get('type');
```

**Priority Logic:**
```javascript
// URL params take priority over prop filters
const toolFilter = urlTool || aiFilter?.tool;
const typeFilter = urlType || aiFilter?.type;
```

**useEffect Dependencies:**
```javascript
useEffect(() => {
  fetchPrompts();
}, [aiFilter, selectedFilter, urlTool, urlType]);
// ✅ Re-fetch when URL params change
```

---

## 📊 Filter Flow (End-to-End)

### Scenario 1: User Clicks "Veo3 → Video"

```
1. User clicks "Veo3" in navbar
   ↓
2. Hover menu shows: "Video", "Image"
   ↓
3. User clicks "Video"
   ↓
4. Navbar.handleToolClick() executes:
   - Creates URL params: tool=veo3&type=video
   - Navigates to: /?tool=veo3&type=video
   - Calls onFilterChange({ tool: 'veo3', type: 'video' })
   ↓
5. Home.jsx detects URL change (useEffect triggered)
   ↓
6. Extracts: urlTool = 'veo3', urlType = 'video'
   ↓
7. Builds query:
   query.ilike('model', 'veo3')
   query.ilike('media_type', 'video')
   ↓
8. Supabase returns prompts (case-insensitive match)
   ↓
9. Grid displays filtered prompts
   ✅ URL is bookmarkable/shareable
```

### Scenario 2: Case Mismatch in Database

```
Database: model = "veo3" (lowercase)
Filter: .ilike('model', 'Veo3') (mixed case)
Result: ✅ MATCH (case-insensitive)

Database: category = "gaming" (lowercase)
Filter: .ilike('category', 'Gaming') (capitalized)
Result: ✅ MATCH (case-insensitive)

Database: media_type = "video" (lowercase)
Filter: .ilike('media_type', 'Video') (capitalized)
Result: ✅ MATCH (case-insensitive)
```

---

## 🧪 Testing Scenarios

### Test 1: Case Insensitivity

**Setup:**
```sql
-- Insert test data with different casings
INSERT INTO prompts (model, category, media_type) VALUES
  ('midjourney', 'gaming', 'image'),
  ('Midjourney', 'Gaming', 'Image'),
  ('MIDJOURNEY', 'GAMING', 'IMAGE');
```

**Test:**
```javascript
// All of these should return ALL 3 rows:
query.ilike('model', 'midjourney')
query.ilike('model', 'Midjourney')
query.ilike('model', 'MIDJOURNEY')
```

**Expected Result:** ✅ All 3 queries return all 3 rows

---

### Test 2: Navbar Navigation

**Steps:**
1. Open homepage: `http://localhost:5173/`
2. Click "Veo3" in navbar
3. Hover menu appears with "Video" and "Image"
4. Click "Video"

**Expected:**
- ✅ URL changes to: `http://localhost:5173/?tool=veo3&type=video`
- ✅ Page shows only Veo3 video prompts
- ✅ Copy URL and paste in new tab → Same filter active
- ✅ Click "All" → URL becomes `http://localhost:5173/` and shows all prompts

---

### Test 3: Mixed Casing in Database

**Setup:**
```javascript
// Admin uploads with lowercase (common mistake)
{
  model: 'veo3',
  category: 'gaming',
  media_type: 'video'
}
```

**Test:**
```javascript
// User filters with capitalized (from UI)
query.ilike('category', 'Gaming')
```

**Expected:** ✅ Prompt is found and displayed

---

### Test 4: URL Direct Access

**Test:**
```
Direct navigation to: http://localhost:5173/?tool=midjourney&type=image
```

**Expected:**
- ✅ Page loads with Midjourney image prompts
- ✅ Navbar shows active state for Midjourney
- ✅ FilterBar still works (can filter by category on top of tool/type filter)

---

## 📋 Summary of Changes

### Files Modified:

1. ✅ **`src/pages/Home.jsx`**
   - Changed `.eq()` to `.ilike()` for all text filters
   - Added `useSearchParams` for URL param extraction
   - Added URL param priority logic
   - Updated `useEffect` dependencies

2. ✅ **`src/components/Navbar.jsx`**
   - Updated `handleToolClick` to set URL params
   - Updated `handleShowAll` to clear URL params
   - Added `navigate()` calls for URL updates

3. ✅ **`src/data/aiNavigation.js`**
   - Added `'Image'` to Veo3's types
   - Added documentation comments

---

## 🎯 Benefits of These Fixes

### Problem 1 Fix (`.ilike()`)
- ✅ No more "No prompts found" errors due to casing
- ✅ Works with any database casing convention
- ✅ Admin can upload with any casing (lowercase, capitalized, etc.)
- ✅ More forgiving and user-friendly

### Problem 2 Fix (URL Navigation)
- ✅ AI Tools in navbar are now fully functional
- ✅ Filters are bookmarkable (save/share URLs)
- ✅ Browser back/forward works correctly
- ✅ Clean URL structure (`?tool=veo3&type=video`)
- ✅ Priority system (URL params > props)
- ✅ Deep linking support (direct URL access)

---

## 🚨 Important Notes

### Database Design Recommendation:

For future-proofing, consider normalizing casing at the database level:

```sql
-- Option 1: Add CHECK constraint (enforce lowercase)
ALTER TABLE prompts 
ADD CONSTRAINT check_lowercase_model 
CHECK (model = LOWER(model));

-- Option 2: Add trigger (auto-convert to lowercase)
CREATE OR REPLACE FUNCTION normalize_casing()
RETURNS TRIGGER AS $$
BEGIN
  NEW.model = LOWER(NEW.model);
  NEW.category = LOWER(NEW.category);
  NEW.media_type = LOWER(NEW.media_type);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_prompt_casing
BEFORE INSERT OR UPDATE ON prompts
FOR EACH ROW
EXECUTE FUNCTION normalize_casing();
```

**But for now:** `.ilike()` handles this gracefully without database changes! ✅

---

## 📚 References

- [Supabase `.ilike()` Docs](https://supabase.com/docs/reference/javascript/ilike)
- [React Router `useSearchParams`](https://reactrouter.com/en/main/hooks/use-search-params)
- [URLSearchParams API](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

---

**Last Updated:** December 2, 2025  
**Status:** ✅ All critical bugs fixed and tested

