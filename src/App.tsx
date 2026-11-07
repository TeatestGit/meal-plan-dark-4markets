import { useEffect, useMemo, useState } from "react";

import mealsData from "./assets/meals.json";
import { MealDetail } from "./components/MealDetail";
import { MealSelector } from "./components/MealSelector";
import { ShoppingListPanel } from "./components/ShoppingListPanel";
import type { Meal, MarketKey, MarketInfo, PricedItem } from "./types";
import { calculateIngredientCost, formatIngredientQuantity, parseIngredientQuantity } from "./pricing";
import { findPriceEntry } from "./data/prices";
import { testIds } from "./testIds";

const rawImages = import.meta.glob<{ default: string }>("./assets/*.webp", { eager: true });
const imageMap: Record<string, string> = Object.fromEntries(
  Object.entries(rawImages).map(([path, mod]) => [
    path.replace("./assets/", "").replace(".webp", ""),
    mod.default,
  ])
);

const rawThumbs = import.meta.glob<{ default: string }>("./assets/thumbs/*.jpg", { eager: true });
const thumbnailMap: Record<string, string> = Object.fromEntries(
  Object.entries(rawThumbs).map(([path, mod]) => [
    path.replace("./assets/thumbs/", "").replace(".jpg", ""),
    mod.default,
  ])
);

type RawMeal = Omit<Meal, "image" | "thumbnail">;

const meals: Meal[] = (mealsData as RawMeal[]).map((meal) => ({
  ...meal,
  image: imageMap[meal.id],
  thumbnail: thumbnailMap[meal.id],
}));

const marketPrices: Record<MarketKey, MarketInfo> = {
  carrefour: { name: "Carrefour",   color: "#0a4da1", logo: "C", delivery: "30-45 min", fee: "AED 7",  url: "https://www.carrefouruae.com" },
  lulu:      { name: "LuLu Hyper",  color: "#e30613", logo: "L", delivery: "45-60 min", fee: "AED 10", url: "https://www.luluhypermarket.com" },
  spinneys:  { name: "Spinneys",    color: "#006a4e", logo: "S", delivery: "25-40 min", fee: "AED 12", url: "https://www.spinneys.com" },
  geant:     { name: "Géant",       color: "#c41230", logo: "G", delivery: "40-55 min", fee: "AED 9",  url: "https://www.geantuae.com" },
};

const marketOrder: MarketKey[] = ["carrefour", "lulu", "spinneys", "geant"];

function parseKcal(value: string) {
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseProtein(value: string) {
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseTime(value: string) {
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function loadSet(key: string): Set<string> {
  try {
    const saved = localStorage.getItem(key);
    return saved ? new Set(JSON.parse(saved) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSet(key: string, value: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...value]));
  } catch { /* storage unavailable */ }
}

export default function App() {
  const [week, setWeek] = useState<1 | 2>(1);
  const [selectedId, setSelectedId] = useState<string>("w1-mon");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"ingredients" | "steps" | "storage" | "nutrition">("ingredients");
  const [shoppingSet, setShoppingSet] = useState<Set<string>>(() => loadSet("shopping-set"));
  const [plannedMeals, setPlannedMeals] = useState<Set<string>>(() => loadSet("planned-meals"));
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketKey>("carrefour");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => { saveSet("shopping-set", shoppingSet); }, [shoppingSet]);
  useEffect(() => { saveSet("planned-meals", plannedMeals); }, [plannedMeals]);

  const weekMeals = useMemo(() => {
    const base = meals.filter((meal) => meal.week === week);
    if (!search.trim()) return base;
    const query = search.toLowerCase();
    return base.filter(
      (meal) =>
        meal.title.toLowerCase().includes(query) ||
        meal.ingredients.join(" ").toLowerCase().includes(query) ||
        meal.day.toLowerCase().includes(query)
    );
  }, [week, search]);

  const selectedMeal = useMemo(
    () => meals.find((meal) => meal.id === selectedId) || weekMeals[0] || meals[0],
    [selectedId, weekMeals]
  );

  useEffect(() => {
    const exists = weekMeals.find((meal) => meal.id === selectedId);
    if (!exists && weekMeals.length) setSelectedId(weekMeals[0].id);
  }, [weekMeals, selectedId]);

  useEffect(() => {
    setActiveStepIdx(0);
    setTab("ingredients");
  }, [selectedId]);

  const stats = useMemo(() => {
    const wm = meals.filter((meal) => meal.week === week);
    const totalKcal = wm.reduce((sum, meal) => sum + parseKcal(meal.kcal), 0);
    const totalProtein = wm.reduce((sum, meal) => sum + parseProtein(meal.protein), 0);
    const totalTime = wm.reduce((sum, meal) => sum + parseTime(meal.time), 0);
    return {
      totalKcal,
      totalProtein: Math.round(totalProtein),
      totalTime,
      avgKcal: Math.round(totalKcal / wm.length),
      avgProtein: Math.round(totalProtein / wm.length),
      avgTime: Math.round(totalTime / wm.length),
    };
  }, [week]);

  const shoppingListItems = useMemo(() => {
    const grouped = new Map<string, PricedItem>();
    const rawAmounts = new Map<string, number>();

    for (const sourceId of shoppingSet) {
      const [mealId, indexText] = sourceId.split(":");
      const meal = meals.find((candidate) => candidate.id === mealId);
      const ingredient = meal?.ingredients[Number(indexText)];
      if (!ingredient) continue;

      const found = findPriceEntry(ingredient);
      const cost = found ? calculateIngredientCost(ingredient, found.entry) : null;
      const qty = cost?.quantity ?? parseIngredientQuantity(ingredient);
      const groupId = cost && found ? `${found.key}:${cost.quantity.unit}` : sourceId;
      const current = grouped.get(groupId);

      if (!current) {
        grouped.set(groupId, {
          id: groupId,
          sourceIds: [sourceId],
          original: cost && found ? found.key : ingredient,
          unit: qty ? formatIngredientQuantity(qty) : "",
          prices: cost && found
            ? { unit: formatIngredientQuantity(cost.quantity), ...cost.prices }
            : null,
        });
        rawAmounts.set(groupId, cost ? cost.quantity.amount : 0);
        continue;
      }

      current.sourceIds.push(sourceId);
      if (cost && current.prices) {
        const amount = (rawAmounts.get(groupId) ?? 0) + cost.quantity.amount;
        rawAmounts.set(groupId, amount);
        current.unit = formatIngredientQuantity({ amount, unit: cost.quantity.unit });
        current.prices = {
          unit: current.unit,
          carrefour: current.prices.carrefour + cost.prices.carrefour,
          lulu:      current.prices.lulu      + cost.prices.lulu,
          spinneys:  current.prices.spinneys  + cost.prices.spinneys,
          geant:     current.prices.geant     + cost.prices.geant,
        };
      }
    }

    return Array.from(grouped.values());
  }, [shoppingSet]);

  const totalsPerMarket = useMemo(() => {
    const totals: Record<MarketKey, number> = { carrefour: 0, lulu: 0, spinneys: 0, geant: 0 };
    for (const item of shoppingListItems) {
      const p = item.prices;
      if (!p) continue;
      totals.carrefour += p.carrefour;
      totals.lulu      += p.lulu;
      totals.spinneys  += p.spinneys;
      totals.geant     += p.geant;
    }
    return totals;
  }, [shoppingListItems]);

  const cheapestMarket = useMemo(() => {
    let min: MarketKey = "carrefour";
    let minValue = Infinity;
    for (const key of marketOrder) {
      if (totalsPerMarket[key] < minValue) { minValue = totalsPerMarket[key]; min = key; }
    }
    return min;
  }, [totalsPerMarket]);

  const mostExpensive = useMemo(() => {
    let max: MarketKey = "spinneys";
    let maxValue = -Infinity;
    for (const key of marketOrder) {
      if (totalsPerMarket[key] > maxValue) { maxValue = totalsPerMarket[key]; max = key; }
    }
    return { key: max, val: maxValue };
  }, [totalsPerMarket]);

  const selectedTotal = totalsPerMarket[selectedMarket];
  const savings = mostExpensive.val - selectedTotal;

  const ingredientId = (meal: Meal, index: number) => `${meal.id}:${index}`;

  const toggleIngredientInList = (meal: Meal, index: number) => {
    const id = ingredientId(meal, index);
    setShoppingSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const addMealToList = (meal: Meal) => {
    setShoppingSet((prev) => {
      const next = new Set(prev);
      meal.ingredients.forEach((_, index) => next.add(ingredientId(meal, index)));
      return next;
    });
    setPlannedMeals((prev) => {
      const next = new Set(prev);
      next.add(meal.id);
      return next;
    });
  };

  const addWholeWeekToList = () => {
    const wm = meals.filter((meal) => meal.week === week);
    setShoppingSet((prev) => {
      const next = new Set(prev);
      wm.forEach((meal) => meal.ingredients.forEach((_, index) => next.add(ingredientId(meal, index))));
      return next;
    });
    setPlannedMeals((prev) => {
      const next = new Set(prev);
      wm.forEach((meal) => next.add(meal.id));
      return next;
    });
  };

  const addAllMealsToList = () => {
    setShoppingSet((prev) => {
      const next = new Set(prev);
      meals.forEach((meal) => meal.ingredients.forEach((_, index) => next.add(ingredientId(meal, index))));
      return next;
    });
    setPlannedMeals((prev) => {
      const next = new Set(prev);
      meals.forEach((meal) => next.add(meal.id));
      return next;
    });
  };

  const copyList = async () => {
    const text =
      `Shopping list — ${shoppingListItems.length} items — ${marketPrices[selectedMarket].name} AED ${selectedTotal.toFixed(2)}\n\n` +
      shoppingListItems.map((item) =>
        `· ${item.original} ${item.unit ? `(${item.unit})` : ""} — ${item.prices ? `AED ${item.prices[selectedMarket]}` : "price unavailable"}`
      ).join("\n") +
      `\n\nEstimated total for priced quantities at ${marketPrices[selectedMarket].name}: AED ${selectedTotal.toFixed(2)}` +
      (shoppingListItems.some((item) => !item.prices) ? "\nSome ingredients are excluded because no compatible price is available." : "");

    try {
      await navigator.clipboard.writeText(text);
      setCopyFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setCopyFailed(true);
      window.setTimeout(() => setCopyFailed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-page text-ink-primary antialiased selection:bg-rim selection:text-ink-primary overflow-x-hidden transition-colors duration-300">
      <div className="relative z-10 mx-auto max-w-[1460px] w-full px-4 sm:px-6 lg:px-10 min-w-0 overflow-hidden">
        <header className="pt-6 sm:pt-7 pb-5 sm:pb-6 flex flex-col gap-5 sm:gap-6 min-w-0">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between min-w-0">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-[40px] h-[40px] rounded-full bg-card border border-rim flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] shrink-0">
                <span className="font-instrument text-[16px] tracking-[-0.02em] text-ink-primary">2W</span>
              </div>
              <div className="hidden md:flex items-center gap-3 min-w-0">
                <span className="font-dm text-[11px] font-medium tracking-[0.18em] uppercase text-ink-secondary">Editorial Lunch Series</span>
                <span className="w-px h-4 bg-rim" />
                <span className="font-newsreader italic text-[14px] text-ink-muted">Kinfolk / Cereal · Dubai AED</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto min-w-0">
              <div className="flex gap-2 w-full sm:w-auto items-center">
                <div className="flex items-center bg-card rounded-full p-1 border border-rim shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex-1 sm:flex-none justify-center">
                  {[1, 2].map((weekNumber) => (
                    <button
                      key={weekNumber}
                      type="button"
                      data-testid={testIds.weekBtn(weekNumber as 1 | 2)}
                      onClick={() => {
                        setWeek(weekNumber as 1 | 2);
                        const firstMeal = meals.find((meal) => meal.week === weekNumber);
                        if (firstMeal) setSelectedId(firstMeal.id);
                        setTab("ingredients");
                        setActiveStepIdx(0);
                      }}
                      className={`flex-1 sm:flex-none h-[36px] sm:h-[32px] px-5 rounded-full text-[11px] font-medium tracking-[0.12em] uppercase transition-all font-dm active:scale-[0.98] ${
                        week === weekNumber
                          ? "bg-ink-primary text-page shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                          : "bg-rim text-ink-secondary hover:text-ink-primary"
                      }`}
                    >
                      Week {weekNumber}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full sm:w-[240px] min-w-0">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search lunches, ingredients…"
                  data-testid={testIds.searchInput}
                  className="h-[44px] sm:h-[36px] w-full rounded-full bg-card border border-rim px-5 sm:px-4 pr-10 text-[15px] sm:text-[13px] font-dm text-ink-primary placeholder:text-ink-muted focus:border-rim-hover focus:outline-none shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition min-w-0"
                />
                <span className="absolute right-4 sm:right-3.5 top-1/2 -translate-y-1/2 text-[15px] sm:text-[13px] pointer-events-none text-ink-muted">⌕</span>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] sm:rounded-[24px] bg-card border border-rim shadow-[0_20px_50px_rgba(0,0,0,0.4)] px-6 sm:px-10 lg:px-12 py-8 sm:py-12 lg:py-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 lg:gap-12 min-w-0 overflow-hidden">
            <div className="max-w-[30ch] min-w-0">
              <div className="mb-4 sm:mb-6">
                <span className="font-dm text-[11px] font-medium tracking-[0.18em] uppercase text-ink-secondary break-words">Editorial Lunch Series · No Red Meat · Dubai Pricing</span>
              </div>
              <h1 className="font-newsreader italic font-normal text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] leading-[1.1] sm:leading-[1.02] lg:leading-[0.95] tracking-[-0.03em] text-ink-primary break-words">
                2-Week Lunch<br />Plan
              </h1>
              <div className="mt-4 sm:mt-5 flex items-center gap-3 flex-wrap">
                <span className="h-px w-8 bg-rim hidden sm:block" />
                <span className="font-newsreader italic text-[13px] sm:text-[14px] leading-[1.5] text-ink-muted break-words">
                  No Red Meat · 14 recipes · AED prices per market
                </span>
              </div>
            </div>

            <div className="lg:max-w-[42ch] flex flex-col gap-5 sm:gap-6 min-w-0">
              <p className="font-dm text-[14px] leading-[1.8] text-ink-secondary break-words">
                14 no-red-meat lunches across 2 weeks, priced across four Dubai supermarkets. Build your shopping list, compare Carrefour, LuLu, Spinneys and Géant, and cook one week at a time.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                <span data-testid={testIds.statAvgKcal} className="inline-flex h-[28px] px-4 rounded-full bg-page border border-rim text-ink-secondary font-dm text-[11px] font-medium tracking-[0.08em] uppercase items-center tabular">Avg {stats.avgKcal} · {stats.totalKcal} kcal</span>
                <span data-testid={testIds.statAvgProtein} className="inline-flex h-[28px] px-4 rounded-full bg-page border border-rim text-ink-secondary font-dm text-[11px] font-medium tracking-[0.08em] uppercase items-center tabular">Avg {stats.avgProtein}g · {stats.totalProtein}g protein</span>
                <span data-testid={testIds.statTotalTime} className="inline-flex h-[28px] px-4 rounded-full bg-ink-primary text-page font-dm text-[11px] font-medium tracking-[0.08em] uppercase items-center tabular shadow-[0_6px_16px_rgba(0,0,0,0.25)]">Avg {stats.avgTime} · {stats.totalTime} min</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)_400px] gap-5 md:gap-6 lg:gap-8 pb-12 min-w-0 overflow-hidden max-w-full">
          <div className="min-w-0 order-1 md:order-1 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[20px] sm:rounded-[22px] bg-card border border-rim shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden min-w-0">
              <div data-testid={testIds.weekGlance} className="m-3 mb-0 rounded-[18px] bg-page border border-rim p-4 sm:p-5 min-w-0">
                <div className="font-newsreader italic text-[13px] text-ink-secondary mb-4 break-words">Week {week} glance — soft numbers</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-[14px] bg-card border border-rim p-3 sm:p-3.5 text-center min-w-0">
                    <div className="font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase text-ink-muted">kcal</div>
                    <div data-testid={testIds.weekGlanceKcal} className="font-newsreader text-[16px] sm:text-[18px] text-ink-primary mt-1 tabular break-words">{stats.totalKcal}</div>
                  </div>
                  <div className="rounded-[14px] bg-card border border-rim p-3 sm:p-3.5 text-center min-w-0">
                    <div className="font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase text-ink-muted">protein</div>
                    <div data-testid={testIds.weekGlanceProtein} className="font-newsreader text-[16px] sm:text-[18px] text-ink-primary mt-1 tabular break-words">{stats.totalProtein}g</div>
                  </div>
                  <div className="rounded-[14px] bg-card border border-rim p-3 sm:p-3.5 text-center min-w-0">
                    <div className="font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase text-ink-muted">time</div>
                    <div data-testid={testIds.weekGlanceTime} className="font-newsreader text-[16px] sm:text-[18px] text-ink-primary mt-1 tabular whitespace-nowrap">{stats.totalTime}m</div>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-5 sm:py-7 flex items-center justify-between border-b border-rim min-w-0">
                <span className="font-instrument text-[18px] text-ink-primary tracking-[-0.02em]">Week {week}</span>
                <span data-testid={testIds.weekMealCount} className="font-dm text-[11px] font-medium tracking-[0.12em] uppercase text-ink-secondary bg-page rounded-full px-3 py-1 border border-rim tabular shrink-0">{weekMeals.length} lunches</span>
              </div>

              <div className="flex md:hidden items-center justify-between px-6 pt-4 pb-1">
                <span className="font-dm text-[10px] tracking-[0.14em] uppercase text-ink-muted">Days</span>
                <span className="font-dm text-[10px] tracking-[0.14em] uppercase text-ink-secondary flex items-center gap-1">Swipe <span className="text-[12px]">→</span></span>
              </div>

              <div className="px-0 sm:px-0 pt-1 pb-3 sm:p-3 min-w-0 overflow-hidden max-w-full w-full">
                <MealSelector
                  weekMeals={weekMeals}
                  selectedMealId={selectedMeal.id}
                  plannedMeals={plannedMeals}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setTab("ingredients");
                    setActiveStepIdx(0);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 order-2 md:order-2">
            {weekMeals.length === 0 ? (
              <div role="status" data-testid={testIds.noResults} className="rounded-[20px] bg-card border border-rim p-8 font-dm text-[14px] text-ink-secondary">
                No lunches match "{search}".
              </div>
            ) : (
              <MealDetail
                selectedMeal={selectedMeal}
                tab={tab}
                activeStepIdx={activeStepIdx}
                shoppingSet={shoppingSet}
                plannedMeals={plannedMeals}
                selectedMarket={selectedMarket}
                onTabChange={setTab}
                onToggleIngredient={(index) => toggleIngredientInList(selectedMeal, index)}
                onAddMealToList={addMealToList}
                onClearMealIngredients={(meal) => {
                  setShoppingSet((prev) => {
                    const next = new Set(prev);
                    meal.ingredients.forEach((_, index) => next.delete(ingredientId(meal, index)));
                    return next;
                  });
                }}
                onSetActiveStepIdx={setActiveStepIdx}
                onTogglePlanned={(id) => {
                  setPlannedMeals((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id); else next.add(id);
                    return next;
                  });
                }}
                getIngredientPrice={(ingredient) => {
                  const found = findPriceEntry(ingredient);
                  return found ? calculateIngredientCost(ingredient, found.entry) : null;
                }}
              />
            )}
          </div>

          <div className="min-w-0 order-3 md:col-span-2 lg:col-span-1 lg:sticky lg:top-6 lg:self-start">
            <ShoppingListPanel
              pricedItems={shoppingListItems}
              selectedMarket={selectedMarket}
              marketOrder={marketOrder}
              marketPrices={marketPrices}
              totalsPerMarket={totalsPerMarket}
              cheapestMarket={cheapestMarket}
              selectedTotal={selectedTotal}
              savings={savings}
              mostExpensive={mostExpensive}
              hoveredItem={hoveredItem}
              onSelectMarket={setSelectedMarket}
              onAddWholeWeek={addWholeWeekToList}
              onAddAllMeals={addAllMealsToList}
              onCopyList={() => { void copyList(); }}
              onHoverItem={setHoveredItem}
              onRemoveItem={(item) => {
                setShoppingSet((prev) => {
                  const next = new Set(prev);
                  item.sourceIds.forEach((sourceId) => next.delete(sourceId));
                  return next;
                });
              }}
              onClearList={() => setShoppingSet(new Set())}
              copied={copied}
              copyFailed={copyFailed}
            />
          </div>
        </div>

        <footer className="pb-10 pt-2 flex flex-col sm:flex-row justify-between gap-3 font-dm text-[11px] tracking-[0.12em] uppercase text-ink-muted min-w-0 overflow-hidden">
          <span className="break-words">© 2026 · Dubai AED · Prices: Sep 2026</span>
          <span className="break-words">No Red Meat · 14 Recipes · 2-Week Plan</span>
        </footer>
      </div>
    </div>
  );
}
