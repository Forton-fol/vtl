import { AbilitiesConfig } from "../../root/domain";
import { HTRAbilities } from "../domain";
import { CommonAbilities } from "../../generic/domain";

type AbilitiesT = keyof CommonAbilities | keyof HTRAbilities;

// Таланты (согласно PDF Hunter: The Reckoning)
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

// Навыки (согласно PDF Hunter: The Reckoning)
export const skillsArr: AbilitiesT[] = [
  "animalken",     // Знание животных
  "crafts",        // Ремесла
  "demolitions",   // Взрывчатка
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

// Знания (согласно PDF Hunter: The Reckoning)
export const knowledgesArr: AbilitiesT[] = [
  "academics",     // Академическая
  "bureaucracy",   // Бюрократия
  "computer",      // Компьютер
  "finance",       // Финансы
  "investigation", // Расследование
  "law",           // Закон
  "linguistics",   // Лингвистика
  "medicine",      // Медицина
  "occult",        // Оккультизм
  "politics",      // Политика
  "research",      // Поиск
  "science",       // Наука
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
