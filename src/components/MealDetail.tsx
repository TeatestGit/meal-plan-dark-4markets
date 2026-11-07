import type { CSSProperties } from "react";
import type { Meal, MarketKey } from "../types";
import { formatIngredientQuantity, type IngredientCost } from "../pricing";
import { testIds } from "../testIds";

type MealDetailProps = {
  selectedMeal: Meal;
  tab: "ingredients" | "steps" | "storage";
  activeStepIdx: number;
  shoppingSet: Set<string>;
  plannedMeals: Set<string>;
  selectedMarket: MarketKey;
  onTabChange: (tab: "ingredients" | "steps" | "storage") => void;
  onToggleIngredient: (index: number) => void;
  onAddMealToList: (meal: Meal) => void;
  onClearMealIngredients: (meal: Meal) => void;
  onSetActiveStepIdx: (idx: number) => void;
  onTogglePlanned: (id: string) => void;
  getIngredientPrice: (ingredient: string) => IngredientCost | null;
};

export function MealDetail({
  selectedMeal,
  tab,
  activeStepIdx,
  shoppingSet,
  plannedMeals,
  selectedMarket,
  onTabChange,
  onToggleIngredient,
  onAddMealToList,
  onClearMealIngredients,
  onSetActiveStepIdx,
  onTogglePlanned,
  getIngredientPrice,
}: MealDetailProps) {
  return (
    <div className="rounded-[20px] sm:rounded-[22px] bg-card border border-rim shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden min-w-0">
      <div className="p-2.5 sm:p-3 min-w-0">
        <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] bg-page overflow-hidden rounded-[18px] sm:rounded-[24px] min-w-0 border border-white/5">
          {selectedMeal.image ? (
            <img src={selectedMeal.image} alt={selectedMeal.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-page" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
          <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between gap-3 min-w-0">
            <div className="flex justify-between items-start gap-2 sm:gap-3 min-w-0 flex-wrap">
              <span className="bg-white/10 backdrop-blur-md border-white/20 text-white rounded-full px-3 sm:px-4 py-1.5 font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase border shadow-[0_8px_20px_rgba(0,0,0,0.18)] shrink-0">
                {selectedMeal.day}
              </span>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="bg-white/10 backdrop-blur-md border-white/20 text-white rounded-full px-3 sm:px-3.5 py-1.5 font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase border tabular">
                  {selectedMeal.time}
                </span>
                <span className="bg-ink-primary/90 backdrop-blur-md text-page border-white/20 rounded-full px-3 sm:px-3.5 py-1.5 font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase border tabular">
                  {selectedMeal.protein} · {selectedMeal.kcal}
                </span>
              </div>
            </div>
            <h2 id="hero-title" className="font-newsreader italic font-normal text-[30px] sm:text-[38px] lg:text-[44px] leading-[1.02] sm:leading-[0.98] tracking-[-0.03em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] max-w-[15ch] break-words text-balance" style={{ textWrap: "balance" as CSSProperties["textWrap"] }}>
              {selectedMeal.title}
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center gap-2 border-t border-rim bg-page/60 min-w-0">
        {(["ingredients", "steps", "storage"] as const).map((t) => (
          <button
            key={t}
            type="button"
            data-testid={t === "ingredients" ? testIds.tabIngredients : t === "steps" ? testIds.tabSteps : testIds.tabStorage}
            onClick={() => onTabChange(t)}
            className={`h-[40px] sm:h-[32px] px-4 sm:px-4 rounded-full font-dm text-[11px] font-medium tracking-[0.12em] uppercase transition-all border tabular active:scale-[0.98] ${
              tab === t
                ? "bg-rim border-rim-hover text-ink-primary shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                : "bg-card border-rim text-ink-secondary hover:border-rim-hover hover:text-ink-primary"
            }`}
          >
            {t} {t === "ingredients" ? `· ${selectedMeal.ingredients.length}` : t === "steps" ? `· ${selectedMeal.steps.length}` : ""}
          </button>
        ))}
        <span data-testid={testIds.inListCount} className="ml-auto hidden sm:inline font-dm text-[11px] tracking-[0.12em] uppercase text-ink-muted tabular">
          {shoppingSet.size} in list
        </span>
      </div>

      <div className="px-4 sm:px-8 py-6 sm:py-8 min-w-0">
        {tab === "ingredients" && (
          <>
            <div className="flex items-baseline justify-between mb-5 sm:mb-6 gap-3 min-w-0">
              <h3 className="font-instrument text-[20px] sm:text-[22px] text-ink-primary">Ingredients</h3>
              <span data-testid={testIds.ingredientsSelectedCount} className="font-dm text-[11px] tracking-[0.12em] uppercase text-ink-muted tabular shrink-0">
                {selectedMeal.ingredients.filter((_, index) => shoppingSet.has(`${selectedMeal.id}:${index}`)).length}/{selectedMeal.ingredients.length} selected
              </span>
            </div>
            <div className="space-y-2.5">
              {selectedMeal.ingredients.map((ingredient, idx) => {
                const inList = shoppingSet.has(`${selectedMeal.id}:${idx}`);
                const priceInfo = getIngredientPrice(ingredient);
                const price = priceInfo?.prices[selectedMarket];
                const unit = priceInfo ? formatIngredientQuantity(priceInfo.quantity) : "price unavailable";

                return (
                  <button
                    key={`${ingredient}-${idx}`}
                    onClick={() => onToggleIngredient(idx)}
                    aria-label={ingredient}
                    data-testid={testIds.ingredientRow}
                    data-index={idx}
                    className={`w-full text-left flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-[16px] border transition-all min-h-[48px] sm:min-h-0 active:scale-[0.98] min-w-0 ${
                      inList
                        ? "bg-rim border-rim-hover text-ink-primary"
                        : "bg-card border-rim hover:bg-rim hover:border-rim-hover text-ink-secondary"
                    }`}
                  >
                    <span className={`mt-[2px] w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition ${
                      inList ? "bg-ink-primary border-ink-primary text-page" : "bg-page border-rim-hover text-transparent"
                    }`}>
                      <span className="text-[11px]">✓</span>
                    </span>
                    <span className={`font-dm text-[15px] sm:text-[14px] leading-[1.6] sm:leading-[1.8] break-words min-w-0 flex-1 ${inList ? "line-through decoration-ink-muted/60" : ""}`}>
                      {ingredient}
                    </span>
                    <span className="ml-auto pl-3 flex flex-col items-end shrink-0">
                      <span className={`font-dm text-[13px] tabular-nums font-medium ${inList ? "text-ink-primary" : "text-ink-secondary"}`}>
                        {price == null ? "N/A" : `AED ${price.toFixed(2)}`}
                      </span>
                      <span className="font-dm text-[10px] tracking-[0.06em] uppercase text-ink-muted tabular">{unit}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-2">
              <button data-testid={testIds.addMealBtn} onClick={() => onAddMealToList(selectedMeal)} className="h-[44px] sm:h-10 px-6 rounded-full bg-ink-primary text-page hover:bg-ink-cta font-dm text-[11px] font-medium tracking-[0.12em] uppercase shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition active:scale-[0.98] w-full sm:w-auto">
                Add meal to list
              </button>
              <button
                data-testid={testIds.clearMealBtn}
                onClick={() => onClearMealIngredients(selectedMeal)}
                className="h-[44px] sm:h-10 px-6 rounded-full bg-card border border-rim font-dm text-[11px] font-medium tracking-[0.12em] uppercase text-ink-secondary hover:bg-rim transition active:scale-[0.98] w-full sm:w-auto"
              >
                Clear
              </button>
            </div>
          </>
        )}

        {tab === "steps" && (
          <>
            <h3 className="font-instrument text-[20px] sm:text-[22px] text-ink-primary mb-5 sm:mb-6">Method</h3>
            <div className="space-y-3">
              {selectedMeal.steps.map((step, i) => {
                const active = i === activeStepIdx;
                return (
                  <button
                    key={`${step}-${i}`}
                    onClick={() => onSetActiveStepIdx(i)}
                    data-testid={testIds.stepRow}
                    data-step-index={i}
                    className={`w-full text-left flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-[18px] border transition-all min-h-[56px] sm:min-h-0 active:scale-[0.98] min-w-0 ${
                      active
                        ? "bg-rim border-rim-hover shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                        : "bg-card border-rim hover:bg-rim hover:border-rim-hover"
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-dm text-[11px] font-medium tracking-[0.08em] shrink-0 border tabular ${active ? "bg-ink-primary text-page border-ink-primary" : "bg-page border-rim text-ink-secondary"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-dm text-[15px] sm:text-[14px] leading-[1.6] sm:leading-[1.8] text-ink-secondary break-words min-w-0">{step}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {tab === "storage" && (
          <>
            <h3 className="font-instrument text-[20px] sm:text-[22px] text-ink-primary mb-5 sm:mb-6">Storage &amp; prep</h3>
            <div className="rounded-[18px] sm:rounded-[20px] bg-page border border-rim p-5 sm:p-8 min-w-0">
              <div data-testid={testIds.storageKeepLabel} className="font-newsreader italic text-[13px] text-ink-secondary mb-3">Keep</div>
              <div data-testid={testIds.storageText} className="font-dm text-[14px] leading-[1.7] sm:leading-[1.8] text-ink-secondary break-words">{selectedMeal.storage}</div>
              <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2 sm:gap-3">
                <div className="rounded-[14px] sm:rounded-[16px] bg-card border border-rim p-3 sm:p-4 min-w-0">
                  <div className="font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase text-ink-muted">Fridge</div>
                  <div className="font-dm text-[12px] sm:text-[13px] mt-2 text-ink-secondary leading-[1.6] break-words">3–4 days sealed glass</div>
                </div>
                <div className="rounded-[14px] sm:rounded-[16px] bg-card border border-rim p-3 sm:p-4 min-w-0">
                  <div className="font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase text-ink-muted">Lunchbox</div>
                  <div className="font-dm text-[12px] sm:text-[13px] mt-2 text-ink-secondary leading-[1.6] break-words">Ice pack · dress separate</div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 flex gap-3 sm:gap-4 rounded-[16px] sm:rounded-[18px] bg-card border border-rim p-3 sm:p-4 min-w-0">
              <div className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-[12px] sm:rounded-[14px] bg-page shrink-0 overflow-hidden border border-white/5">
                {(selectedMeal.thumbnail || selectedMeal.image) && <img src={selectedMeal.thumbnail || selectedMeal.image} alt="" loading="lazy" className="w-full h-full object-cover" />}
              </div>
              <div className="min-w-0">
                <div className="font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase text-ink-muted mb-1 sm:mb-1.5 break-words">
                  Prep tip · {selectedMeal.day}
                </div>
                <div className="font-instrument text-[15px] sm:text-[17px] leading-[1.2] tracking-[-0.02em] text-ink-primary break-words">
                  Batch grain base, roast protein, wash greens. Assemble in 5 min morning-of.
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="px-4 sm:px-8 h-[64px] sm:h-[68px] border-t border-rim bg-page/50 flex items-center justify-between gap-3 min-w-0">
        <button
          data-testid={testIds.markPlannedBtn}
          onClick={() => onTogglePlanned(selectedMeal.id)}
          className={`h-[36px] sm:h-[32px] px-3 sm:px-4 rounded-full font-dm text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase border transition tabular active:scale-[0.98] shrink-0 ${
            plannedMeals.has(selectedMeal.id)
              ? "bg-ink-primary border-ink-primary text-page"
              : "bg-card border-rim text-ink-secondary hover:border-rim-hover"
          }`}
        >
          {plannedMeals.has(selectedMeal.id) ? "✓ Planned" : "○ Mark planned"}
        </button>

        <button data-testid={testIds.addListFooterBtn} onClick={() => onAddMealToList(selectedMeal)} className="h-[36px] sm:h-[32px] px-4 rounded-full bg-rim border-rim-hover text-ink-secondary hover:bg-rim-hover border font-dm text-[11px] font-medium tracking-[0.12em] uppercase transition tabular active:scale-[0.98] shrink-0">+ List</button>
      </div>
    </div>
  );
}
