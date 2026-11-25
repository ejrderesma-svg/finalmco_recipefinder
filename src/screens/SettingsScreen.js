import React from "react";
import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";
import { useApp } from "../context/AppContext";
import { useStyles, useTheme } from "../theme/styles";

export default function SettingsScreen() {
  const styles = useStyles();
  const colors = useTheme();
  const {
    darkMode,
    toggleDarkMode,
    bookmarks,
    recents,
    clearBookmarks,
    clearRecents,
  } = useApp();

  const confirm = (title, message, onConfirm) =>
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: onConfirm },
    ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <View style={styles.settingsRow}>
        <Text style={styles.settingsLabel}>Dark mode</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ true: colors.primary }}
        />
      </View>

      <TouchableOpacity
        style={styles.settingsRow}
        onPress={() =>
          confirm("Clear recent searches?", "This can't be undone.", clearRecents)
        }
      >
        <Text style={styles.settingsLabel}>Clear recent searches</Text>
        <Text style={styles.smallText}>{recents.length}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsRow}
        onPress={() =>
          confirm("Remove all bookmarks?", "This can't be undone.", clearBookmarks)
        }
      >
        <Text style={styles.settingsLabel}>Clear all bookmarks</Text>
        <Text style={styles.smallText}>{bookmarks.length}</Text>
      </TouchableOpacity>

      <Text style={[styles.smallText, { marginTop: 20 }]}>
        Bookmarks, recent searches and your theme are saved on this device.
      </Text>
    </View>
  );
}
