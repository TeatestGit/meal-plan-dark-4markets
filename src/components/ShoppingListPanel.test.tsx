import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShoppingListPanel } from "./ShoppingListPanel";
import type { MarketKey, MarketInfo, PricedItem } from "../types";

const marketPrices: Record<MarketKey, MarketInfo> = {
  carrefour: { name: "Carrefour", color: "#00f", logo: "C", delivery: "30 min", fee: "AED 7", url: "" },
  lulu:      { name: "LuLu",      color: "#f00", logo: "L", delivery: "45 min", fee: "AED 10", url: "" },
  spinneys:  { name: "Spinneys",  color: "#0f0", logo: "S", delivery: "25 min", fee: "AED 12", url: "" },
  geant:     { name: "Géant",     color: "#ff0", logo: "G", delivery: "40 min", fee: "AED 9",  url: "" },
};
const marketOrder: MarketKey[] = ["carrefour", "lulu", "spinneys", "geant"];
const totals: Record<MarketKey, number> = { carrefour: 50, lulu: 55, spinneys: 60, geant: 48 };

const pricedItem: PricedItem = {
  id: "chicken:g",
  sourceIds: ["w1-mon:0"],
  original: "chicken breast",
  unit: "300g",
  prices: { unit: "300g", carrefour: 15, lulu: 16, spinneys: 18, geant: 14 },
};

function renderPanel(items: PricedItem[] = [], overrides: Partial<Parameters<typeof ShoppingListPanel>[0]> = {}) {
  const defaults = {
    pricedItems: items,
    selectedMarket: "carrefour" as MarketKey,
    marketOrder,
    marketPrices,
    totalsPerMarket: totals,
    cheapestMarket: "geant" as MarketKey,
    selectedTotal: 50,
    savings: 2,
    mostExpensive: { key: "spinneys" as MarketKey, val: 60 },
    onSelectMarket: vi.fn(),
    onAddWholeWeek: vi.fn(),
    onAddAllMeals: vi.fn(),
    onRemoveItem: vi.fn(),
    onClearList: vi.fn(),
  };
  return render(<ShoppingListPanel {...defaults} {...overrides} />);
}

describe("ShoppingListPanel", () => {
  it("shows the panel heading", () => {
    renderPanel();
    expect(screen.getByText(/grocery & shopping/i)).toBeInTheDocument();
  });

  it("shows empty state when no items", () => {
    renderPanel([]);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows item count badge", () => {
    renderPanel([pricedItem]);
    expect(screen.getByTestId("item-count-badge")).toHaveTextContent("1 items");
  });

  it("renders a list item row", () => {
    renderPanel([pricedItem]);
    expect(screen.getByTestId("list-item")).toBeInTheDocument();
  });

  it("calls onRemoveItem when remove button clicked", () => {
    const onRemoveItem = vi.fn();
    renderPanel([pricedItem], { onRemoveItem });
    fireEvent.click(screen.getByTestId("item-remove-btn"));
    expect(onRemoveItem).toHaveBeenCalledWith(pricedItem);
  });

  it("calls onClearList when clear button clicked", () => {
    const onClearList = vi.fn();
    renderPanel([pricedItem], { onClearList });
    fireEvent.click(screen.getByTestId("clear-list-btn"));
    expect(onClearList).toHaveBeenCalled();
  });

  it("calls onAddWholeWeek when add week button clicked", () => {
    const onAddWholeWeek = vi.fn();
    renderPanel([], { onAddWholeWeek });
    fireEvent.click(screen.getByTestId("add-week-btn"));
    expect(onAddWholeWeek).toHaveBeenCalled();
  });
});
