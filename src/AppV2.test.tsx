import React from "react";
import { render, screen } from "@testing-library/react";
import AppV2 from "./AppV2";

describe("AppV2 — smoke", () => {
  it("renders the page heading", () => {
    render(<AppV2 />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders no shopping / pricing UI", () => {
    render(<AppV2 />);
    expect(screen.queryByText(/grocery & shopping/i)).toBeNull();
    expect(screen.queryByText(/carrefour/i)).toBeNull();
    expect(screen.queryByText(/add week/i)).toBeNull();
  });

  it("renders plan switcher buttons", () => {
    render(<AppV2 />);
    expect(screen.getByTestId("plan-btn-no-red-meat")).toBeInTheDocument();
  });

  it("renders week glance stats panel", () => {
    render(<AppV2 />);
    expect(screen.getByTestId("week-glance")).toBeInTheDocument();
  });

  it("ingredients tab shows read-only divs, not interactive buttons", () => {
    render(<AppV2 />);
    const rows = screen.getAllByTestId("ingredient-row");
    rows.forEach((row) => expect(row.tagName).toBe("DIV"));
  });
});
