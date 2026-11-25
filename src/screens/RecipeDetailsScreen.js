import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Linking,
} from "react-native";
import { useApp } from "../context/AppContext";
import { useStyles, useTheme } from "../theme/styles";
import { lookupMeal } from "../services/Api";

export default function RecipeDetailsScreen({ route, navigation }) {
  const styles = useStyles();
  const colors = useTheme();
  const { bookmarks, toggleBookmark } = useApp();
  const preview = route.params.meal; // may be a partial meal (id, name, thumb)

  // Filter results and bookmarks don't include instructions/ingredients,
  // so fetch the full recipe by id when needed.
  const [meal, setMeal] = useState(preview.strInstructions ? preview : null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    navigation.setOptions({ title: preview.strMeal });
  }, [navigation, preview.strMeal]);

  useEffect(() => {
    if (meal) return;
    const controller = new AbortController();
    setError(null);
    lookupMeal(preview.idMeal, controller.signal)
      .then((full) => (full ? setMeal(full) : setError("Recipe not found.")))
      .catch((e) => {
        if (e.name !== "AbortError") setError("Couldn't load this recipe.");
      });
    return () => controller.abort();
  }, [preview.idMeal, meal, reloadKey]);

  const saved = bookmarks.some((b) => b.idMeal === preview.idMeal);
  const shown = meal || preview;

  const ingredients = [];
  if (meal) {
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${(measure || "").trim()} ${ingredient.trim()}`.trim());
      }
    }
  }

  const shareRecipe = () =>
    Share.share({
      message: `${meal.strMeal}\n\nIngredients:\n${ingredients
        .map((i) => `• ${i}`)
        .join("\n")}\n\n${meal.strInstructions}`,
    });

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: shown.strMealThumb }} style={styles.detailsImage} />
      <Text style={styles.name}>{shown.strMeal}</Text>
      {!!meal && (
        <Text style={styles.info}>
          {meal.strCategory} • {meal.strArea}
        </Text>
      )}

      <TouchableOpacity
        style={styles.detailsBookmark}
        onPress={() => toggleBookmark(shown)}
      >
        <Text style={styles.actionButtonText}>
          {saved ? "🔖 Remove Bookmark" : "🔖 Save Recipe"}
        </Text>
      </TouchableOpacity>

      {!meal && !error && (
        <View style={{ marginTop: 30 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {!!error && (
        <View style={{ marginTop: 30, alignItems: "center" }}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setReloadKey((k) => k + 1)}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!!meal && (
        <>
          <Text style={styles.heading}>Ingredients</Text>
          {ingredients.map((item, index) => (
            <Text key={index} style={styles.ingredient}>
              • {item}
            </Text>
          ))}

          <Text style={styles.heading}>Instructions</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>

          <TouchableOpacity style={styles.secondaryButton} onPress={shareRecipe}>
            <Text style={styles.secondaryText}>Share Recipe</Text>
          </TouchableOpacity>

          {!!meal.strYoutube && (
            <TouchableOpacity
              style={[styles.secondaryButton, { marginBottom: 30 }]}
              onPress={() => Linking.openURL(meal.strYoutube)}
            >
              <Text style={styles.secondaryText}>▶ Watch on YouTube</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}
