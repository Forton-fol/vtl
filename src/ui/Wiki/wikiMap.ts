// Lightweight mapping from section/item names to fandom pages.
// Values can be a single string (page name) or an array where the index corresponds
// to the dot index (0..max). If an array doesn't contain the requested index,
// the last element or the sanitized name is used as fallback.
export const wikiMap: Record<string, string | string[]> = {
  // per-dot mapping for 'Анимализм' (5 dots shown in the screenshot)
  // index 0..4 correspond to the dots; we keep an entry for index 0 as well
  // Use 1-based indexing for dot positions: array index corresponds to dot number (1..5).
  // We keep a placeholder at index 0 to make the mapping natural when RangeInput2
  // passes the numeric index attribute (which is 0..max). For disciplines the dots
  // are 1..5, so entry[1] -> first dot, entry[5] -> fifth dot.
  "Анимализм": [
    "Анимализм", // placeholder for index 0 (no dot)
    "Шепоты_зверя", // dot 1
    "Манок", // dot 2
    "Усмирение_зверя", // dot 3
    "Слияние_духа", // dot 4
    "Призвание_зверя", // dot 5
  ],
  // Бардо / Bardo per-dot mapping (1-based)
  "Бардо": [
    "Бардо", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/%D0%92%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%A7%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D1%87%D0%BD%D0%BE%D1%81%D1%82%D0%B8", // Восстановление Человечности
    "https://wod.fandom.com/ru/wiki/%D0%98%D0%B7%D0%B3%D0%BE%D0%BD%D1%8F%D1%8E%D1%89%D0%B8%D0%B9_%D0%B7%D0%BD%D0%B0%D0%BA_%D0%A2%D0%BE%D1%82%D0%B0", // Изгоняющий знак Тота
    "https://wod.fandom.com/ru/wiki/%D0%94%D0%B0%D1%80_%D0%90%D0%BF%D0%B8%D1%81%D0%B0", // Дар Аписа
    "https://wod.fandom.com/ru/wiki/%D0%A1%D1%82%D0%BE%D0%BB%D0%BF_%D0%9E%D1%81%D0%B8%D1%80%D0%B8%D1%81%D0%B0", // Столп Осириса
    "https://wod.fandom.com/ru/wiki/%D0%9F%D0%B0%D1%80%D0%B0%D0%B4%D0%BE%D0%BA%D1%81", // Парадокс
  ],
  // Валерен (Valeren) - per-dot entries (1-based). Using V20-focused names.
  "Валерен": [
    "Валерен", // placeholder index 0
    "Чувство жизни/смерти", // dot 1
    "Обезболивающее прикосновение", // dot 2
    "Обжигающее прикосновение", // dot 3
    "Погасить огонь", // dot 4
  "https://wod.fandom.com/ru/wiki/%D0%9C%D0%B5%D1%81%D1%82%D1%8C_%D0%A1%D0%B0%D0%BC%D0%B8%D0%BD%D1%8D%D0%BB%D1%8F", // dot 5 - Месть Самизэля (corrected)
  ],
  // Присутствие (Presence) - V20 per-dot links (1-based)
  "Присутствие": [
    "Присутствие", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/Благоговение", // dot 1 - Awe
    "https://wod.fandom.com/ru/wiki/Взгляд_ужаса", // dot 2 - Dread Gaze
    "https://wod.fandom.com/ru/wiki/Восторг", // dot 3 - Entrancement
    "https://wod.fandom.com/ru/wiki/Призыв", // dot 4 - Summon
    "https://wod.fandom.com/ru/wiki/Величие", // dot 5 - Majesty
  ],
  // Превращение (Protean) - per-dot mapping (1-based)
  "Превращение": [
    "Превращение", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/Глаза_зверя", // dot 1 - Eyes of the Beast
    "https://wod.fandom.com/ru/wiki/Когти_зверя", // dot 2 - Feral Claws
    "https://wod.fandom.com/ru/wiki/Слияние_с_землей", // dot 3 - Earth Meld
    "https://wod.fandom.com/ru/wiki/Облик_зверя", // dot 4 - Shape of the Beast
    "https://wod.fandom.com/ru/wiki/Форма_тумана", // dot 5 - Mist Form
  ],
  // Прорицание (Auspex) - per-dot V20 links (1-based)
  "Прорицание": [
    "Прорицание", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/Обостренные_чувства", // dot 1 - Heightened Senses
    "https://wod.fandom.com/ru/wiki/Восприятие_ауры", // dot 2 - Aura Perception
    "https://wod.fandom.com/ru/wiki/Прикосновение_духа", // dot 3 - The Spirit's Touch
    "https://wod.fandom.com/ru/wiki/Телепатия", // dot 4 - Telepathy
    "https://wod.fandom.com/ru/wiki/Духовная_проекция", // dot 5 - Psychic Projection
  ],
  // Доминирование (Dominate) - per-dot mapping (1-based)
  "Доминирование": [
    "Доминирование", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/Приказ", // dot 1 - Command
    "https://wod.fandom.com/ru/wiki/Гипноз", // dot 2 - Mesmerize
    "https://wod.fandom.com/ru/wiki/Забвение", // dot 3 - The Forgetful Mind
    "https://wod.fandom.com/ru/wiki/Промывка_мозгов", // dot 4 - Conditioning
    "https://wod.fandom.com/ru/wiki/Одержимость", // dot 5 - Possession
  ],
  // Затемнение (Obfuscate) - per-dot mapping (1-based), V20-focused
  "Затемнение": [
    "Затемнение", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/Покров_тени", // dot 1 - Cloak of Shadows
    "https://wod.fandom.com/ru/wiki/Незримое_присутствие", // dot 2 - Unseen Presence
    "https://wod.fandom.com/ru/wiki/Маска_тысячи_лиц", // dot 3 - Mask of a Thousand Faces
    "https://wod.fandom.com/ru/wiki/Уход_от_мысленного_взгляда", // dot 4 - Vanish from the Mind's Eye
    "https://wod.fandom.com/ru/wiki/Общий_покров", // dot 5 - Cloak the Gathering
  ],
  // Власть над Тенью (Obtenebration) - per-dot mapping (1-based)
  "Власть над Тенью": [
    "Власть над Тенью", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/Игра_теней", // dot 1 - Shadow Play
    "https://wod.fandom.com/ru/wiki/Покров_ночи", // dot 2 - Shroud of Night
    "https://wod.fandom.com/ru/wiki/Руки_Бездны", // dot 3 - Arms of the Abyss
    "https://wod.fandom.com/ru/wiki/Черный_метаморфоз", // dot 4 - Black Metamorphosis
    "https://wod.fandom.com/ru/wiki/Форма_мрака", // dot 5 - Tenebrous Form
  ],
  // Изменчивость (Vicissitude) - per-dot mapping (1-based), V20-focused
  "Изменчивость": [
    "Изменчивость", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/Текучий_облик", // dot 1 - Malleable Visage
    "https://wod.fandom.com/ru/wiki/Изменение_плоти", // dot 2 - Fleshcraft
    "https://wod.fandom.com/ru/wiki/Изменение_скелета", // dot 3 - Bone Craft
    "https://wod.fandom.com/ru/wiki/Образ_ужаса", // dot 4 - Horrid Form
    "https://wod.fandom.com/ru/wiki/Внутренняя_эссенция", // dot 5 - Inner Mastery
  ],
  // Серпентис (Serpentis) - per-dot mapping (1-based)
  "Серпентис": [
    "Серпентис", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/Глаза_змеи", // dot 1 - Eyes of the Serpent
    "https://wod.fandom.com/ru/wiki/Жало_гадюки", // dot 2 - Tongue of the Asp
    "https://wod.fandom.com/ru/wiki/Кожа_гадюки", // dot 3 - Skin of the Adder
    "https://wod.fandom.com/ru/wiki/Облик_кобры", // dot 4 - Form of the Cobra
    "https://wod.fandom.com/ru/wiki/Сердце_тьмы", // dot 5 - Heart of Darkness
  ],
  // Химерия (Chimerstry) - per-dot mapping (1-based), V20 entries
  "Химерия": [
    "Химерия", // placeholder index 0
    "https://wod.fandom.com/ru/wiki/Блуждающий_огонек", // dot 1 - Ignis Fatuus
    "https://wod.fandom.com/ru/wiki/Фата-моргана", // dot 2 - Fata Morgana
    "https://wod.fandom.com/ru/wiki/Видение", // dot 3 - Apparition
    "https://wod.fandom.com/ru/wiki/Постоянство", // dot 4 - Permanency
    "https://wod.fandom.com/ru/wiki/Кошмарная_реальность", // dot 5 - Horrid Reality
  ],

  // add more mappings here. Keys should match the exact string used in the
  // character name input (case-sensitive). You can also use pre-sanitized
  // keys with underscores if that's easier.
};

export default wikiMap;
