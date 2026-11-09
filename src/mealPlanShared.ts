import mealsData from "./assets/meals.json";
import type { Meal } from "./types";

const rawImages = import.meta.glob<{ default: string }>("./assets/*/*.{webp,jpg}", { eager: true });
export const imageMap: Record<string, string> = Object.fromEntries(
  Object.entries(rawImages).map(([path, mod]) => [
    path.replace(/^\.\/assets\/[^/]+\//, "").replace(/\.(webp|jpg)$/, ""),
    mod.default,
  ])
);

const rawThumbs = import.meta.glob<{ default: string }>("./assets/*/thumbs/*.jpg", { eager: true });
export const thumbnailMap: Record<string, string> = Object.fromEntries(
  Object.entries(rawThumbs).map(([path, mod]) => [
    path.replace(/^\.\/assets\/[^/]+\/thumbs\//, "").replace(/-thumb\.jpg$/, "").replace(".jpg", ""),
    mod.default,
  ])
);

type RawMeal = Omit<Meal, "image" | "thumbnail">;
export const meals: Meal[] = (mealsData as RawMeal[]).map((meal) => ({
  ...meal,
  image: imageMap[meal.id],
  thumbnail: thumbnailMap[meal.id],
}));

export function parseKcal(value: string) {
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function parseProtein(value: string) {
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function parseTime(value: string) {
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function loadSet(key: string): Set<string> {
  try {
    const saved = localStorage.getItem(key);
    return saved ? new Set(JSON.parse(saved) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveSet(key: string, value: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...value]));
  } catch { /* storage unavailable */ }
}

export function derivePlans(data: Array<{ plan: string }>) {
  const seen = new Set<string>();
  const result: { id: string; label: string }[] = [];
  for (const meal of data) {
    if (!seen.has(meal.plan)) {
      seen.add(meal.plan);
      result.push({
        id: meal.plan,
        label: meal.plan.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      });
    }
  }
  return result;
}
