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


