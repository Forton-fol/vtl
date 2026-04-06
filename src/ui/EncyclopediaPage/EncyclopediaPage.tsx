import React, { useState, useCallback, useEffect } from "react";
import "./EncyclopediaPage.css";
import type { Section, Category, Article, ArticleBlock } from "./encyclopediaData";
import { sectionRegistry, SectionMeta } from "./sectionRegistry";

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function renderBlock(block: ArticleBlock, idx: number): JSX.Element {
  switch (block.type) {
    case "text":
      return (
        <div key={idx} className="enc-block-text">
          {block.heading && <h4 className="enc-block-heading">{block.heading}</h4>}
          <p className="enc-block-p" dangerouslySetInnerHTML={{ __html: mdToHtml(block.content || "") }} />
        </div>
      );

    case "list":
      return (
        <div key={idx} className="enc-block-list">
          {block.heading && <h4 className="enc-block-heading">{block.heading}</h4>}
          <ul>
            {(block.items || []).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: mdToHtml(item) }} />
            ))}
          </ul>
        </div>
      );

    case "table":
      if (!block.table) return <div key={idx} />;
      return (
        <div key={idx} className="enc-block-table">
          {block.heading && <h4 className="enc-block-heading">{block.heading}</h4>}
          <div className="enc-table-wrap">
            <table>
              <thead>
                <tr>
                  {block.table.headers.map((h, i) => <th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {block.table.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.cells.map((cell, ci) => (
                      <td key={ci} dangerouslySetInnerHTML={{ __html: mdToHtml(cell) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "subsection":
      return (
        <div key={idx} className="enc-block-subsection">
          {block.heading && <h4 className="enc-block-heading">{block.heading}</h4>}
          {(block.blocks || []).map((b, i) => renderBlock(b, i))}
        </div>
      );

    default:
      return <div key={idx} />;
  }
}

/** Very small markdown → HTML: **bold**, \n → <br> */
function mdToHtml(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

// ────────────────────────────────────────────────────────────
// ArticleView
// ────────────────────────────────────────────────────────────

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

function ArticleView({ article, onBack }: ArticleViewProps): JSX.Element {
  return (
    <article className="enc-article">
      <button className="enc-back-btn" onClick={onBack}>← Назад</button>
      <header className="enc-article-header">
        <h2 className="enc-article-title">{article.title}</h2>
        {article.subtitle && <p className="enc-article-subtitle">{article.subtitle}</p>}
        {article.tags && article.tags.length > 0 && (
          <div className="enc-article-tags">
            {article.tags.map((t, i) => <span key={i} className="enc-tag">{t}</span>)}
          </div>
        )}
      </header>
      <div className="enc-article-body">
        {article.blocks.map((block, idx) => renderBlock(block, idx))}
      </div>
    </article>
  );
}

// ────────────────────────────────────────────────────────────
// CategoryCards
// ────────────────────────────────────────────────────────────

interface CategoryViewProps {
  category: Category;
  onSelectArticle: (a: Article) => void;
  onBack: () => void;
}

function CategoryView({ category, onSelectArticle, onBack }: CategoryViewProps): JSX.Element {
  return (
    <div className="enc-category-view">
      <button className="enc-back-btn" onClick={onBack}>← Назад</button>
      <header className="enc-cat-header">
        <span className="enc-cat-icon">{category.icon}</span>
        <h2 className="enc-cat-title">{category.title}</h2>
      </header>
      {category.description && (
        <p className="enc-cat-desc">{category.description}</p>
      )}
      <div className="enc-article-cards">
        {category.articles.map((article) => (
          <button
            key={article.id}
            className="enc-article-card"
            onClick={() => onSelectArticle(article)}
          >
            <div className="enc-article-card-title">{article.title}</div>
            {article.subtitle && (
              <div className="enc-article-card-sub">{article.subtitle}</div>
            )}
            {article.tags && article.tags.length > 0 && (
              <div className="enc-article-card-tags">
                {article.tags.slice(0, 3).map((t, i) => (
                  <span key={i} className="enc-tag-sm">{t}</span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SectionHome — карточки категорий
// ────────────────────────────────────────────────────────────

interface SectionHomeProps {
  section: Section;
  onSelectCategory: (c: Category) => void;
  onBack: () => void;
}

function SectionHome({ section, onSelectCategory, onBack }: SectionHomeProps): JSX.Element {
  return (
    <div className="enc-section-home">
      <button className="enc-back-btn" onClick={onBack}>← Главная</button>
      <header className="enc-section-header" style={{ borderColor: section.color }}>
        <span className="enc-section-icon">{section.icon}</span>
        <div>
          <h2 className="enc-section-title">{section.title}</h2>
          <p className="enc-section-subtitle">{section.subtitle}</p>
        </div>
      </header>
      <div className="enc-cat-cards">
        {section.categories.map((cat) => (
          <button
            key={cat.id}
            className="enc-cat-card"
            style={{ "--accent": section.color } as React.CSSProperties}
            onClick={() => onSelectCategory(cat)}
          >
            <span className="enc-cat-card-icon">{cat.icon}</span>
            <div className="enc-cat-card-body">
              <div className="enc-cat-card-title">{cat.title}</div>
              {cat.description && (
                <div className="enc-cat-card-desc">{cat.description}</div>
              )}
              <div className="enc-cat-card-count">{cat.articles.length} статей</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MainHome — стартовая страница
// ────────────────────────────────────────────────────────────

interface MainHomeProps {
  onSelectSection: (sectionId: string) => void;
}

function MainHome({ onSelectSection }: MainHomeProps): JSX.Element {
  return (
    <div className="enc-main-home">
      <div className="enc-main-hero">
        <h1 className="enc-main-title">
          <span className="enc-main-title-wod">World of Darkness</span>
          <span className="enc-main-title-enc">Энциклопедия</span>
        </h1>
        <p className="enc-main-desc">
          Структурированная база знаний по вселенной Мира Тьмы.
          Информация из официальных источников White Wolf — без сокращений, с оригинальной терминологией.
        </p>
      </div>
      <div className="enc-section-grid">
        {sectionRegistry.map((meta) => (
          <button
            key={meta.id}
            className="enc-section-card"
            style={{ "--accent": meta.color } as React.CSSProperties}
            onClick={() => onSelectSection(meta.id)}
          >
            <span className="enc-section-card-icon">{meta.icon}</span>
            <div className="enc-section-card-body">
              <div className="enc-section-card-title">{meta.title}</div>
              <div className="enc-section-card-sub">{meta.subtitle}</div>
              <div className="enc-section-card-stats">
                {meta.categories.length} разделов ·{" "}
                {meta.categories.reduce((sum, c) => sum + c.articleCount, 0)} статей
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="enc-sources">
        <h3>Источники</h3>
        <ul>
          <li><a href="https://whitewolf.fandom.com/wiki/Portal:World_of_Darkness" target="_blank" rel="noreferrer">whitewolf.fandom.com — Portal: World of Darkness</a></li>
          <li><a href="https://wod.fandom.com/ru/wiki/Мир_Тьмы_вики" target="_blank" rel="noreferrer">wod.fandom.com/ru — Мир Тьмы вики</a></li>
          <li><a href="https://wod.su/wod" target="_blank" rel="noreferrer">wod.su — WoD на русском</a></li>
        </ul>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Sidebar
// ────────────────────────────────────────────────────────────

interface SidebarProps {
  activeSectionId: string | null;
  activeCategoryId: string | null;
  activeArticleId: string | null;
  cache: Map<string, Section>;
  onSelectSection: (sectionId: string) => void;
  onSelectCategory: (sectionId: string, categoryId: string) => void;
  onSelectArticle: (sectionId: string, categoryId: string, articleId: string) => void;
  onGoHome: () => void;
}

function Sidebar({
  activeSectionId,
  activeCategoryId,
  activeArticleId,
  cache,
  onSelectSection,
  onSelectCategory,
  onSelectArticle,
  onGoHome,
}: SidebarProps): JSX.Element {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    activeSectionId ? new Set([activeSectionId]) : new Set()
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    activeCategoryId ? new Set([activeCategoryId]) : new Set()
  );

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleCategory(id: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <aside className="enc-sidebar">
      <button
        className={`enc-sidebar-home ${!activeSectionId ? "active" : ""}`}
        onClick={onGoHome}
      >
        🌑 Главная
      </button>
      <nav className="enc-sidebar-nav">
        {sectionRegistry.map((meta) => {
          const isActiveSection = activeSectionId === meta.id;
          const isExpanded = expandedSections.has(meta.id);
          const loadedSection = cache.get(meta.id);
          return (
            <div key={meta.id} className="enc-sb-section">
              <button
                className={`enc-sb-section-btn ${isActiveSection ? "active" : ""}`}
                style={{ "--accent": meta.color } as React.CSSProperties}
                onClick={() => {
                  toggleSection(meta.id);
                  onSelectSection(meta.id);
                }}
              >
                <span className="enc-sb-icon">{meta.icon}</span>
                <span className="enc-sb-title">{meta.title}</span>
                <span className="enc-sb-arrow">{isExpanded ? "▾" : "▸"}</span>
              </button>
              {isExpanded && (
                <div className="enc-sb-cats">
                  {(loadedSection ? loadedSection.categories : meta.categories).map((cat) => {
                    const catId = cat.id;
                    const isActiveCat = activeCategoryId === catId;
                    const isCatExpanded = expandedCategories.has(catId);
                    const articles = loadedSection
                      ? loadedSection.categories.find((c) => c.id === catId)?.articles ?? []
                      : [];
                    return (
                      <div key={catId} className="enc-sb-cat">
                        <button
                          className={`enc-sb-cat-btn ${isActiveCat ? "active" : ""}`}
                          onClick={() => {
                            toggleCategory(catId);
                            onSelectCategory(meta.id, catId);
                          }}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.title}</span>
                          <span className="enc-sb-arrow-sm">
                            {isCatExpanded ? "▾" : "▸"}
                          </span>
                        </button>
                        {isCatExpanded && articles.length > 0 && (
                          <div className="enc-sb-articles">
                            {articles.map((article) => (
                              <button
                                key={article.id}
                                className={`enc-sb-article-btn ${activeArticleId === article.id ? "active" : ""}`}
                                onClick={() => onSelectArticle(meta.id, catId, article.id)}
                              >
                                {article.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

// ────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────

type View =
  | { type: "home" }
  | { type: "section"; sectionId: string }
  | { type: "category"; sectionId: string; categoryId: string }
  | { type: "article"; sectionId: string; categoryId: string; articleId: string };

interface EncyclopediaPageProps {
  sidebarCollapsed?: boolean;
}

export function EncyclopediaPage({ sidebarCollapsed }: EncyclopediaPageProps): JSX.Element {
  const [view, setView] = useState<View>({ type: "home" });
  const [cache, setCache] = useState<Map<string, Section>>(new Map());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [sbCollapsed, setSbCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const ensureSection = useCallback(async (sectionId: string) => {
    if (cache.has(sectionId) || loadingIds.has(sectionId)) return;
    const meta = sectionRegistry.find((m) => m.id === sectionId);
    if (!meta) return;
    setLoadingIds((prev) => new Set(prev).add(sectionId));
    try {
      const mod = await meta.loader();
      setCache((prev) => new Map(prev).set(sectionId, mod.default));
    } finally {
      setLoadingIds((prev) => { const next = new Set(prev); next.delete(sectionId); return next; });
    }
  }, [cache, loadingIds]);

  // Derived from view
  const activeSectionId = view.type !== "home" ? view.sectionId : null;
  const activeCategoryId = (view.type === "category" || view.type === "article") ? view.categoryId : null;
  const activeArticleId = view.type === "article" ? view.articleId : null;

  const activeSectionMeta: SectionMeta | null = activeSectionId
    ? (sectionRegistry.find((m) => m.id === activeSectionId) ?? null)
    : null;
  const cachedSection: Section | null = activeSectionId ? (cache.get(activeSectionId) ?? null) : null;
  const activeCategory: Category | null =
    activeCategoryId && cachedSection
      ? (cachedSection.categories.find((c) => c.id === activeCategoryId) ?? null)
      : null;
  const activeArticle: Article | null =
    activeArticleId && activeCategory
      ? (activeCategory.articles.find((a) => a.id === activeArticleId) ?? null)
      : null;

  const isLoading = activeSectionId ? loadingIds.has(activeSectionId) : false;

  const goHome = useCallback(() => setView({ type: "home" }), []);

  const selectSection = useCallback((sectionId: string) => {
    setView({ type: "section", sectionId });
    setMobileNavOpen(false);
    ensureSection(sectionId);
  }, [ensureSection]);

  const selectCategory = useCallback(
    (sectionId: string, categoryId: string) => {
      setView({ type: "category", sectionId, categoryId });
      setMobileNavOpen(false);
      ensureSection(sectionId);
    },
    [ensureSection]
  );

  const selectArticle = useCallback(
    (sectionId: string, categoryId: string, articleId: string) => {
      setView({ type: "article", sectionId, categoryId, articleId });
      setMobileNavOpen(false);
    },
    []
  );

  function renderContent(): JSX.Element {
    switch (view.type) {
      case "home":
        return <MainHome onSelectSection={selectSection} />;

      case "section": {
        if (isLoading) return <div className="enc-loading">⏳ Загрузка…</div>;
        if (!cachedSection || !activeSectionMeta) return <div className="enc-loading">⏳ Загрузка…</div>;
        return (
          <SectionHome
            section={cachedSection}
            onSelectCategory={(c) =>
              setView({ type: "category", sectionId: view.sectionId, categoryId: c.id })
            }
            onBack={goHome}
          />
        );
      }

      case "category": {
        if (isLoading || !activeCategory) return <div className="enc-loading">⏳ Загрузка…</div>;
        return (
          <CategoryView
            category={activeCategory}
            onSelectArticle={(a) =>
              setView({ type: "article", sectionId: view.sectionId, categoryId: view.categoryId, articleId: a.id })
            }
            onBack={() => setView({ type: "section", sectionId: view.sectionId })}
          />
        );
      }

      case "article": {
        if (!activeArticle) return <div className="enc-loading">⏳ Загрузка…</div>;
        return (
          <ArticleView
            article={activeArticle}
            onBack={() =>
              setView({ type: "category", sectionId: view.sectionId, categoryId: view.categoryId })
            }
          />
        );
      }
    }
  }

  return (
    <div className={`enc-root ${sbCollapsed ? "sb-collapsed" : ""}`}>
      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div className="enc-mobile-overlay" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* Mobile nav toggle */}
      <button
        className="enc-mobile-nav-toggle"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        aria-label="Toggle navigation"
      >
        {mobileNavOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div className={`enc-sidebar-wrap ${mobileNavOpen ? "mobile-open" : ""}`}>
        <div className="enc-sidebar-collapse-btn-wrap">
          <button
            className="enc-collapse-btn"
            onClick={() => setSbCollapsed(!sbCollapsed)}
            title={sbCollapsed ? "Развернуть меню" : "Свернуть меню"}
          >
            {sbCollapsed ? "▶" : "◀"}
          </button>
        </div>
        {!sbCollapsed && (
          <Sidebar
            activeSectionId={activeSectionId}
            activeCategoryId={activeCategoryId}
            activeArticleId={activeArticleId}
            cache={cache}
            onSelectSection={selectSection}
            onSelectCategory={selectCategory}
            onSelectArticle={selectArticle}
            onGoHome={goHome}
          />
        )}
      </div>

      {/* Main content */}
      <main className="enc-content">
        {/* Breadcrumb */}
        <nav className="enc-breadcrumb">
          <button onClick={goHome}>Энциклопедия WoD</button>
          {activeSectionMeta && (
            <>
              <span className="enc-bc-sep">›</span>
              <button onClick={() => setView({ type: "section", sectionId: activeSectionMeta.id })}>
                {activeSectionMeta.icon} {activeSectionMeta.title}
              </button>
            </>
          )}
          {activeCategory && (
            <>
              <span className="enc-bc-sep">›</span>
              <button
                onClick={() =>
                  activeSectionId && setView({ type: "category", sectionId: activeSectionId, categoryId: activeCategory.id })
                }
              >
                {activeCategory.title}
              </button>
            </>
          )}
          {activeArticle && (
            <>
              <span className="enc-bc-sep">›</span>
              <span>{activeArticle.title}</span>
            </>
          )}
        </nav>

        <div className="enc-content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
