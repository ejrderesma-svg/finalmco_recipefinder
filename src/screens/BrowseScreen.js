import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useStyles, useTheme } from "../theme/styles";
import { listOptions } from "../services/Api";

const TYPES = [
  { key: "c", label: "Categories" },
  { key: "a", label: "Areas" },
  { key: "i", label: "Ingredients" },
];

export default function BrowseScreen({ navigation }) {
  const styles = useStyles();
  const colors = useTheme();
  const [type, setType] = useState("c");
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setQuery("");

    listOptions(type, controller.signal)
      .then(setItems)
      .catch((e) => {
        if (e.name !== "AbortError") setError("Couldn't load the list.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [type, reloadKey]);

  const filtered = useMemo(
    () => items.filter((i) => i.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query]
  );

  return (
    <View style={styles.container}>
      <View style={styles.segmentRow}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.segment, type === t.key && styles.segmentActive]}
            onPress={() => setType(t.key)}
          >
            <Text
              style={[styles.segmentText, type === t.key && styles.segmentTextActive]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Filter list..."
        placeholderTextColor={colors.subtext}
        value={query}
        onChangeText={setQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setReloadKey((k) => k + 1)}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item, index) => `${item}-${index}`}
          ListEmptyComponent={<Text style={styles.message}>No matches.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.browseItem}
              onPress={() =>
                navigation.navigate("Recipe List", {
                  filterType: type,
                  filterValue: item,
                })
              }
            >
              <Text style={styles.browseItemText}>{item}</Text>
              <Text style={styles.browseArrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
