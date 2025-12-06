// Centralized formatter for turning slugs (e.g., "chatgpt-image") into display names (e.g., "ChatGPT Image").
// This module is the single source of truth for brand/model/category display strings.

const SPECIAL_NAMES = {
  "chatgpt": "ChatGPT",
  "chatgpt-image": "ChatGPT Image",
  "dall-e": "DALL-E",
  "veo": "Veo",
  "midjourney": "Midjourney",
  "midjourney-video": "Midjourney Video",
  "stable-diffusion": "Stable Diffusion",
  "leonardo-ai": "Leonardo AI",
  "hailou-ai": "Hailou AI",
  "kling-ai": "Kling AI",
  "grok": "Grok",
  "grok-image": "Grok Image",
  "deepseek": "DeepSeek",
  "gemini": "Gemini",
  "gemini-image": "Gemini Image",
  "llama": "Llama",
  "qwen": "Qwen",
  "qwen-image": "Qwen Image",
  "flux": "Flux",
  "sora": "Sora",
  "wan": "Wan",
  "claude": "Claude",
  "hunyuan": "Hunyuan",
  "ideogram": "Ideogram",
  "imagen": "Imagen",
  "recraft": "Recraft",
  "seedance": "Seedance",
  "seedream": "Seedream",
};

/**
 * Format a slug into a human-readable display string.
 * - Returns special-cased names when defined.
 * - Otherwise, splits on hyphens and capitalizes each word.
 *
 * @param {string} slug
 * @returns {string}
 */
export function formatDisplayName(slug = "") {
  if (!slug) return "";
  const lower = slug.toLowerCase();
  if (SPECIAL_NAMES[lower]) return SPECIAL_NAMES[lower];
  return lower
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export { SPECIAL_NAMES };


