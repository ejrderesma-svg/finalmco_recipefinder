import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useStyles } from "../theme/styles";

// Reusable card used by the results list and the bookmarks list.
export default function RecipeCard({
  meal,
  saved,
  onPress,
  onToggle,
  imageStyle,
  removeMode = false,
}) {
  const styles = useStyles();
  const subtitle = [meal.strCategory, meal.strArea].filter(Boolean).join(" • ");

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: meal.strMealThumb }} style={imageStyle || styles.listImage} />
        <Text style={styles.name}>{meal.strMeal}</Text>
        {!!subtitle && <Text style={styles.category}>{subtitle}</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={removeMode ? styles.remove : styles.bookmark}
        onPress={onToggle}
      >
        <Text style={removeMode ? styles.removeText : styles.actionButtonText}>
          {removeMode
            ? "Remove Bookmark"
            : saved
            ? "🔖 Bookmarked"
            : "🔖 Bookmark"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
