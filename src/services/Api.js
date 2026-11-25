// All TheMealDB calls live here. Every function accepts an AbortSignal so
// screens can cancel in-flight requests when they unmount (lifecycle cleanup).
const BASE = "https://www.themealdb.com/api/json/v1/1";

async function get(path, signal) {
  const res = await fetch(`${BASE}/${path}`, { signal });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export const searchMeals = (query, signal) =>
  get(`search.php?s=${encodeURIComponent(query)}`, signal).then(
    (d) => d.meals || []
  );

// type: "c" (category) | "a" (area) | "i" (ingredient)
// NOTE: filter.php only returns idMeal, strMeal, strMealThumb.
export const filterMeals = (type, value, signal) => {
  const v = type === "i" ? value.replace(/ /g, "_") : value;
  return get(`filter.php?${type}=${encodeURIComponent(v)}`, signal).then(
    (d) => d.meals || []
  );
};

export const lookupMeal = (id, signal) =>
  get(`lookup.php?i=${id}`, signal).then((d) => d.meals?.[0] || null);

export const randomMeal = (signal) =>
  get("random.php", signal).then((d) => d.meals?.[0] || null);

const LIST_KEYS = { c: "strCategory", a: "strArea", i: "strIngredient" };

export const listOptions = (type, signal) =>
  get(`list.php?${type}=list`, signal).then((d) =>
    (d.meals || []).map((m) => m[LIST_KEYS[type]])
  );
