/**
 * World of Darkness Encyclopedia -- Type Definitions
 * All section data is now lazy-loaded via sectionRegistry.ts
 */

export interface TableRow {
  cells: string[];
}

export interface Table {
  headers: string[];
  rows: TableRow[];
}

export interface ArticleBlock {
  type: "text" | "table" | "list" | "subsection";
  heading?: string;
  content?: string;
  table?: Table;
  items?: string[];
  blocks?: ArticleBlock[];
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  tags?: string[];
  blocks: ArticleBlock[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  articles: Article[];
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  categories: Category[];
}