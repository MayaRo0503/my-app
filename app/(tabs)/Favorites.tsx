import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getFavorites, type FavoriteVideo } from "@/utils/favoritesManager";

// This screen displays a list of favorite videos stored in local storage.
const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);

  // Load favorited videos from local storage when the component mounts.
  useEffect(() => {
    const loadFavorites = async () => {
      const favoritedVideos = await getFavorites();
      setFavorites(favoritedVideos);
    };

    loadFavorites();
  }, []);

  // Renders each favorite item with its thumbnail and title.
  const renderVideoItem = ({ item }: { item: FavoriteVideo }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => {
        router.push({
          pathname: "/screens/VideoPlayer",
          params: { videoId: item.id },
        });
      }}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Favorites</Text>
        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>No favorite videos yet.</Text>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// Styles for the Favorites screen layout.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  content: { padding: 10, flex: 1 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  list: { paddingBottom: 20 },
  videoItem: {
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnail: { height: 180, width: "100%" },
  title: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontWeight: "bold",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default Favorites;
