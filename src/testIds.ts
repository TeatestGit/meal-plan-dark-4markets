export const testIds = {
  // Plan nav
  planBtn: (planId: string) => `plan-btn-${planId}`,

  // Week nav
  weekBtn: (n: 1 | 2) => `week-btn-${n}`,
  weekMealCount: "week-meal-count",

  // Search
  searchInput: "search-input",
  noResults: "no-results",

  // Stats bar
  statAvgKcal: "stat-avg-kcal",
  statAvgProtein: "stat-avg-protein",
  statTotalTime: "stat-total-time",

  // Week glance panel
  weekGlance: "week-glance",
  weekGlanceKcal: "week-glance-kcal",
  weekGlanceProtein: "week-glance-protein",
  weekGlanceTime: "week-glance-time",

  // Meal cards
  mealCard: "meal-card",

  // Meal detail tabs
  tabIngredients: "tab-ingredients",
  tabSteps: "tab-steps",
  tabStorage: "tab-storage",
  tabNutrition: "tab-nutrition",

  // Meal detail — ingredients
  ingredientRow: "ingredient-row",
  ingredientsSelectedCount: "ingredients-selected-count",
  inListCount: "in-list-count",
  addMealBtn: "add-meal-btn",
  clearMealBtn: "clear-meal-btn",
  addListFooterBtn: "add-list-footer-btn",
  markPlannedBtn: "mark-planned-btn",

  // Meal detail — steps
  stepRow: "step-row",

  // Meal detail — nutrition
  nutritionKcalPill: "nutrition-kcal-pill",

  // Meal detail — storage
  storageKeepLabel: "storage-keep-label",
  storageText: "storage-text",

  // Shopping list — controls
  actionRow: "action-row",
  addWeekBtn: "add-week-btn",
  addAllBtn: "add-all-btn",
  clearListBtn: "clear-list-btn",
  emptyState: "empty-state",
  itemCountBadge: "item-count-badge",

  // Shopping list — items
  listItem: "list-item",
  itemRemoveBtn: "item-remove-btn",
  comparePricesBtn: "compare-prices-btn",
  priceComparison: "price-comparison",

  // Markets
  marketPill: (mk: string) => `market-pill-${mk}`,
  marketCard: (mk: string) => `market-card-${mk}`,
  cheapestLabel: "cheapest-label",
  savingsBanner: "savings-banner",
  shopAtLink: "shop-at-link",
};
