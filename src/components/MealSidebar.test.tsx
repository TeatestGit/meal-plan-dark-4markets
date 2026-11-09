import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MealSidebar } from "./MealSidebar";
import type { Meal } from "../types";

const makeMeal = (id: string, week: 1 | 2): Meal => ({
  id, plan: "no-red-meat", week, day: `${id}`,
  title: `Meal ${id}`, time: "20 min",
  protein: "30g protein", kcal: "400 kcal",
  fat: "10g fat", carbs: "50g carbs",
  ingredients: ["item"], steps: ["step"], storage: "3 days",
});

const allMeals = [makeMeal("w1-mon", 1), makeMeal("w1-tue", 1), makeMeal("w2-mon", 2)];
const week1Meals = allMeals.filter((m) => m.week === 1);

const stats = { totalKcal: 800, totalProtein: 60, totalTime: 40 };

function renderSidebar(overrides: Partial<Parameters<typeof MealSidebar>[0]> = {}) {
  const defaults = {
    plan: "no-red-meat",
    week: 1 as const,
    meals: allMeals,
    weekMeals: week1Meals,
    mealTypePlural: "lunches",
    stats,
    plannedMeals: new Set<string>(),
    selectedMealId: "w1-mon",
    onWeekChange: vi.fn(),
    onSelect: vi.fn(),
  };
  return render(<MealSidebar {...defaults} {...overrides} />);
}

describe("MealSidebar", () => {
  it("renders the week-glance panel", () => {
    renderSidebar();
    expect(screen.getByTestId("week-glance")).toBeInTheDocument();
  });

  it("displays stats from props", () => {
    renderSidebar();
    expect(screen.getByTestId("week-glance-kcal")).toHaveTextContent("800");
    expect(screen.getByTestId("week-glance-protein")).toHaveTextContent("60g");
    expect(screen.getByTestId("week-glance-time")).toHaveTextContent("40m");
  });

  it("renders both week buttons", () => {
    renderSidebar();
    expect(screen.getByTestId("week-btn-1")).toBeInTheDocument();
    expect(screen.getByTestId("week-btn-2")).toBeInTheDocument();
  });

  it("active week button has the active class", () => {
    renderSidebar({ week: 1 });
    expect(screen.getByTestId("week-btn-1")).toHaveClass("bg-ink-primary");
    expect(screen.getByTestId("week-btn-2")).not.toHaveClass("bg-ink-primary");
  });

  it("calls onWeekChange and onSelect when week button clicked", () => {
    const onWeekChange = vi.fn();
    const onSelect = vi.fn();
    renderSidebar({ onWeekChange, onSelect });
    fireEvent.click(screen.getByTestId("week-btn-2"));
    expect(onWeekChange).toHaveBeenCalledWith(2);
    expect(onSelect).toHaveBeenCalledWith("w2-mon");
  });

  it("shows the week meal count badge", () => {
    renderSidebar();
    expect(screen.getByTestId("week-meal-count")).toHaveTextContent("2 lunches");
  });

  it("renders meal cards via MealSelector", () => {
    renderSidebar();
    expect(screen.getAllByTestId("meal-card")).toHaveLength(2);
  });

  it("calls onSelect when a meal card is clicked", () => {
    const onSelect = vi.fn();
    renderSidebar({ onSelect });
    fireEvent.click(screen.getAllByTestId("meal-card")[1]);
    expect(onSelect).toHaveBeenCalledWith("w1-tue");
  });
});
