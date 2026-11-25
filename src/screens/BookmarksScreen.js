import React from "react";
import { View, Text, FlatList } from "react-native";
import { useApp } from "../context/AppContext";
import { useStyles } from "../theme/styles";
import RecipeCard from "../components/RecipeCard";

export default function BookmarksScreen({ navigation }) {
  const styles = useStyles();
  const { bookmarks, toggleBookmark } = useApp();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔖 My Bookmarks</Text>

      {bookmarks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyText}>No bookmarked recipes yet.</Text>
          <Text style={styles.smallText}>
            Search for a recipe and bookmark your favorites.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard
              meal={item}
              removeMode
              imageStyle={styles.cardImage}
              onPress={() => navigation.navigate("Recipe Details", { meal: item })}
              onToggle={() => toggleBookmark(item)}
            />
          )}
        />
      )}
    </View>
  );
}
