import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

// Custom icon component for the bottom tab bar.
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  // Manually setting the color scheme to "light" for demonstration purposes.
  const colorScheme = "light";

  // Rendering a Tabs layout with three routes: Home, Shorts, and Favorites.
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarItemStyle: {
          height: 80,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={22} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="Shorts"
        options={{
          headerShown: false,
          title: "Shorts",
          tabBarIcon: ({ color }) => (
            <AntDesign name="videocamera" size={22} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="Favorites"
        options={{
          headerShown: false,
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={22} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
