import type { Meal } from "../types";
import { testIds } from "../testIds";
import { MealSelector } from "./MealSelector";

type Stats = { totalKcal: number; totalProtein: number; totalTime: number };

type MealSidebarProps = {
  plan: string;
  week: 1 | 2;
  meals: Meal[];
  weekMeals: Meal[];
  mealTypePlural: string;
  stats: Stats;
  selectedMealId: string;
  onWeekChange: (week: 1 | 2) => void;
  onSelect: (id: string) => void;
};

export function MealSidebar({
  plan, week, meals, weekMeals, mealTypePlural, stats,
  selectedMealId, onWeekChange, onSelect,
}: MealSidebarProps) {
  return (
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

      <div className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between border-b border-rim min-w-0 gap-3">
        <div className="flex items-center bg-page rounded-full p-1 border border-rim shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          {[1, 2].map((weekNumber) => (
            <button
              key={weekNumber}
              type="button"
              data-testid={testIds.weekBtn(weekNumber as 1 | 2)}
              onClick={() => {
                onWeekChange(weekNumber as 1 | 2);
                const firstMeal = meals.find((meal) => meal.plan === plan && meal.week === weekNumber);
                if (firstMeal) onSelect(firstMeal.id);
              }}
              className={`h-[30px] px-4 rounded-full text-[11px] font-medium tracking-[0.12em] uppercase transition-all font-dm active:scale-[0.98] ${
                week === weekNumber
                  ? "bg-ink-primary text-page shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
            >
              W{weekNumber}
            </button>
          ))}
        </div>
        <span data-testid={testIds.weekMealCount} className="font-dm text-[11px] font-medium tracking-[0.12em] uppercase text-ink-secondary bg-page rounded-full px-3 py-1 border border-rim tabular shrink-0">{weekMeals.length} {mealTypePlural}</span>
      </div>

      <div className="flex md:hidden items-center justify-between px-6 pt-4 pb-1">
        <span className="font-dm text-[10px] tracking-[0.14em] uppercase text-ink-muted">Days</span>
        <span className="font-dm text-[10px] tracking-[0.14em] uppercase text-ink-secondary flex items-center gap-1">Swipe <span className="text-[12px]">→</span></span>
      </div>

      <div className="px-0 sm:px-0 pt-1 pb-3 sm:p-3 min-w-0 overflow-hidden max-w-full w-full">
        <MealSelector
          weekMeals={weekMeals}
          selectedMealId={selectedMealId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
