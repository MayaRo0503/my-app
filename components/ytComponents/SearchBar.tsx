import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Props interface defining the methods the parent can pass
interface SearchBarProps {
  onSearch: (query: string) => void;
  onClose: () => void;
}

// This component renders a search input field and two buttons:
// one to initiate the search and one to close the search bar.
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Trigger the parent-provided search function if the input is not empty
  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Search YouTube"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {/* Pressing the search icon calls handleSearch */}
      <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
      {/* Pressing the close icon calls onClose (to hide the search bar) */}
      <TouchableOpacity onPress={onClose} style={styles.iconButton}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

// Styles for the search bar container, input field, and icons
const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#999",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  iconButton: {
    paddingHorizontal: 5,
  },
});
