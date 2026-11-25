import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@recipefinder/state_v1";

const initialState = {
  hydrated: false,
  bookmarks: [],
  recents: [],
  darkMode: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, hydrated: true };

    case "TOGGLE_BOOKMARK": {
      const meal = action.payload;
      const exists = state.bookmarks.some((b) => b.idMeal === meal.idMeal);
      return {
        ...state,
        bookmarks: exists
          ? state.bookmarks.filter((b) => b.idMeal !== meal.idMeal)
          : [...state.bookmarks, meal],
      };
    }

    case "CLEAR_BOOKMARKS":
      return { ...state, bookmarks: [] };

    case "ADD_RECENT": {
      const term = action.payload;
      const rest = state.recents.filter(
        (r) => r.toLowerCase() !== term.toLowerCase()
      );
      return { ...state, recents: [term, ...rest].slice(0, 8) };
    }

    case "CLEAR_RECENTS":
      return { ...state, recents: [] };

    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Lifecycle: load saved data once when the app mounts.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const saved = raw ? JSON.parse(raw) : {};
        if (active) {
          dispatch({
            type: "HYDRATE",
            payload: {
              bookmarks: saved.bookmarks || [],
              recents: saved.recents || [],
              darkMode: !!saved.darkMode,
            },
          });
        }
      } catch (e) {
        if (active) dispatch({ type: "HYDRATE", payload: {} });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Lifecycle: save whenever persisted state changes (after hydration).
  useEffect(() => {
    if (!state.hydrated) return;
    const { bookmarks, recents, darkMode } = state;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ bookmarks, recents, darkMode })
    ).catch((e) => console.log("Save failed", e));
  }, [state.hydrated, state.bookmarks, state.recents, state.darkMode]);

  const toggleBookmark = useCallback((meal) => {
    // Store only what the lists need; details are re-fetched by id.
    dispatch({
      type: "TOGGLE_BOOKMARK",
      payload: {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        strCategory: meal.strCategory,
        strArea: meal.strArea,
      },
    });
  }, []);

  const addRecent = useCallback(
    (term) => dispatch({ type: "ADD_RECENT", payload: term }),
    []
  );
  const clearRecents = useCallback(
    () => dispatch({ type: "CLEAR_RECENTS" }),
    []
  );
  const clearBookmarks = useCallback(
    () => dispatch({ type: "CLEAR_BOOKMARKS" }),
    []
  );
  const toggleDarkMode = useCallback(
    () => dispatch({ type: "TOGGLE_DARK" }),
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      toggleBookmark,
      addRecent,
      clearRecents,
      clearBookmarks,
      toggleDarkMode,
    }),
    [state, toggleBookmark, addRecent, clearRecents, clearBookmarks, toggleDarkMode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
