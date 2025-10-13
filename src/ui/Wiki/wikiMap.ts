// Lightweight mapping from section/item names to fandom pages.
// Values can be a single string (page name) or an array where the index corresponds
// to the dot index (0..max). If an array doesn't contain the requested index,
// the last element or the sanitized name is used as fallback.
export const wikiMap: Record<string, string | string[]> = {
  // single-page examples
  "Анимализм": "Анимализм",

  // per-dot example: for "Изменчивость" the 2nd dot (index 2) maps to
  // "Изменчивость_плоти". Adjust or extend entries as needed.
  "Изменчивость": [
    "Изменчивость", // index 0
    "Изменчивость_1", // index 1 (placeholder)
    "Изменчивость_плоти", // index 2 -> desired page
    // add more entries for higher indices if needed
  ],

  // add more mappings here. Keys should match the exact string used in the
  // character name input (case-sensitive). You can also use pre-sanitized
  // keys with underscores if that's easier.
};

export default wikiMap;
