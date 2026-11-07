import type { Meal } from "../types";

type MealSelectorProps = {
  weekMeals: Meal[];
  selectedMealId: string;
  plannedMeals: Set<string>;
  onSelect: (id: string) => void;
};

export function MealSelector({ weekMeals, selectedMealId, plannedMeals, onSelect }: MealSelectorProps) {
  return (
    <div className="flex md:grid md:grid-cols-1 gap-3 overflow-x-auto md:overflow-x-visible md:overflow-y-auto md:max-h-[62vh] lg:max-h-none lg:overflow-visible pb-3 md:pb-0 snap-x snap-mandatory md:snap-none px-3 md:px-0 scrollbar-hide max-w-full w-full box-border">
      {weekMeals.map((meal) => {
        const isActive = meal.id === selectedMealId;
        const isPlanned = plannedMeals.has(meal.id);

        return (
          <button
            key={meal.id}
            type="button"
            data-testid="meal-card"
            data-meal-id={meal.id}
            aria-pressed={isActive}
            onClick={() => onSelect(meal.id)}
            className={`text-left rounded-[16px] p-2.5 flex gap-3.5 transition-all border min-w-[240px] w-[70vw] max-w-[280px] md:min-w-0 md:w-full md:max-w-none snap-start shrink-0 md:shrink active:scale-[0.98] min-w-0 ${
              isActive
                ? "bg-rim border-rim-hover shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                : "bg-card border-rim/60 md:border-transparent hover:bg-rim hover:border-rim"
            }`}
          >
            <div className="w-[64px] h-[64px] shrink-0 rounded-[14px] overflow-hidden bg-rim relative border border-white/5">
              {meal.thumbnail || meal.image ? (
                <img src={meal.thumbnail || meal.image} alt={meal.title} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-rim" />
              )}
              {isPlanned && (
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-ink-primary text-page flex items-center justify-center text-[10px]">✓</div>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5 text-left">
              <div className="flex items-center gap-2 mb-1 min-w-0">
                <span className="font-dm text-[11px] font-medium tracking-[0.12em] uppercase text-ink-muted">
                  {meal.day.split(" ")[0].slice(0, 3)}
                </span>
                <span className="w-px h-3 bg-rim" />
                <span className="font-dm text-[11px] font-medium tracking-[0.08em] uppercase text-ink-secondary tabular">
                  {meal.time}
                </span>
              </div>
              <div className="font-instrument text-[16px] sm:text-[17px] leading-[1.05] tracking-[-0.02em] text-ink-primary line-clamp-2 break-words">
                {meal.title}
              </div>
              <div className="mt-2 flex gap-1.5 flex-wrap">
                <span className="font-dm text-[10px] font-medium tracking-[0.08em] uppercase bg-rim border-rim-hover text-ink-secondary border rounded-full px-2 py-0.5 tabular">
                  {meal.kcal}
                </span>
                {isPlanned && (
                  <span className="font-dm text-[10px] font-medium tracking-[0.08em] uppercase bg-ink-primary text-page rounded-full px-2 py-0.5">
                    planned
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
