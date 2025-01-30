import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";

// Props for managing and displaying the categories.
type FilterBarProps = {
  setCategory: (category: string) => void; // Callback to update the selected category.
  selectedCategory: string; // Currently selected category.
};

const FilterBar: React.FC<FilterBarProps> = ({
  setCategory,
  selectedCategory,
}) => {
  // List of categories and their corresponding query text for the API.
  const categories = [
    { name: "All", apiQuery: "popular" },
    { name: "Music", apiQuery: "music" },
    { name: "Mixes", apiQuery: "mix" },
    { name: "News", apiQuery: "news" },
    { name: "Tarot", apiQuery: "tarot" },
    { name: "Podcasts", apiQuery: "podcast" },
    { name: "Live", apiQuery: "live" },
    { name: "Recently upload", apiQuery: "recently uploaded" },
    { name: "New", apiQuery: "new" },
  ];

  return (
    <View
      style={{
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      {/* Horizontal scrolling container for all category buttons */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCategory(category.apiQuery)}
              style={{
                backgroundColor:
                  selectedCategory === category.apiQuery ? "black" : "#DDDDDD",
                padding: 10,
                paddingHorizontal: 18,
                borderRadius: 10,
                marginHorizontal: 5,
              }}
            >
              <Text
                style={{
                  color:
                    selectedCategory === category.apiQuery ? "white" : "black",
                }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FilterBar;
