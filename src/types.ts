export type Meal = {
  id: string;
  week: number;
  day: string;
  title: string;
  time: string;
  protein: string;
  kcal: string;
  ingredients: string[];
  steps: string[];
  storage: string;
  image?: string;
  thumbnail?: string;
};

export type MarketKey = "carrefour" | "lulu" | "spinneys" | "geant";

export type MarketInfo = {
  name: string;
  color: string;
  logo: string;
  delivery: string;
  fee: string;
  url: string;
};

export type PriceEntry = {
  unit: string;
  carrefour: number;
  lulu: number;
  spinneys: number;
  geant: number;
};

export type PricedItem = {
  id: string;
  sourceIds: string[];
  original: string;
  unit: string;
  prices: PriceEntry | null;
};
