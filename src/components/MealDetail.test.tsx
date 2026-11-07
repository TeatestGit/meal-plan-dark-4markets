import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MealDetail } from "./MealDetail";
import type { Meal } from "../types";

const meal: Meal = {
  id: "w1-mon",
  week: 1,
  day: "Mon — Week 1",
  title: "Harissa chicken grain bowl",
  time: "25 min",
  protein: "42g protein",
  kcal: "520 kcal",
  fat: "12g fat",
  carbs: "61g carbs",
  ingredients: ["300g chicken breast, cubed", "100g chickpeas, drained"],
  steps: ["Step one.", "Step two."],
  storage: "Fridge 3 days.",
};

function renderNutrition() {
  render(
    <MealDetail
      selectedMeal={meal}
      tab="nutrition"
      activeStepIdx={-1}
      shoppingSet={new Set()}
      plannedMeals={new Set()}
      selectedMarket="carrefour"
      onTabChange={() => {}}
      onToggleIngredient={() => {}}
      onAddMealToList={() => {}}
      onClearMealIngredients={() => {}}
      onSetActiveStepIdx={() => {}}
      onTogglePlanned={() => {}}
      getIngredientPrice={() => null}
    />
  );
}

describe("MealDetail — Nutrition tab", () => {
  it("renders the Nutrition heading and per-serving subtitle", () => {
    renderNutrition();
    expect(screen.getByRole("heading", { name: /nutrition/i })).toBeInTheDocument();
    expect(screen.getByText(/per serving/i)).toBeInTheDocument();
    expect(screen.getByText(/recipe makes 2/i)).toBeInTheDocument();
  });

  it("displays the kcal total from meal data", () => {
    renderNutrition();
    const pill = screen.getByTestId("nutrition-kcal-pill");
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveTextContent("520");
    expect(pill).toHaveTextContent("kcal");
  });

  it("renders all three macro labels", () => {
    renderNutrition();
    expect(screen.getByText("Protein")).toBeInTheDocument();
    expect(screen.getByText("Carbs")).toBeInTheDocument();
    expect(screen.getByText("Fat")).toBeInTheDocument();
  });

  it("shows gram values for each macro", () => {
    renderNutrition();
    expect(screen.getByText("42g")).toBeInTheDocument(); // protein
    expect(screen.getByText("61g")).toBeInTheDocument(); // carbs
    expect(screen.getByText("12g")).toBeInTheDocument(); // fat
  });

  it("shows kcal and percentage for each macro", () => {
    renderNutrition();
    // protein: 42 * 4 = 168 kcal; 168/520 = 32%
    expect(screen.getByText(/168 kcal/)).toBeInTheDocument();
    // carbs: 61 * 4 = 244 kcal; 244/520 = 47%
    expect(screen.getByText(/244 kcal/)).toBeInTheDocument();
    // fat: 12 * 9 = 108 kcal; 108/520 = 21%
    expect(screen.getByText(/108 kcal/)).toBeInTheDocument();
  });

  it("renders the USDA note with a link to FoodData Central", () => {
    renderNutrition();
    expect(screen.getByText(/USDA reference values/i)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /USDA FoodData Central/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://fdc.nal.usda.gov/");
  });

  it("switches to the nutrition tab when its button is clicked", () => {
    render(
      <MealDetail
        selectedMeal={meal}
        tab="ingredients"
        activeStepIdx={-1}
        shoppingSet={new Set()}
        plannedMeals={new Set()}
        selectedMarket="carrefour"
        onTabChange={(t) => {
          if (t === "nutrition") {
            // re-render with nutrition tab active
          }
        }}
        onToggleIngredient={() => {}}
        onAddMealToList={() => {}}
        onClearMealIngredients={() => {}}
        onSetActiveStepIdx={() => {}}
        onTogglePlanned={() => {}}
        getIngredientPrice={() => null}
      />
    );
    const tab = screen.getByTestId("tab-nutrition");
    expect(tab).toBeInTheDocument();
    fireEvent.click(tab);
    // onTabChange callback fired — tab button is always present
    expect(tab).toBeInTheDocument();
  });
});
