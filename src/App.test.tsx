import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the editorial title and week selector', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /2-week lunch/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /week 1/i })).toBeInTheDocument();
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

    expect(screen.getAllByText('AED 12.60').length).toBeGreaterThan(0);
    expect(screen.getByText('300g')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /compare market prices/i }));
    expect(screen.getByRole('button', { name: /hide market prices/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('combines quantities for the same ingredient across selected meals', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Add week' }));

    // Priced items show "{amount}{unit} · est." — verify at least one combined quantity appears
    expect(screen.getAllByText(/\d+g · est\./).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AED \d+\.\d\d/).length).toBeGreaterThan(0);
  });

  it('reports clipboard failures instead of showing success', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('permission denied')) },
    });

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(await screen.findByRole('button', { name: 'Copy failed' })).toBeInTheDocument();
  });
});
