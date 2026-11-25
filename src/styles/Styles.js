import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";

export const lightColors = {
  background: "#f9f5f9",
  homeBackground: "#f8f1ff",
  card: "#ffffff",
  text: "#2c2c2c",
  title: "#6c3483",
  name: "#4a235a",
  subtext: "#777777",
  primary: "#8e44ad",
  border: "#d7bde2",
  inputBg: "#ffffff",
  divider: "#dddddd",
  chip: "#ead7f5",
  chipText: "#6c3483",
  danger: "#d98880",
  dangerText: "#ffffff",
  header: "#8e44ad",
};

export const darkColors = {
  background: "#17101c",
  homeBackground: "#1b1222",
  card: "#261a2e",
  text: "#f0e8f4",
  title: "#d7aef0",
  name: "#e8d3f5",
  subtext: "#a99bb3",
  primary: "#a569bd",
  border: "#4a3556",
  inputBg: "#261a2e",
  divider: "#3a2c44",
  chip: "#3a2748",
  chipText: "#e0c4f2",
  danger: "#c0675d",
  dangerText: "#ffffff",
  header: "#5b2c6f",
};

export const makeStyles = (c) =>
  StyleSheet.create({
    // Layout
    container: { flex: 1, padding: 15, backgroundColor: c.background },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: c.background,
      padding: 20,
    },

    // Typography
    title: { fontSize: 29, fontWeight: "bold", color: c.title, marginBottom: 15 },
    homeTitle: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      color: c.title,
    },
    subtitle: { textAlign: "center", color: c.subtext, marginBottom: 25 },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      color: c.title,
      marginTop: 25,
      marginBottom: 10,
    },
    name: { fontSize: 20, fontWeight: "bold", color: c.name, marginTop: 10 },
    info: { color: c.subtext, marginTop: 5 },
    category: { color: c.subtext, marginTop: 4 },
    message: { textAlign: "center", marginTop: 50, fontSize: 18, color: c.text },
    loading: { fontSize: 18, color: c.primary, marginTop: 10 },
    errorText: {
      fontSize: 16,
      color: c.text,
      textAlign: "center",
      marginBottom: 15,
    },

    // Home
    homeContainer: {
      flexGrow: 1,
      padding: 25,
      justifyContent: "center",
      backgroundColor: c.homeBackground,
    },
    emoji: { fontSize: 70, textAlign: "center", marginBottom: 10 },
    input: {
      backgroundColor: c.inputBg,
      color: c.text,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
    },
    searchButton: { backgroundColor: c.primary, padding: 15, borderRadius: 12 },
    buttonText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16,
    },
    secondaryButton: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.primary,
      padding: 15,
      borderRadius: 12,
      marginTop: 15,
    },
    secondaryText: {
      color: c.primary,
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16,
    },

    // Recent search chips
    sectionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 25,
      marginBottom: 8,
    },
    sectionLabel: { color: c.subtext, fontWeight: "bold" },
    clearLink: { color: c.primary, fontWeight: "bold" },
    chipRow: { flexDirection: "row", flexWrap: "wrap" },
    chip: {
      backgroundColor: c.chip,
      paddingVertical: 7,
      paddingHorizontal: 14,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
    },
    chipText: { color: c.chipText, fontWeight: "600" },

    // Cards
    card: {
      backgroundColor: c.card,
      padding: 10,
      borderRadius: 15,
      marginBottom: 15,
    },
    cardImage: { width: "100%", height: 180, borderRadius: 12 },
    listImage: { width: "100%", height: 260, borderRadius: 12 },
    detailsImage: { width: "100%", height: 250, borderRadius: 15 },
    bookmark: {
      backgroundColor: c.primary,
      padding: 10,
      borderRadius: 8,
      marginTop: 10,
    },
    detailsBookmark: {
      backgroundColor: c.primary,
      padding: 14,
      borderRadius: 10,
      marginTop: 15,
    },
    actionButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
    remove: {
      backgroundColor: c.danger,
      padding: 10,
      borderRadius: 8,
      marginTop: 10,
    },
    removeText: {
      color: c.dangerText,
      textAlign: "center",
      fontWeight: "bold",
    },

    // Browse
    segmentRow: { flexDirection: "row", marginBottom: 12 },
    segment: {
      flex: 1,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: c.primary,
      alignItems: "center",
      backgroundColor: c.card,
    },
    segmentActive: { backgroundColor: c.primary },
    segmentText: { color: c.primary, fontWeight: "bold" },
    segmentTextActive: { color: "#fff" },
    browseItem: {
      paddingVertical: 14,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    browseItemText: { color: c.text, fontSize: 16 },
    browseArrow: { color: c.subtext, fontSize: 16 },

    // Empty state
    empty: { alignItems: "center", marginTop: 100 },
    emptyIcon: { fontSize: 50 },
    emptyText: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 15,
      color: c.text,
    },
    smallText: { color: c.subtext, textAlign: "center", marginTop: 5 },

    // Details
    ingredient: { fontSize: 16, marginBottom: 5, color: c.text },
    instructions: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 30,
      color: c.text,
    },

    // Settings
    settingsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: c.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    settingsLabel: { color: c.text, fontSize: 16 },
  });

export function useTheme() {
  const { darkMode } = useApp();
  return darkMode ? darkColors : lightColors;
}

export function useStyles() {
  const colors = useTheme();
  return useMemo(() => makeStyles(colors), [colors]);
}
