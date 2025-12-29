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

// Кредо (Creed)
export const creedOptionsRu = [
  "Защита",
  "Мученичество",
  "Мщение",
  "Невинность",
  "Прозрение",
  "Спасение",
  "Интуиция",
  "Суд",
];

export const creedOptionsEn = [
  "Defense",
  "Martyrdom",
  "Vengeance",
  "Innocence",
  "Vision",
  "Redemption",
  "Intuition",
  "Judgment",
];

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

// Кредо для Граней (Edge Creeds)
export const edgeCreedOptionsRu = [
  "Милосердие",
  "Невинность",
  "Мученичество",
  "Спасение",
  "Прозрение",
  "Провидение",
  "Рвение",
  "Защита",
  "Суд",
  "Мщение",
];

export const edgeCreedOptionsEn = [
  "Mercy",
  "Innocence",
  "Martyrdom",
  "Redemption",
  "Vision",
  "Providence",
  "Zeal",
  "Defense",
  "Judgment",
  "Vengeance",
];

// Названия Граней по кредо (Edge Names by Creed)
export const edgeNamesRu: Record<string, string[]> = {
  "Милосердие": ["Невинность", "Укрытие", "Озарение", "Противостояние", "Вспышка"],
  "Невинность": ["Невинность", "Укрытие", "Озарение", "Противостояние", "Вспышка"],
  "Мученичество": ["Нужда", "Свидетельствование", "Опустошение", "Пожертвование", "Возврат"],
  "Спасение": ["Уверение", "Умиротворение", "Успокаивание", "Отстранение"],
  "Прозрение": ["Провидение", "Выявление", "Погружение", "Восстание", "Ожидание"],
  "Провидение": ["Провидение", "Выявление", "Погружение", "Восстание", "Ожидание"],
  "Рвение": ["Защита", "Ограждение", "Обеление", "Защита", "Ожог"],
  "Защита": ["Защита", "Ограждение", "Обеление", "Защита", "Ожог"],
  "Суд": ["Распознание", "Время", "Баланс", "Пронзание", "Раскрытие"],
  "Мщение": ["Рассечение", "След", "Чад", "Всплеск"],
};

export const edgeNamesEn: Record<string, string[]> = {
  "Mercy": ["Innocence", "Shelter", "Illumination", "Resistance", "Flare"],
  "Innocence": ["Innocence", "Shelter", "Illumination", "Resistance", "Flare"],
  "Martyrdom": ["Demand", "Witness", "Ravage", "Donate", "Return"],
  "Redemption": ["Convinced", "Calm", "Placate", "Sequester"],
  "Vision": ["Foresee", "Pinpoint", "Delve", "Restore", "Suspend"],
  "Providence": ["Foresee", "Pinpoint", "Delve", "Restore", "Suspend"],
  "Zeal": ["Ward", "Rejuvenate", "Cleanse", "Brand", "Champion"],
  "Defense": ["Ward", "Rejuvenate", "Cleanse", "Brand", "Champion"],
  "Judgment": ["Discern", "Burden", "Balance", "Pierce", "Expose"],
  "Vengeance": ["Cleave", "Trail", "Smolder", "Surge"],
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
