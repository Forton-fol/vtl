/**
 * Section Registry — lighweight metadata ONLY.
 * No article content here → loader() is a dynamic import (Vite code-splits each chunk).
 * Memory stays low: only the selected section's chunk is loaded.
 */
import type { Section } from "./encyclopediaData";

export interface CategoryMeta {
  id: string;
  title: string;
  icon: string;
  description: string;
  articleCount: number;
}

export interface SectionMeta {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  categories: CategoryMeta[];
  loader: () => Promise<{ default: Section }>;
}

export const sectionRegistry: SectionMeta[] = [
  {
    id: "core",
    title: "Система Storyteller",
    subtitle: "Атрибуты, механики, боевая система, опыт",
    icon: "⚙",
    color: "#8b7355",
    categories: [
      { id: "core-attributes", title: "Атрибуты", icon: "💪", description: "Физические, социальные и ментальные атрибуты", articleCount: 3 },
      { id: "core-abilities", title: "Способности", icon: "🎓", description: "Таланты, навыки, знания — полный список", articleCount: 3 },
      { id: "core-combat", title: "Боевая система", icon: "⚔", description: "Правила боя, виды урона, оружие и броня", articleCount: 5 },
      { id: "core-char-creation", title: "Создание персонажа", icon: "📋", description: "Шаги создания, опыт, фрипи, backgrounds", articleCount: 4 },
    ],
    loader: () => import("./sections/sec-core"),
  },
  {
    id: "vtm-clans",
    title: "Кланы вампиров",
    subtitle: "Полные описания всех 13 кланов + линии крови",
    icon: "🧛",
    color: "#8b0000",
    categories: [
      { id: "cam-clans", title: "Кланы Камарильи", icon: "🏛", description: "7 основных кланов Камарильи с полными описаниями", articleCount: 7 },
      { id: "sab-clans", title: "Кланы Шабаша", icon: "⚔", description: "Ласомбра, Цимисхи и другие кланы Шабаша", articleCount: 5 },
      { id: "ind-clans", title: "Независимые кланы", icon: "🌙", description: "Ассамиты, Сеттиты, Джованни, Равнос, Каэниты", articleCount: 5 },
      { id: "bloodlines", title: "Линии крови", icon: "💎", description: "Горгульи, Салюбри, Самеди, Баали и другие", articleCount: 8 },
    ],
    loader: () => import("./sections/sec-vtm-clans"),
  },
  {
    id: "vtm-disc",
    title: "Дисциплины вампиров",
    subtitle: "Все дисциплины — каждый уровень с механикой",
    icon: "🔮",
    color: "#6a0080",
    categories: [
      { id: "disc-physical", title: "Физические дисциплины", icon: "💪", description: "Стремительность, Могущество, Стойкость — тело вампира", articleCount: 3 },
      { id: "disc-mental", title: "Ментальные дисциплины", icon: "🧠", description: "Прорицание, Доминирование, Присутствие", articleCount: 3 },
      { id: "disc-transform", title: "Трансформирующие", icon: "🐺", description: "Превращение, Изменчивость, Анимализм, Затемнение, Власть над тенью", articleCount: 5 },
      { id: "disc-blood-magic", title: "Кровавая магия", icon: "📖", description: "Тауматургия (пути + ритуалы), Некромантия, Колдовство", articleCount: 5 },
      { id: "disc-clan-unique", title: "Клановые и редкие", icon: "💎", description: "Химерия, Смертоносность, Серпентис, Темпорис, Помешательство и др.", articleCount: 10 },
    ],
    loader: () => import("./sections/sec-vtm-disc"),
  },
  {
    id: "vtm-sects",
    title: "Секты и политика",
    subtitle: "Камарилья, Шабаш, Анархи, Пути Просветления",
    icon: "🏰",
    color: "#4a1a00",
    categories: [
      { id: "sects-main", title: "Секты", icon: "🏴", description: "Камарилья, Шабаш, Анархи, Независимые, Инконню", articleCount: 6 },
      { id: "paths-enlightenment", title: "Пути Просветления", icon: "🕯", description: "Все 17 Путей — альтернативы Человечности", articleCount: 17 },
      { id: "lore-gehenna", title: "Лор: Геенна и история", icon: "📜", description: "Книга Ноддов, Каин, Праотцы, Политика кланов", articleCount: 5 },
    ],
    loader: () => import("./sections/sec-vtm-sects"),
  },
  {
    id: "vtm-systems",
    title: "Системы VtM",
    subtitle: "Натуры, Маски, Достоинства, Недостатки, Оружие",
    icon: "📚",
    color: "#1a3a5c",
    categories: [
      { id: "natures-masks", title: "Натуры и Маски", icon: "🎭", description: "Все 36 архетипов Натур и Масок с условиями восполнения Силы Воли", articleCount: 2 },
      { id: "merits-flaws", title: "Достоинства и Недостатки", icon: "⚖", description: "Физические, ментальные, социальные, сверхъестественные", articleCount: 4 },
      { id: "backgrounds", title: "Предпосылки (Backgrounds)", icon: "🌐", description: "Альтернативное питание, связи, ресурсы, стадо и прочее", articleCount: 1 },
      { id: "weapons-combat", title: "Оружие и броня", icon: "🗡", description: "Таблицы оружия ближнего боя, огнестрельного, метательного и брони", articleCount: 3 },
      { id: "supplements-vtm", title: "Дополнения VtM", icon: "📦", description: "Все книги линейки Vampire: The Masquerade", articleCount: 3 },
    ],
    loader: () => import("./sections/sec-vtm-systems"),
  },
  {
    id: "wta",
    title: "Оборотень: Апокалипсис",
    subtitle: "Гару, племена, аспекты, дары, обряды",
    icon: "🐺",
    color: "#1b5e20",
    categories: [
      { id: "wta-overview", title: "Мир Гару", icon: "🌍", description: "Умбра, Паттерн, Вирм, Ткач, Вейвер", articleCount: 4 },
      { id: "wta-breeds-asp", title: "Породы и Аспекты", icon: "🌕", description: "Хомид, Метис, Люпус × 5 Аспектов (Раговы)", articleCount: 8 },
      { id: "wta-tribes-detail", title: "Все 13 племён", icon: "🏕", description: "Полные описания каждого племени: история, тотем, культура", articleCount: 13 },
      { id: "wta-gifts", title: "Дары (Gifts)", icon: "🌿", description: "Каталог Даров по уровням и источникам", articleCount: 5 },
      { id: "wta-rites", title: "Обряды (Rites)", icon: "🔥", description: "Ритуалы Гару: Обряды Духа, Луны, Предков и др.", articleCount: 4 },
    ],
    loader: () => import("./sections/sec-wta"),
  },
  {
    id: "mta",
    title: "Маг: Вознесение",
    subtitle: "Сферы, Традиции, Техномантия, Парадокс",
    icon: "✨",
    color: "#4b0082",
    categories: [
      { id: "mta-spheres", title: "Девять Сфер", icon: "🔮", description: "Все 9 Сфер: каждый уровень с примерами эффектов", articleCount: 9 },
      { id: "mta-traditions", title: "Традиции", icon: "🌐", description: "9 Мистических Традиций — философия, академии, парадигма", articleCount: 9 },
      { id: "mta-technocracy", title: "Техномантия", icon: "⚙", description: "5 Конвенций Техномантии: Люди в Чёрном, НВО, Синдикат и др.", articleCount: 5 },
      { id: "mta-paradox", title: "Парадокс и Квинтэссенция", icon: "⚡", description: "Механика Парадокса, Тихий, Духи Парадокса, Узлы и Тасс", articleCount: 3 },
    ],
    loader: () => import("./sections/sec-mta"),
  },
  {
    id: "other-games",
    title: "Другие игры WoD",
    subtitle: "Охотник, Фэйри, Призрак, Демон, Куэй-дзин",
    icon: "🌑",
    color: "#333333",
    categories: [
      { id: "hunter", title: "Hunter: The Reckoning", icon: "🎯", description: "Кредо, Дары, организация Охотников", articleCount: 4 },
      { id: "changeling", title: "Changeling: The Dreaming", icon: "🍃", description: "Дворы, Кит-типы, Искусства, Реальности", articleCount: 4 },
      { id: "wraith", title: "Wraith: The Oblivion", icon: "👻", description: "Гильдии, Арканои, Тёмные Земли, Тень", articleCount: 4 },
      { id: "demon", title: "Demon: The Fallen", icon: "😈", description: "7 Домов Тьмы, 5 Фракций, Знания Падших", articleCount: 4 },
      { id: "kote", title: "Kindred of the East", icon: "🐉", description: "Дхармы Куэй-дзин, Искусства, Азиатская политика", articleCount: 4 },
      { id: "dark-ages", title: "Dark Ages / Victorian", icon: "⚔", description: "Тёмные и Викторианские Века, Дороги, отличия", articleCount: 3 },
    ],
    loader: () => import("./sections/sec-other"),
  },
];
