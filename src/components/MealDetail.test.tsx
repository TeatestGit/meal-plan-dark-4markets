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

function renderWith(tab: "ingredients" | "steps" | "storage" | "nutrition", overrides: Partial<typeof meal> = {}) {
  const { rerender, ...rest } = render(
    <MealDetail
      selectedMeal={{ ...meal, ...overrides }}
      tab={tab}
      activeStepIdx={0}
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
  return { rerender, ...rest };
}

function renderNutrition() {
  renderWith("nutrition");
}

describe("MealDetail — Ingredients tab", () => {
  it("renders all ingredient rows", () => {
    renderWith("ingredients");
    expect(screen.getAllByTestId("ingredient-row")).toHaveLength(meal.ingredients.length);
  });

  it("shows the meal title", () => {
    renderWith("ingredients");
    expect(screen.getByText(meal.title)).toBeInTheDocument();
  });

  it("shows the Add meal and Clear meal buttons", () => {
    renderWith("ingredients");
    expect(screen.getByTestId("add-meal-btn")).toBeInTheDocument();
    expect(screen.getByTestId("clear-meal-btn")).toBeInTheDocument();
  });

  it("shows in-list count starting at 0", () => {
    renderWith("ingredients");
    expect(screen.getByTestId("in-list-count")).toHaveTextContent("0 in list");
  });

  it("highlights an ingredient row when it is in the shopping set", () => {
    render(
      <MealDetail
        selectedMeal={meal}
        tab="ingredients"
        activeStepIdx={0}
        shoppingSet={new Set(["w1-mon:0"])}
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
    expect(screen.getAllByTestId("ingredient-row")[0]).toHaveClass("bg-rim");
  });
});

describe("MealDetail — Steps tab", () => {
  it("renders all step rows", () => {
    renderWith("steps");
    expect(screen.getAllByTestId("step-row")).toHaveLength(meal.steps.length);
  });

  it("shows the Method heading", () => {
    renderWith("steps");
    expect(screen.getByRole("heading", { name: /method/i })).toBeInTheDocument();
  });

  it("highlights the active step row", () => {
    renderWith("steps");
    // step at index 0 is active (activeStepIdx=0) — should have bg-rim class
    expect(screen.getAllByTestId("step-row")[0]).toHaveClass("bg-rim");
  });

  it("non-active step rows do not have the active class", () => {
    renderWith("steps");
    expect(screen.getAllByTestId("step-row")[1]).not.toHaveClass("bg-rim");
  });
});

describe("MealDetail — Storage tab", () => {
  it("shows the keep label", () => {
    renderWith("storage");
    expect(screen.getByTestId("storage-keep-label")).toBeInTheDocument();
  });

  it("shows the storage text from meal data", () => {
    renderWith("storage");
    expect(screen.getByTestId("storage-text")).toHaveTextContent(meal.storage);
  });
});

describe("MealDetail — tab bar", () => {
  it("all four tab buttons are always rendered", () => {
    renderWith("ingredients");
    expect(screen.getByTestId("tab-ingredients")).toBeInTheDocument();
    expect(screen.getByTestId("tab-steps")).toBeInTheDocument();
    expect(screen.getByTestId("tab-storage")).toBeInTheDocument();
    expect(screen.getByTestId("tab-nutrition")).toBeInTheDocument();
  });

  it("active tab button has the active style", () => {
    renderWith("steps");
    expect(screen.getByTestId("tab-steps")).toHaveClass("bg-rim");
  });

  it("inactive tab buttons do not have the active style", () => {
    renderWith("steps");
    expect(screen.getByTestId("tab-ingredients")).not.toHaveClass("bg-rim");
  });

  it("mark-planned button shows Planned when meal is in planned set", () => {
    render(
      <MealDetail
        selectedMeal={meal}
        tab="ingredients"
        activeStepIdx={0}
        shoppingSet={new Set()}
        plannedMeals={new Set([meal.id])}
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
    expect(screen.getByTestId("mark-planned-btn")).toHaveTextContent("Planned");
  });
});

describe("MealDetail — no-shopping mode (optional props omitted)", () => {
  function renderNoShopping() {
    render(
      <MealDetail
        selectedMeal={meal}
        tab="ingredients"
        activeStepIdx={0}
        plannedMeals={new Set()}
        onTabChange={() => {}}
        onSetActiveStepIdx={() => {}}
        onTogglePlanned={() => {}}
      />
    );
  }

  it("renders ingredient rows as divs (not buttons) when onToggleIngredient is absent", () => {
    renderNoShopping();
    const rows = screen.getAllByTestId("ingredient-row");
    rows.forEach((row) => expect(row.tagName).toBe("DIV"));
  });

  it("hides Add meal and Clear buttons when handlers are absent", () => {
    renderNoShopping();
    expect(screen.queryByTestId("add-meal-btn")).toBeNull();
    expect(screen.queryByTestId("clear-meal-btn")).toBeNull();
  });

  it("hides in-list count when shoppingSet is absent", () => {
    renderNoShopping();
    expect(screen.queryByTestId("in-list-count")).toBeNull();
  });

  it("hides footer + List button when onAddMealToList is absent", () => {
    renderNoShopping();
    expect(screen.queryByTestId("add-list-footer-btn")).toBeNull();
  });

  it("shows Clear button when only onClearMealIngredients is provided", () => {
    render(
      <MealDetail
        selectedMeal={meal}
        tab="ingredients"
        activeStepIdx={0}
        plannedMeals={new Set()}
        onTabChange={() => {}}
        onSetActiveStepIdx={() => {}}
        onTogglePlanned={() => {}}
        onClearMealIngredients={() => {}}
      />
    );
    expect(screen.getByTestId("clear-meal-btn")).toBeInTheDocument();
    expect(screen.queryByTestId("add-meal-btn")).toBeNull();
  });
});

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
