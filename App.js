import React from "react";
import { ActivityIndicator, View } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { AppProvider, useApp } from "./context/AppContext";
import { useTheme } from "./theme/styles";

import HomeScreen from "./screens/HomeScreen";
import BrowseScreen from "./screens/BrowseScreen";
import BookmarksScreen from "./screens/BookmarksScreen";
import SettingsScreen from "./screens/SettingsScreen";
import RecipeListScreen from "./screens/RecipeListScreen";
import RecipeDetailsScreen from "./screens/RecipeDetailsScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const BrowseStack = createNativeStackNavigator();
const BookmarksStack = createNativeStackNavigator();

// Screens reachable from more than one tab.
const sharedScreens = (Stack) => (
  <>
    <Stack.Screen name="Recipe List" component={RecipeListScreen} />
    <Stack.Screen name="Recipe Details" component={RecipeDetailsScreen} />
  </>
);

function useStackOptions() {
  const colors = useTheme();
  return {
    headerStyle: { backgroundColor: colors.header },
    headerTintColor: "#fff",
  };
}

function HomeStackScreen() {
  const options = useStackOptions();
  return (
    <HomeStack.Navigator screenOptions={options}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Recipe Finder" }}
      />
      {sharedScreens(HomeStack)}
    </HomeStack.Navigator>
  );
}

function BrowseStackScreen() {
  const options = useStackOptions();
  return (
    <BrowseStack.Navigator screenOptions={options}>
      <BrowseStack.Screen name="Browse" component={BrowseScreen} />
      {sharedScreens(BrowseStack)}
    </BrowseStack.Navigator>
  );
}

function BookmarksStackScreen() {
  const options = useStackOptions();
  return (
    <BookmarksStack.Navigator screenOptions={options}>
      <BookmarksStack.Screen name="Bookmarks" component={BookmarksScreen} />
      <BookmarksStack.Screen name="Recipe Details" component={RecipeDetailsScreen} />
    </BookmarksStack.Navigator>
  );
}

const ICONS = {
  HomeTab: ["home", "home-outline"],
  BrowseTab: ["list", "list-outline"],
  BookmarksTab: ["bookmark", "bookmark-outline"],
  SettingsTab: ["settings", "settings-outline"],
};

function RootNavigator() {
  const { darkMode, bookmarks, hydrated } = useApp();
  const colors = useTheme();

  const base = darkMode ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.divider,
    },
  };

  // Wait for AsyncStorage to load so the UI never flashes empty data.
  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#f8f1ff" }}>
        <ActivityIndicator size="large" color="#8e44ad" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.subtext,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={ICONS[route.name][focused ? 0 : 1]}
              size={size}
              color={color}
            />
          ),
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: "Home" }} />
        <Tab.Screen name="BrowseTab" component={BrowseStackScreen} options={{ title: "Browse" }} />
        <Tab.Screen
          name="BookmarksTab"
          component={BookmarksStackScreen}
          options={{
            title: "Bookmarks",
            tabBarBadge: bookmarks.length > 0 ? bookmarks.length : undefined,
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{
            title: "Settings",
            headerShown: true,
            headerStyle: { backgroundColor: colors.header },
            headerTintColor: "#fff",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
    