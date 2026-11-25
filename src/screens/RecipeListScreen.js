import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useApp } from "../context/AppContext";
import { useStyles, useTheme } from "../theme/styles";
import { searchMeals, filterMeals } from "../services/Api";
import RecipeCard from "../components/RecipeCard";

// Works for both modes:
//   { search: "chicken" }                         -> text search
//   { filterType: "c"|"a"|"i", filterValue: "X" } -> browse filter
export default function RecipeListScreen({ route, navigation }) {
  const styles = useStyles();
  const colors = useTheme();
  const { bookmarks, toggleBookmark } = useApp();
  const { search, filterType, filterValue } = route.params;

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    navigation.setOptions({ title: search ? `"${search}"` : filterValue });
  }, [navigation, search, filterValue]);

  // Lifecycle: fetch on mount / when params change; abort on unmount.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const request = search
      ? searchMeals(search, controller.signal)
      : filterMeals(filterType, filterValue, controller.signal);

    request
      .then(setMeals)
      .catch((e) => {
        if (e.name !== "AbortError") setError("Couldn't load recipes.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [search, filterType, filterValue, reloadKey]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loading}>Finding recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error} Check your connection.</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setReloadKey((k) => k + 1)}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Results 🍽️</Text>

      {meals.length === 0 ? (
        <Text style={styles.message}>No recipes found.</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard
              meal={item}
              saved={bookmarks.some((b) => b.idMeal === item.idMeal)}
              onPress={() => navigation.navigate("Recipe Details", { meal: item })}
              onToggle={() => toggleBookmark(item)}
            />
          )}
        />
      )}
    </View>
  );
}
