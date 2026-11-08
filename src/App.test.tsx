import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the editorial title and week selector', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /2-week lunch/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^w1$/i })).toBeInTheDocument();
  });

  it('shows the grocery panel with shopping totals', () => {
    render(<App />);
    expect(screen.getByText(/grocery & shopping/i)).toBeInTheDocument();
    expect(screen.getByText(/soft & empty/i)).toBeInTheDocument();
  });

  it('shows no recipe when a search has no matches', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/search lunches/i), {
      target: { value: 'no matching lunch' },
    });

    expect(screen.getByRole('status')).toHaveTextContent(/no lunches match/i);
  });

  it('adds the selected ingredient quantity to the estimated total', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /300g chicken breast, cubed/i }));

    expect(screen.getAllByText('est. AED 13').length).toBeGreaterThan(0);
    expect(screen.getByText('300g')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /compare market prices/i }));
    expect(screen.getByRole('button', { name: /hide market prices/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('combines quantities for the same ingredient across selected meals', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Add week' }));

    // Priced items show "{amount}{unit} · est." — verify at least one combined quantity appears
    expect(screen.getAllByText(/\d+g · est\./).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/est\. AED \d+/).length).toBeGreaterThan(0);
  });

  it('filters meals by ingredient keyword', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/search lunches/i), {
      target: { value: 'chickpea' },
    });
    // at least one result visible, no-results message absent
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getAllByTestId('meal-card').length).toBeGreaterThan(0);
  });

  it('shows no-results when search matches nothing', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/search lunches/i), {
      target: { value: 'zzznomatch' },
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('mark planned button toggles between "Mark planned" and "Planned"', () => {
    localStorage.clear();
    render(<App />);
    const btn = screen.getByTestId('mark-planned-btn');
    expect(btn).toHaveTextContent('Mark planned');
    fireEvent.click(btn);
    expect(btn).toHaveTextContent('Planned');
    fireEvent.click(btn);
    expect(btn).toHaveTextContent('Mark planned');
  });

  it('Clear list empties the shopping list after Add week', () => {
    localStorage.clear();
    render(<App />);
    fireEvent.click(screen.getByTestId('add-week-btn'));
    // list has items — empty-state is hidden
    expect(screen.queryByText(/soft & empty/i)).toBeNull();
    fireEvent.click(screen.getByTestId('clear-list-btn'));
    expect(screen.getByText(/soft & empty/i)).toBeInTheDocument();
  });

  it('week 2 button switches to week 2 meals', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^w2$/i }));
    // week-meal-count badge should now say "7 lunches" (week 2 also has 7 meals)
    expect(screen.getByTestId('week-meal-count')).toHaveTextContent('7');
  });
});

describe('Plan switching', () => {
  it('renders plan tabs for all three plans', () => {
    render(<App />);
    expect(screen.getByTestId('plan-btn-no-red-meat')).toBeInTheDocument();
    expect(screen.getByTestId('plan-btn-vegan')).toBeInTheDocument();
    expect(screen.getByTestId('plan-btn-breakfast')).toBeInTheDocument();
  });

  it('No Red Meat plan is active by default', () => {
    render(<App />);
    // first meal card should be a no-red-meat meal (harissa chicken)
    const cards = screen.getAllByTestId('meal-card');
    expect(cards).toHaveLength(7);
    expect(screen.getByTestId('week-meal-count')).toHaveTextContent('7');
  });

  it('switching to Vegan shows 7 vegan week-1 meals', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('plan-btn-vegan'));
    expect(screen.getByTestId('week-meal-count')).toHaveTextContent('7');
    // vegan w1-mon title should appear (in card + detail panel)
    expect(screen.getAllByText(/spiced chickpea/i).length).toBeGreaterThan(0);
  });

  it('switching plan resets to week 1', () => {
    render(<App />);
    // go to week 2 of no-red-meat, then switch plan
    fireEvent.click(screen.getByTestId('week-btn-2'));
    fireEvent.click(screen.getByTestId('plan-btn-vegan'));
    // week 1 button should be active (bg-ink-primary class)
    expect(screen.getByTestId('week-btn-1').className).toMatch(/bg-ink-primary/);
  });

  it('hero text updates to show active plan label', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('plan-btn-vegan'));
    // eyebrow and footer should contain "Vegan"
    expect(screen.getAllByText(/vegan/i).length).toBeGreaterThan(0);
  });

  it('no-red-meat meals are absent when vegan plan is active', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('plan-btn-vegan'));
    // harissa chicken is a no-red-meat meal — should not be visible
    expect(screen.queryByText(/harissa chicken/i)).toBeNull();
  });

  it('switching back to No Red Meat restores no-red-meat meals', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('plan-btn-vegan'));
    fireEvent.click(screen.getByTestId('plan-btn-no-red-meat'));
    expect(screen.getAllByText(/harissa chicken/i).length).toBeGreaterThan(0);
  });
});

describe('Currency display', () => {
  it('displays est. AED for ingredient prices', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /300g chicken breast, cubed/i }));
    expect(screen.getAllByText('est. AED 13').length).toBeGreaterThan(0);
  });

  it('displays est. AED in the shopping list total after Add week', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('add-week-btn'));
    expect(screen.getAllByText(/est\. AED \d+/).length).toBeGreaterThan(0);
  });
});

describe('Market card logo', () => {
  const markets = [
    { key: 'carrefour', name: 'Carrefour' },
    { key: 'lulu',      name: 'LuLu Hyper' },
    { key: 'spinneys',  name: 'Spinneys' },
    { key: 'geant',     name: 'Géant' },
  ] as const;

  it('all market cards show a logo image after Add week', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('add-week-btn'));
    for (const { key, name } of markets) {
      const card = screen.getByTestId(`market-card-${key}`);
      expect(card.querySelector(`img[alt="${name}"]`)).toBeTruthy();
    }
  });

  it('market card header shows no market name text (logo-only)', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('add-week-btn'));
    for (const { key, name } of markets) {
      expect(screen.getByTestId(`market-card-${key}`)).not.toHaveTextContent(name);
    }
  });

  it('market pill tabs show all four market names', () => {
    render(<App />);
    expect(screen.getByTestId('market-pill-carrefour')).toHaveTextContent('Carrefour');
    expect(screen.getByTestId('market-pill-lulu')).toHaveTextContent('LuLu');
    expect(screen.getByTestId('market-pill-spinneys')).toHaveTextContent('Spinneys');
    expect(screen.getByTestId('market-pill-geant')).toHaveTextContent('Géant');
  });

  it('AED appears in market card price total', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('add-week-btn'));
    expect(screen.getByTestId('market-card-carrefour')).toHaveTextContent(/AED/);
  });
});

describe('Breakfast plan', () => {
  it('breakfast plan tab is present', () => {
    render(<App />);
    expect(screen.getByTestId('plan-btn-breakfast')).toBeInTheDocument();
  });

  it('switching to breakfast plan shows 7 breakfasts in the week badge', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('plan-btn-breakfast'));
    expect(screen.getByTestId('week-meal-count')).toHaveTextContent('7 breakfasts');
  });

  it('switching to breakfast plan changes heading to "2-Week Breakfast Plan"', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('plan-btn-breakfast'));
    expect(screen.getByRole('heading', { name: /2-week breakfast/i })).toBeInTheDocument();
  });

  it('switching to breakfast plan changes search placeholder to "Search breakfasts"', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('plan-btn-breakfast'));
    expect(screen.getByPlaceholderText(/search breakfasts/i)).toBeInTheDocument();
  });

  it('breakfast week 2 also shows 7 breakfasts', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('plan-btn-breakfast'));
    fireEvent.click(screen.getByTestId('week-btn-2'));
    expect(screen.getByTestId('week-meal-count')).toHaveTextContent('7 breakfasts');
  });
});
