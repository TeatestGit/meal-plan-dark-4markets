import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MealSelector } from "./MealSelector";
import type { Meal } from "../types";

const makeMeal = (id: string, day: string, title: string): Meal => ({
  id, plan: "no-red-meat", week: 1, day, title,
  time: "20 min", protein: "30g protein", kcal: "400 kcal",
  fat: "10g fat", carbs: "50g carbs",
  ingredients: ["item 1"], steps: ["step 1"], storage: "3 days",
});

const meals = [
  makeMeal("w1-mon", "Mon — Week 1", "Chicken Rice Bowl"),
  makeMeal("w1-tue", "Tue — Week 1", "Lentil Soup"),
];

describe("MealSelector", () => {
  it("renders a card for every meal", () => {
    render(<MealSelector weekMeals={meals} selectedMealId="w1-mon" plannedMeals={new Set()} onSelect={() => {}} />);
    expect(screen.getAllByTestId("meal-card")).toHaveLength(2);
  });

  it("shows meal titles", () => {
    render(<MealSelector weekMeals={meals} selectedMealId="w1-mon" plannedMeals={new Set()} onSelect={() => {}} />);
    expect(screen.getByText("Chicken Rice Bowl")).toBeInTheDocument();
    expect(screen.getByText("Lentil Soup")).toBeInTheDocument();
  });

  it("active card has aria-pressed=true", () => {
    render(<MealSelector weekMeals={meals} selectedMealId="w1-tue" plannedMeals={new Set()} onSelect={() => {}} />);
    const cards = screen.getAllByTestId("meal-card");
    expect(cards[0]).toHaveAttribute("aria-pressed", "false");
    expect(cards[1]).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onSelect with the meal id when clicked", () => {
    const onSelect = vi.fn();
    render(<MealSelector weekMeals={meals} selectedMealId="w1-mon" plannedMeals={new Set()} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByTestId("meal-card")[1]);
    expect(onSelect).toHaveBeenCalledWith("w1-tue");
  });

  it("shows planned badge on a planned meal", () => {
    render(<MealSelector weekMeals={meals} selectedMealId="w1-mon" plannedMeals={new Set(["w1-tue"])} onSelect={() => {}} />);
    expect(screen.getByText("planned")).toBeInTheDocument();
  });

  it("renders empty without crashing", () => {
    const { container } = render(<MealSelector weekMeals={[]} selectedMealId="" plannedMeals={new Set()} onSelect={() => {}} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
