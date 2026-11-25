import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { useApp } from "../context/AppContext";
import { useStyles, useTheme } from "../theme/styles";
import { randomMeal } from "../services/Api";

export default function HomeScreen({ navigation }) {
  const styles = useStyles();
  const colors = useTheme();
  const { recents, addRecent, clearRecents } = useApp();
  const [search, setSearch] = useState("");
  const [loadingRandom, setLoadingRandom] = useState(false);

  const runSearch = (term) => {
    const t = term.trim();
    if (!t) return;
    addRecent(t);
    setSearch("");
    Keyboard.dismiss();
    navigation.navigate("Recipe List", { search: t });
  };

  const surpriseMe = async () => {
    setLoadingRandom(true);
    try {
      const meal = await randomMeal();
      if (meal) navigation.navigate("Recipe Details", { meal });
    } catch (e) {
      Alert.alert("Oops", "Couldn't fetch a random recipe. Check your connection.");
    } finally {
      setLoadingRandom(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.homeContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.emoji}>🧑🏻‍🍳</Text>
      <Text style={styles.homeTitle}>Recipe Finder</Text>
      <Text style={styles.subtitle}>Find delicious recipes easily</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a recipe..."
        placeholderTextColor={colors.subtext}
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={() => runSearch(search)}
        returnKeyType="search"
      />

      <TouchableOpacity style={styles.searchButton} onPress={() => runSearch(search)}>
        <Text style={styles.buttonText}>Search Recipe</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={surpriseMe}
        disabled={loadingRandom}
      >
        {loadingRandom ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.secondaryText}>🎲 Surprise Me</Text>
        )}
      </TouchableOpacity>

      {recents.length > 0 && (
        <>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Recent searches</Text>
            <TouchableOpacity onPress={clearRecents}>
              <Text style={styles.clearLink}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipRow}>
            {recents.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.chip}
                onPress={() => runSearch(term)}
              >
                <Text style={styles.chipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}