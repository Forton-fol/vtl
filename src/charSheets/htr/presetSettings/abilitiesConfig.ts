import { AbilitiesConfig } from "../../root/domain";
import { HTRAbilities } from "../domain";
import { CommonAbilities } from "../../generic/domain";

type AbilitiesT = keyof CommonAbilities | keyof HTRAbilities;

// Таланты
export const talentsArr: AbilitiesT[] = [
  "alertness",     // Бдительность
  "athletics",     // Атлетика
  "awareness",     // Осведомлённость
  "brawl",         // Драка
  "dodge",         // Уклонение
  "empathy",       // Эмпатия
  "expression",    // Экспрессия
  "intimidation",  // Запугивание
  "intuition",     // Интуиция
  "leadership",    // Лидерство
  "streetwise",    // Знание улиц
  "cunning",       // Хитрость
];

// Навыки
export const skillsArr: AbilitiesT[] = [
  "animalken",     // Знание животных
  "crafts",        // Ремесла
  "computer",      // Вычислитель
  "drive",         // Вождение
  "etiquette",     // Этикет
  "firearms",      // Стрельба
  "fencing",       // Фехтование
  "performance",   // Исполнение
  "security",      // Безопасность
  "stealth",       // Скрытность
  "survival",      // Выживание
  "technology",    // Технология
];

// Знания
export const knowledgesArr: AbilitiesT[] = [
  "academics",     // Академическая
  "computer",      // Компьютер
  "finance",       // Финансы
  "investigation", // Расследование
  "law",           // Закон
  "medicine",      // Медицина
  "occult",        // Оккультизм
  "politics",      // Политика
  "science",       // Наука
  "technology",    // Технология
];

export const abilitiesConfig: AbilitiesConfig = [
  {
    header: "talents",
    items: talentsArr,
    extension: "talent",
  },
  {
    header: "skills",
    items: skillsArr,
    extension: "skill",
  },
  {
    header: "knowledges",
    items: knowledgesArr,
    extension: "knowledge",
  },
];
