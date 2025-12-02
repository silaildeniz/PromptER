# Database Schema Mapping - PromptER

This document serves as the **Source of Truth** for database column names and their usage across the application.

## 📋 Database Schema

### `prompts` Table

| Column | Type | Description | Required | Default |
|--------|------|-------------|----------|---------|
| `id` | uuid | Primary key | ✅ | auto-generated |
| `title` | text | Prompt title | ✅ | - |
| `description` | text | Brief description | ❌ | null |
| `prompt_text` | text | The actual prompt content (product) | ✅ | - |
| `media_url` | text | URL to image/video in Supabase Storage | ❌ | null |
| `media_type` | enum | 'image', 'video', 'text' | ✅ | 'image' |
| `cost` | integer | Credits required to purchase | ✅ | 5 |
| `category` | text | Corporate, Social Media, Gaming, Writing | ✅ | - |
| `model` | text | AI tool name (lowercase) | ✅ | - |
| `author` | text | Creator name | ✅ | 'PromptER Team' |
| `sales` | integer | Number of times purchased | ✅ | 0 |
| `rating` | decimal(2,1) | User rating (0.0-5.0) | ✅ | 0.0 |
| `variables` | text[] | Array of variable names | ❌ | [] |
| `created_at` | timestamp | Creation timestamp | ✅ | now() |
| `updated_at` | timestamp | Last update timestamp | ✅ | now() |

### `profiles` Table

| Column | Type | Description | Required | Default |
|--------|------|-------------|----------|---------|
| `id` | uuid | FK to auth.users | ✅ | - |
| `email` | text | User email | ✅ | - |
| `credits` | integer | Available credits | ✅ | 200 |
| `role` | text | 'user' or 'admin' | ✅ | 'user' |
| `created_at` | timestamp | Creation timestamp | ✅ | now() |
| `updated_at` | timestamp | Last update timestamp | ✅ | now() |

### `transactions` Table

| Column | Type | Description | Required | Default |
|--------|------|-------------|----------|---------|
| `id` | uuid | Primary key | ✅ | auto-generated |
| `user_id` | uuid | FK to profiles | ✅ | - |
| `prompt_id` | uuid | FK to prompts | ❌ | null |
| `amount` | integer | Credits amount | ✅ | - |
| `type` | text | 'debit', 'credit', 'bonus', 'ad_reward' | ✅ | - |
| `description` | text | Transaction description | ❌ | null |
| `created_at` | timestamp | Creation timestamp | ✅ | now() |

## 🔄 Column Mapping (Old → New)

### ⚠️ Breaking Changes from Mock Data

| Old Name (Mock Data) | New Name (Database) | Notes |
|---------------------|---------------------|-------|
| `aiTool` | `model` | AI tool name (lowercase) |
| `imageUrl` | `media_url` | Unified for both images and videos |
| `mediaType` | `media_type` | Same concept, different casing |
| `prompt` | `prompt_text` | The actual prompt content |
| `price` | `cost` | Credits required |

## 🎨 Model Name Formatting

### Database Values (lowercase)

```javascript
const validModels = [
  'midjourney',
  'chatgpt',
  'veo3',
  'sora',
  'leonardo',
  'dalle',
  'stable-diffusion'
];
```

### Display Values (formatted)

```javascript
const modelMap = {
  'midjourney': 'Midjourney',
  'chatgpt': 'ChatGPT',
  'veo3': 'Veo3',
  'sora': 'Sora',
  'leonardo': 'Leonardo',
  'dalle': 'DALL-E',
  'stable-diffusion': 'Stable Diffusion'
};
```

### Model Badge Colors

```javascript
const getModelBadgeColor = (model) => {
  const modelLower = model?.toLowerCase() || '';
  
  if (modelLower.includes('midjourney')) {
    return 'bg-gradient-to-r from-purple-500 to-pink-500';
  } else if (modelLower.includes('dall') || modelLower.includes('dalle')) {
    return 'bg-gradient-to-r from-blue-500 to-cyan-500';
  } else if (modelLower.includes('gpt') || modelLower.includes('chatgpt')) {
    return 'bg-gradient-to-r from-green-500 to-emerald-500';
  } else if (modelLower.includes('veo')) {
    return 'bg-gradient-to-r from-orange-500 to-red-500';
  } else if (modelLower.includes('sora')) {
    return 'bg-gradient-to-r from-cyan-500 to-blue-500';
  } else if (modelLower.includes('leonardo')) {
    return 'bg-gradient-to-r from-violet-500 to-purple-500';
  }
  return 'bg-gradient-to-r from-purple-500 to-blue-500';
};
```

## 🔍 Filtering Logic

### By Model (AI Tool)

```javascript
// In Home.jsx
if (aiFilter && aiFilter.tool) {
  query = query.eq('model', aiFilter.tool); // Use 'model' column
}
```

### By Media Type

```javascript
// In Home.jsx
if (aiFilter && aiFilter.type) {
  query = query.eq('media_type', aiFilter.type); // Use 'media_type' column
}
```

### By Category

```javascript
// In Home.jsx
if (selectedFilter !== 'All') {
  query = query.eq('category', selectedFilter); // Use 'category' column
}
```

## 📤 Upload Form Field Mapping

### Form State → Database Columns

```javascript
// In AdminUpload.jsx
const formData = {
  title: '',           // → title
  description: '',     // → description
  model: 'midjourney', // → model (AI tool)
  media_type: 'image', // → media_type
  category: 'Corporate', // → category
  cost: 5,            // → cost
  prompt_text: '',    // → prompt_text
  author: 'Admin'     // → author
};
```

### Insert Query

```javascript
const { data, error } = await supabase
  .from('prompts')
  .insert([
    {
      title: formData.title.trim(),
      description: formData.description.trim() || `Premium ${formData.model} prompt`,
      prompt_text: formData.prompt_text.trim(),
      media_url: publicUrl,
      media_type: formData.media_type,
      cost: parseInt(formData.cost),
      category: formData.category,
      model: formData.model, // ← Maps correctly to 'model' column
      author: formData.author || 'Admin',
      sales: 0,
      rating: 5.0,
      variables: []
    }
  ]);
```

## ✅ Updated Files

### 1. `src/pages/Home.jsx`
- ✅ Fetches from Supabase instead of mock data
- ✅ Uses `model` column for AI tool filtering
- ✅ Uses `media_type` column for type filtering
- ✅ Handles loading and error states

### 2. `src/pages/AdminUpload.jsx`
- ✅ Renamed `ai_tool` → `model`
- ✅ Added `description` field (optional)
- ✅ Added `author` field
- ✅ Correct column mapping in insert query

### 3. `src/components/PromptCard.jsx`
- ✅ Uses `model` for badge display
- ✅ Uses `formatModelName()` for proper display
- ✅ Model badge colors mapped correctly

### 4. `src/pages/PromptDetail.jsx`
- ✅ Fetches from Supabase by ID
- ✅ Uses `media_url` for image/video display
- ✅ Uses `prompt_text` for content
- ✅ Uses `cost` for pricing
- ✅ Uses `model` with proper formatting
- ✅ Handles video media type

## 🧪 Testing Checklist

### Home Page (Data Fetching)
- [ ] Prompts load from Supabase
- [ ] Filter by model (e.g., ?tool=veo3)
- [ ] Filter by media type (e.g., ?type=video)
- [ ] Filter by category (Corporate, Social Media, etc.)
- [ ] Loading spinner shows during fetch
- [ ] Error message if fetch fails
- [ ] "No prompts found" message for empty results

### Admin Upload
- [ ] All fields map to correct database columns
- [ ] File upload to Supabase Storage works
- [ ] Public URL is retrieved correctly
- [ ] Prompt is inserted with correct column names
- [ ] Success toast shows after upload
- [ ] Form resets after successful upload
- [ ] Model dropdown has correct values

### Prompt Cards
- [ ] Model badge displays with correct color
- [ ] Model name is formatted properly (e.g., "ChatGPT" not "chatgpt")
- [ ] Media (image/video) displays correctly
- [ ] Cost displays correctly

### Prompt Detail Page
- [ ] Prompt loads from Supabase by ID
- [ ] Image/Video displays correctly
- [ ] Model badge shows formatted name
- [ ] Author, rating, sales display correctly
- [ ] Prompt text uses `prompt_text` column
- [ ] Cost uses `cost` column
- [ ] Copy button copies `prompt_text`

## 🚨 Common Mistakes to Avoid

1. ❌ Using `prompt.aiTool` → ✅ Use `prompt.model`
2. ❌ Using `prompt.imageUrl` → ✅ Use `prompt.media_url`
3. ❌ Using `prompt.prompt` → ✅ Use `prompt.prompt_text`
4. ❌ Using `prompt.price` → ✅ Use `prompt.cost`
5. ❌ Filtering by `.eq('ai_tool', ...)` → ✅ Use `.eq('model', ...)`
6. ❌ Model values with capital letters → ✅ Use lowercase ('midjourney', 'chatgpt')
7. ❌ Display raw model name → ✅ Format it using `formatModelName()`

## 📚 References

- Supabase Schema: `supabase-schema.sql`
- AI Navigation: `src/data/aiNavigation.js`
- Mock Data (deprecated): `src/data/mockData.js`

---

**Last Updated:** December 2, 2025  
**Status:** ✅ All files refactored to match database schema

