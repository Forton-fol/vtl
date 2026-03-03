import { flattenOptions, pickRandom } from "./randomUtils";
import { OptionGroup } from "../../root/domain";

/**
 * Mapping of VtM V20 clans to their in-clan disciplines.
 * Each entry has patterns for matching both EN and RU clan names,
 * and discipline name patterns in both languages.
 */
interface ClanDisciplineEntry {
  /** Substrings to match against the selected clan name (case-insensitive) */
  clanPatterns: string[];
  /** Discipline name prefixes in EN and RU — used to find matching strings in discipline options */
  disciplinePatterns: string[][];
}

/**
 * Standard V20 clan→discipline mapping.
 * Covers main 13 clans + key bloodlines.
 */
const CLAN_DISCIPLINES: ClanDisciplineEntry[] = [
  // ── Camarilla Clans ──
  {
    clanPatterns: ["Brujah", "Бруха"],
    disciplinePatterns: [
      ["Celerity", "Стремительность"],
      ["Potence", "Могущество"],
      ["Presence", "Присутствие"],
    ],
  },
  {
    clanPatterns: ["Gangrel", "Гангрел"],
    disciplinePatterns: [
      ["Animalism", "Анимализм"],
      ["Fortitude", "Стойкость"],
      ["Protean", "Превращение"],
    ],
  },
  {
    clanPatterns: ["Malkavian", "Малкавиан"],
    disciplinePatterns: [
      ["Auspex", "Ясновидение"],
      ["Dementation", "Помешательство"],
      ["Obfuscate", "Затемнение"],
    ],
  },
  {
    clanPatterns: ["Nosferatu", "Носферату"],
    disciplinePatterns: [
      ["Animalism", "Анимализм"],
      ["Obfuscate", "Затемнение"],
      ["Potence", "Могущество"],
    ],
  },
  {
    clanPatterns: ["Toreador", "Тореадор"],
    disciplinePatterns: [
      ["Auspex", "Ясновидение"],
      ["Celerity", "Стремительность"],
      ["Presence", "Присутствие"],
    ],
  },
  {
    clanPatterns: ["Tremere", "Тремер"],
    disciplinePatterns: [
      ["Auspex", "Ясновидение"],
      ["Dominate", "Доминирование"],
      ["Thaumaturgy", "Тауматургия"],
    ],
  },
  {
    clanPatterns: ["Ventrue", "Вентру"],
    disciplinePatterns: [
      ["Dominate", "Доминирование"],
      ["Fortitude", "Стойкость"],
      ["Presence", "Присутствие"],
    ],
  },

  // ── Sabbat Clans ──
  {
    clanPatterns: ["Lasombra", "Ласомбра"],
    disciplinePatterns: [
      ["Dominate", "Доминирование"],
      ["Obtenebration", "Власть над Тенью"],
      ["Potence", "Могущество"],
    ],
  },
  {
    clanPatterns: ["Tzimisce", "Цимисх"],
    disciplinePatterns: [
      ["Animalism", "Анимализм"],
      ["Auspex", "Ясновидение"],
      ["Vicissitude", "Изменчивость"],
    ],
  },

  // ── Independent Clans ──
  {
    clanPatterns: ["Assamite", "Ассамит"],
    disciplinePatterns: [
      ["Celerity", "Стремительность"],
      ["Obfuscate", "Затемнение"],
      ["Quietus", "Смертоносность"],
    ],
  },
  {
    clanPatterns: ["Followers of Set", "Последователи Сета", "Setite", "Сетит"],
    disciplinePatterns: [
      ["Obfuscate", "Затемнение"],
      ["Presence", "Присутствие"],
      ["Serpentis", "Серпентис"],
    ],
  },
  {
    clanPatterns: ["Giovanni", "Джованни"],
    disciplinePatterns: [
      ["Dominate", "Доминирование"],
      ["Necromancy", "Некромантия"],
      ["Potence", "Могущество"],
    ],
  },
  {
    clanPatterns: ["Ravnos", "Равнос"],
    disciplinePatterns: [
      ["Animalism", "Анимализм"],
      ["Chimerstry", "Химерия"],
      ["Fortitude", "Стойкость"],
    ],
  },

  // ── Key Bloodlines ──
  {
    clanPatterns: ["Baali", "Баали"],
    disciplinePatterns: [
      ["Daimonion", "Демонизм"],
      ["Obfuscate", "Затемнение"],
      ["Presence", "Присутствие"],
    ],
  },
  {
    clanPatterns: ["Daughters of Cacophony", "Дочери Какофонии"],
    disciplinePatterns: [
      ["Fortitude", "Стойкость"],
      ["Melpominee", "Мельпомения"],
      ["Presence", "Присутствие"],
    ],
  },
  {
    clanPatterns: ["Gargoyle", "Горгуль"],
    disciplinePatterns: [
      ["Fortitude", "Стойкость"],
      ["Potence", "Могущество"],
      ["Visceratika", "Висцератика"],
    ],
  },
  {
    clanPatterns: ["Kiasyd", "Киасид"],
    disciplinePatterns: [
      ["Dominate", "Доминирование"],
      ["Mytherceria", "Мистерия"],
      ["Obtenebration", "Власть над Тенью"],
    ],
  },
  {
    clanPatterns: ["Salubri", "Салюбри"],
    disciplinePatterns: [
      ["Auspex", "Ясновидение"],
      ["Fortitude", "Стойкость"],
      ["Obeah", "Обеа"],
    ],
  },
  {
    clanPatterns: ["Samedi", "Самеди"],
    disciplinePatterns: [
      ["Fortitude", "Стойкость"],
      ["Obfuscate", "Затемнение"],
      ["Thanatosis", "Танатозис"],
    ],
  },
  {
    clanPatterns: ["Cappadocian", "Каппадокий"],
    disciplinePatterns: [
      ["Auspex", "Ясновидение"],
      ["Fortitude", "Стойкость"],
      ["Necromancy", "Некромантия"],
    ],
  },
  {
    clanPatterns: ["True Brujah", "Истинные Бруха"],
    disciplinePatterns: [
      ["Potence", "Могущество"],
      ["Presence", "Присутствие"],
      ["Temporis", "Темпорис"],
    ],
  },
  {
    clanPatterns: ["Harbinger", "Предвестник"],
    disciplinePatterns: [
      ["Auspex", "Ясновидение"],
      ["Fortitude", "Стойкость"],
      ["Necromancy", "Некромантия"],
    ],
  },
  {
    clanPatterns: ["Nagaraja", "Нагараджа"],
    disciplinePatterns: [
      ["Auspex", "Ясновидение"],
      ["Dominate", "Доминирование"],
      ["Necromancy", "Некромантия"],
    ],
  },
];

/**
 * Find the clan-discipline mapping entry for a given clan name.
 */
function findClanEntry(clanName: string): ClanDisciplineEntry | undefined {
  const lower = clanName.toLowerCase();
  return CLAN_DISCIPLINES.find((entry) =>
    entry.clanPatterns.some((pattern) => lower.includes(pattern.toLowerCase())),
  );
}

/**
 * Find a discipline option string that matches a given discipline pattern.
 */
function findDisciplineInOptions(
  patterns: string[],
  options: string[],
): string | undefined {
  const optionsLower = options.map((o) => o.toLowerCase());
  for (const pattern of patterns) {
    const patternLower = pattern.toLowerCase();
    const idx = optionsLower.findIndex((o) => o.startsWith(patternLower));
    if (idx !== -1) return options[idx];
  }
  // Fallback: partial match
  for (const pattern of patterns) {
    const patternLower = pattern.toLowerCase();
    const idx = optionsLower.findIndex((o) => o.includes(patternLower));
    if (idx !== -1) return options[idx];
  }
  return undefined;
}

/**
 * Get the clan's in-clan discipline names, matched to the available dropdown options.
 * Returns the discipline name strings as they appear in the dropdown,
 * or undefined if the clan is not recognized.
 */
export function getClanDisciplines(
  clanName: string,
  disciplineOptions: string[] | OptionGroup[] | undefined,
): string[] | undefined {
  if (!clanName) return undefined;

  const entry = findClanEntry(clanName);
  if (!entry) return undefined;

  const flatOptions =
    disciplineOptions && Array.isArray(disciplineOptions)
      ? flattenOptions(disciplineOptions)
      : [];

  if (flatOptions.length === 0) {
    // Fallback: return the first pattern of each discipline
    return entry.disciplinePatterns.map((patterns) => patterns[0]);
  }

  const result: string[] = [];
  for (const patterns of entry.disciplinePatterns) {
    const match = findDisciplineInOptions(patterns, flatOptions);
    if (match) {
      result.push(match);
    } else {
      // Use first pattern as fallback
      result.push(patterns[0]);
    }
  }

  return result;
}
