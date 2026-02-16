/**
 * Mapping of clan names to their in-clan disciplines.
 * Keys and values must match the display names used in the dropdown options
 * (from clansSource.ts and disciplinesSource.ts).
 *
 * Both Russian and English names are included so that the lookup works
 * regardless of the current UI language.
 */

type ClanDisciplineMap = Record<string, string[]>;

export const clanDisciplineMap: ClanDisciplineMap = {
  // ── English ────────────────────────────────────────────
  "Brujah":           ["Celerity", "Potence", "Presence"],
  "Gangrel":          ["Animalism", "Fortitude", "Protean"],
  "Malkavian":        ["Auspex", "Dementation", "Obfuscate"],
  "Nosferatu":        ["Animalism", "Potence", "Obfuscate"],
  "Toreador":         ["Celerity", "Auspex", "Presence"],
  "Tremere":          ["Dominate", "Auspex", "Thaumaturgy"],
  "Ventrue":          ["Dominate", "Fortitude", "Presence"],
  "Lasombra":         ["Dominate", "Potence", "Obtenebration"],
  "Tzimisce":         ["Animalism", "Auspex", "Vicissitude"],
  "Assamite":         ["Celerity", "Obfuscate", "Quietus"],
  "Followers of Set": ["Obfuscate", "Presence", "Serpentis"],
  "Giovanni":         ["Dominate", "Potence", "Necromancy"],
  "Ravnos":           ["Animalism", "Fortitude", "Chimerstry"],
  "Salubri":          ["Auspex", "Fortitude", "Valeren (Salubri)"],

  // ── Russian ────────────────────────────────────────────
  "Бруха":               ["Стремительность", "Могущество", "Присутствие"],
  "Гангрелы":            ["Анимализм", "Стойкость", "Превращение"],
  "Малкавиане":          ["Ясновидение", "Помешательство", "Затемнение"],
  "Носферату":           ["Анимализм", "Могущество", "Затемнение"],
  "Тореадор":            ["Стремительность", "Ясновидение", "Присутствие"],
  "Тремер":              ["Доминирование", "Ясновидение", "Тауматургия"],
  "Вентру":              ["Доминирование", "Стойкость", "Присутствие"],
  "Ласомбра":            ["Доминирование", "Могущество", "Власть над Тенью"],
  "Цимисхи":             ["Анимализм", "Ясновидение", "Изменчивость"],
  "Ассамиты":            ["Стремительность", "Затемнение", "Смертоносность"],
  "Последователи Сета":  ["Затемнение", "Присутствие", "Серпентис"],
  "Джованни":            ["Доминирование", "Могущество", "Некромантия"],
  "Равнос":              ["Анимализм", "Стойкость", "Химерия"],
  "Салюбри":             ["Ясновидение", "Стойкость", "Валерен"],
};
