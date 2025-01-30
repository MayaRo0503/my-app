import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import SearchBar from "./SearchBar";
import { useRouter } from "expo-router";

// This component displays the app logo and a search icon by default,
// and toggles between that view and a visible SearchBar when needed.
const TopBar: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const router = useRouter();

  // Toggles the search bar visibility
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  // Called when the user submits a search query in the SearchBar
  const handleSearch = (query: string) => {
    router.push({
      pathname: "/screens/SearchResults",
      params: { query },
    });
    setIsSearchVisible(false);
  };

  return (
    <View style={styles.container}>
      {isSearchVisible ? (
        // Render the SearchBar if search mode is active
        <SearchBar onSearch={handleSearch} onClose={toggleSearch} />
      ) : (
        <>
          {/* Render the logo and search icon if not in search mode */}
          <View style={styles.logoContainer}>
            <Entypo name="youtube" size={40} color="red" />
            <Text style={styles.logoText}>MyTube</Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={toggleSearch}>
              <AntDesign name="search1" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default TopBar;

// Styles for the top bar container, logo, and icons
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 6,
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 16,
  },
});
