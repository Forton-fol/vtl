// Архетипы (Натура и Маска/Demeanor)
export const archetypeOptionsRu = [
  "Наркоман",
  "Архитектор",
  "Автократ",
  "Бонвиван",
  "Головорез",
  "Опекун",
  "Проповедник",
  "Дитя",
  "Конформист",
  "Повеса",
  "Биггот",
  "Директор",
  "Мечтатель",
  "Фанатик",
  "Щёголь",
  "Взрывник",
  "Идеалист",
  "Педагог",
  "Кающийся грешник",
  "Перфекционист",
  "Мятежник",
  "Плут",
  "Выживальщик",
  "Традиционалист",
  "Трикстер",
];

export const archetypeOptionsEn = [
  "Addict",
  "Architect",
  "Autocrat",
  "Bon Vivant",
  "Bravo",
  "Caregiver",
  "Celebrant",
  "Child",
  "Conformist",
  "Conniver",
  "Curmudgeon",
  "Director",
  "Dreamer",
  "Fanatic",
  "Gallant",
  "Hotshot",
  "Idealist",
  "Judge",
  "Loner",
  "Martyr",
  "Rebel",
  "Rogue",
  "Survivor",
  "Traditionalist",
  "Trickster",
];

// Грани (Edges) - основные категории
export const edgeOptionsRu = [
  "Милосердие",
  "Прозрение",
  "Рвение",
];

export const edgeOptionsEn = [
  "Mercy",
  "Vision",
  "Zeal",
];

// Кредо по Граням (Creeds by Edge)
export const creedByEdgeRu: Record<string, string[]> = {
  "Милосердие": ["Невинность", "Мученичество", "Спасение"],
  "Прозрение": ["Провидчество"],
  "Рвение": ["Защита", "Суд", "Мщение"],
};

export const creedByEdgeEn: Record<string, string[]> = {
  "Mercy": ["Innocence", "Martyrdom", "Redemption"],
  "Vision": ["Providence"],
  "Zeal": ["Defense", "Judgment", "Vengeance"],
};

// Начальные добродетели (Starting Virtues)
export const startingVirtueOptionsRu = [
  "Милосердие",
  "Прозрение",
  "Рвение",
];

export const startingVirtueOptionsEn = [
  "Mercy",
  "Vision",
  "Zeal",
];

// Названия способностей Граней по Кредо (Edge Power Names by Creed)
export const edgePowerNamesRu: Record<string, string[]> = {
  "Невинность": ["Укрытие", "Озарение", "Призыв", "Засада", "Вспышка"],
  "Мученичество": ["Нужда", "Свидетельствование", "Опустошение", "Пожертвование", "Возврат"],
  "Спасение": ["Уверение", "Умиротворение", "Успокаивание", "Отстранение", "Связь"],
  "Провидчество": ["Провидение", "Выявление", "Погружение", "Восстание", "Ожидание"],
  "Защита": ["Защита", "Ограждение", "Обеление", "Клеймо", "Чемпион"],
  "Суд": ["Распознание", "Бремя", "Баланс", "Пронзание", "Раскрытие"],
  "Мщение": ["Рассечение", "След", "Чад", "Всплеск", "Истребление"],
};

export const edgePowerNamesEn: Record<string, string[]> = {
  "Innocence": ["Shelter", "Illumination", "Summon", "Ambush", "Flare"],
  "Martyrdom": ["Demand", "Witness", "Ravage", "Donate", "Return"],
  "Redemption": ["Convinced", "Calm", "Placate", "Sequester", "Bond"],
  "Providence": ["Foresee", "Pinpoint", "Delve", "Restore", "Suspend"],
  "Defense": ["Ward", "Rejuvenate", "Cleanse", "Brand", "Champion"],
  "Judgment": ["Discern", "Burden", "Balance", "Pierce", "Expose"],
  "Vengeance": ["Cleave", "Trail", "Smolder", "Surge", "Destroy"],
};

// Дополнение (Backgrounds)
export const backgroundOptionsRu = [
  "Союзники",
  "Арсенал",
  "Свидетели",
  "Связи",
  "Судьба",
  "Контакт",
  "Слава",
  "Влияние",
  "Наставник",
  "Покровители",
  "Ресурсы",
];

export const backgroundOptionsEn = [
  "Allies",
  "Arsenal",
  "Bystanders",
  "Contacts",
  "Destiny",
  "Contact",
  "Fame",
  "Influence",
  "Mentor",
  "Patrons",
  "Resources",
];
