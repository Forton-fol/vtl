/**
 * Clan-specific build recommendations for the randomizer.
 * Based on standard VtM V20 clan archetypes and rulebook suggestions.
 *
 * Attribute priority: "physical" | "social" | "mental" — order from primary to tertiary.
 * Ability priority: "talents" | "skills" | "knowledges" — order from primary to tertiary.
 *
 * focusAttributes: attributes that should get more dots within their group.
 * zeroAttributes: attributes forced to 0 (e.g. Nosferatu's Appearance).
 */

export interface ClanBuildRecommendation {
  /** Attribute group priority order [primary, secondary, tertiary] */
  attributePriority: readonly string[];
  /** Ability group priority order [primary, secondary, tertiary] */
  abilityPriority: readonly string[];
  /** Attributes to favor when distributing dots */
  focusAttributes?: readonly string[];
  /** Attributes forced to 0 (e.g. Nosferatu Appearance) */
  zeroAttributes?: readonly string[];
  /** Background name substrings that are thematic for the clan (EN+RU) */
  preferredBackgrounds?: readonly string[];
}

/**
 * Recommendations keyed by clan name substring (case-insensitive match).
 * Uses the same matching as clanDisciplines — English clan name prefix.
 */
export const CLAN_RECOMMENDATIONS: { patterns: string[]; rec: ClanBuildRecommendation }[] = [
  // ── Camarilla ──
  {
    // Brujah — Physical fighters, streetwise rabble
    patterns: ["Brujah", "Бруха"],
    rec: {
      attributePriority: ["physical", "social", "mental"],
      abilityPriority: ["talents", "skills", "knowledges"],
      focusAttributes: ["strength", "stamina", "charisma"],
      preferredBackgrounds: ["Allies", "Союзники", "Contacts", "Контакты", "Status", "Статус", "Herd", "Стадо"],
    },
  },
  {
    // Gangrel — Survivalist predators
    patterns: ["Gangrel", "Гангрел"],
    rec: {
      attributePriority: ["physical", "mental", "social"],
      abilityPriority: ["skills", "talents", "knowledges"],
      focusAttributes: ["stamina", "dexterity", "perception"],
      preferredBackgrounds: ["Allies", "Союзники", "Mentor", "Ментор", "Herd", "Стадо"],
    },
  },
  {
    // Malkavian — Insightful seers
    patterns: ["Malkavian", "Малкавиан"],
    rec: {
      attributePriority: ["mental", "social", "physical"],
      abilityPriority: ["knowledges", "talents", "skills"],
      focusAttributes: ["perception", "intelligence", "manipulation"],
      preferredBackgrounds: ["Contacts", "Контакты", "Mentor", "Ментор", "Resources", "Ресурсы"],
    },
  },
  {
    // Nosferatu — Stealthy information brokers, Appearance always 0
    patterns: ["Nosferatu", "Носферату"],
    rec: {
      attributePriority: ["physical", "mental", "social"],
      abilityPriority: ["skills", "knowledges", "talents"],
      focusAttributes: ["strength", "stamina", "perception"],
      zeroAttributes: ["appearance"],
      preferredBackgrounds: ["Allies", "Союзники", "Contacts", "Контакты", "Herd", "Стадо", "Information", "Информ"],
    },
  },
  {
    // Toreador — Social artists
    patterns: ["Toreador", "Тореадор"],
    rec: {
      attributePriority: ["social", "mental", "physical"],
      abilityPriority: ["talents", "skills", "knowledges"],
      focusAttributes: ["charisma", "appearance", "perception"],
      preferredBackgrounds: ["Resources", "Ресурсы", "Fame", "Слава", "Herd", "Стадо", "Contacts", "Контакты"],
    },
  },
  {
    // Tremere — Scholarly sorcerers
    patterns: ["Tremere", "Тремер"],
    rec: {
      attributePriority: ["mental", "social", "physical"],
      abilityPriority: ["knowledges", "talents", "skills"],
      focusAttributes: ["intelligence", "wits", "manipulation"],
      preferredBackgrounds: ["Mentor", "Ментор", "Resources", "Ресурсы", "Library", "Библиотек"],
    },
  },
  {
    // Ventrue — Commanding leaders
    patterns: ["Ventrue", "Вентру"],
    rec: {
      attributePriority: ["social", "mental", "physical"],
      abilityPriority: ["knowledges", "talents", "skills"],
      focusAttributes: ["charisma", "manipulation", "intelligence"],
      preferredBackgrounds: ["Influence", "Влияние", "Resources", "Ресурсы", "Status", "Статус", "Domain", "Домен", "Herd", "Стадо"],
    },
  },

  // ── Sabbat ──
  {
    // Lasombra — Dominant shadow lords
    patterns: ["Lasombra", "Ласомбра"],
    rec: {
      attributePriority: ["social", "mental", "physical"],
      abilityPriority: ["knowledges", "talents", "skills"],
      focusAttributes: ["manipulation", "charisma", "intelligence"],
      preferredBackgrounds: ["Resources", "Ресурсы", "Influence", "Влияние", "Status", "Статус", "Retainers", "Слуги"],
    },
  },
  {
    // Tzimisce — Scholarly flesh-crafters
    patterns: ["Tzimisce", "Цимисх"],
    rec: {
      attributePriority: ["mental", "physical", "social"],
      abilityPriority: ["knowledges", "skills", "talents"],
      focusAttributes: ["intelligence", "manipulation", "stamina"],
      preferredBackgrounds: ["Resources", "Ресурсы", "Retainers", "Слуги", "Domain", "Домен", "Manor", "Поместье"],
    },
  },

  // ── Independents ──
  {
    // Assamite — Silent assassins
    patterns: ["Assamite", "Ассамит"],
    rec: {
      attributePriority: ["physical", "mental", "social"],
      abilityPriority: ["skills", "talents", "knowledges"],
      focusAttributes: ["dexterity", "perception", "wits"],
      preferredBackgrounds: ["Mentor", "Ментор", "Contacts", "Контакты", "Resources", "Ресурсы"],
    },
  },
  {
    // Followers of Set — Manipulative corrupters
    patterns: ["Followers of Set", "Последователи Сета", "Setite", "Сетит"],
    rec: {
      attributePriority: ["social", "mental", "physical"],
      abilityPriority: ["talents", "knowledges", "skills"],
      focusAttributes: ["manipulation", "charisma", "appearance"],
      preferredBackgrounds: ["Contacts", "Контакты", "Herd", "Стадо", "Retainers", "Слуги", "Influence", "Влияние"],
    },
  },
  {
    // Giovanni — Necromantic family
    patterns: ["Giovanni", "Джованни"],
    rec: {
      attributePriority: ["mental", "social", "physical"],
      abilityPriority: ["knowledges", "talents", "skills"],
      focusAttributes: ["intelligence", "manipulation", "perception"],
      preferredBackgrounds: ["Resources", "Ресурсы", "Allies", "Союзники", "Influence", "Влияние", "Contacts", "Контакты"],
    },
  },
  {
    // Ravnos — Trickster nomads
    patterns: ["Ravnos", "Равнос"],
    rec: {
      attributePriority: ["social", "physical", "mental"],
      abilityPriority: ["talents", "skills", "knowledges"],
      focusAttributes: ["manipulation", "charisma", "dexterity"],
      preferredBackgrounds: ["Allies", "Союзники", "Contacts", "Контакты", "Resources", "Ресурсы"],
    },
  },

  // ── Bloodlines ──
  {
    patterns: ["Baali", "Баали"],
    rec: {
      attributePriority: ["social", "mental", "physical"],
      abilityPriority: ["knowledges", "talents", "skills"],
      focusAttributes: ["manipulation", "intelligence", "charisma"],
      preferredBackgrounds: ["Contacts", "Контакты", "Herd", "Стадо", "Retainers", "Слуги"],
    },
  },
  {
    patterns: ["Daughters of Cacophony", "Дочери Какофонии"],
    rec: {
      attributePriority: ["social", "mental", "physical"],
      abilityPriority: ["talents", "skills", "knowledges"],
      focusAttributes: ["charisma", "appearance", "manipulation"],
      preferredBackgrounds: ["Fame", "Слава", "Resources", "Ресурсы", "Herd", "Стадо"],
    },
  },
  {
    patterns: ["Gargoyle", "Горгуль"],
    rec: {
      attributePriority: ["physical", "mental", "social"],
      abilityPriority: ["skills", "talents", "knowledges"],
      focusAttributes: ["strength", "stamina", "dexterity"],
      zeroAttributes: ["appearance"],
      preferredBackgrounds: ["Mentor", "Ментор", "Allies", "Союзники"],
    },
  },
  {
    patterns: ["Salubri", "Салюбри"],
    rec: {
      attributePriority: ["mental", "social", "physical"],
      abilityPriority: ["knowledges", "talents", "skills"],
      focusAttributes: ["perception", "intelligence", "charisma"],
      preferredBackgrounds: ["Mentor", "Ментор", "Allies", "Союзники", "Herd", "Стадо"],
    },
  },
  {
    patterns: ["Samedi", "Самеди"],
    rec: {
      attributePriority: ["physical", "mental", "social"],
      abilityPriority: ["skills", "knowledges", "talents"],
      focusAttributes: ["stamina", "dexterity", "perception"],
      zeroAttributes: ["appearance"],
      preferredBackgrounds: ["Contacts", "Контакты", "Mentor", "Ментор"],
    },
  },
  {
    patterns: ["Cappadocian", "Каппадокий"],
    rec: {
      attributePriority: ["mental", "social", "physical"],
      abilityPriority: ["knowledges", "talents", "skills"],
      focusAttributes: ["intelligence", "perception", "manipulation"],
      preferredBackgrounds: ["Resources", "Ресурсы", "Mentor", "Ментор", "Library", "Библиотек"],
    },
  },
];

/**
 * Find the build recommendation for a clan name.
 */
export function getClanRecommendation(
  clanName: string,
): ClanBuildRecommendation | undefined {
  if (!clanName) return undefined;
  const lower = clanName.toLowerCase();
  const entry = CLAN_RECOMMENDATIONS.find((e) =>
    e.patterns.some((p) => lower.includes(p.toLowerCase())),
  );
  return entry?.rec;
}
