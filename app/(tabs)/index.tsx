import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "@/components/ytComponents/TopBar";
import FilterBar from "@/components/ytComponents/FilterBar";
import { router } from "expo-router";
import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";

// The main home screen that displays a list of videos based on selected category.
type VideoItem = {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
};

const index = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("popular");

  // Fetch videos from the YouTube API whenever the selected category changes.
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${YOUTUBE_API_URL}?part=snippet&maxResults=10&q=${selectedCategory}&type=video&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        if (response.ok) {
          setVideos(data.items);
        } else {
          throw new Error(data.error.message || "Failed to fetch videos");
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCategory]);

  // Helper to format date strings into a more human-friendly format.
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Renders a single video item in the list.
  const renderVideoItem = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => {
        router.push({
          pathname: "/screens/VideoPlayer",
          params: { videoId: item.id.videoId },
        });
      }}
      accessibilityRole="button"
      accessibilityLabel={`Play video: ${item.snippet.title}`}
    >
      <Image
        source={{ uri: item.snippet.thumbnails.medium.url }}
        style={styles.thumbnail}
        accessibilityRole="image"
        accessibilityLabel={`Thumbnail for ${item.snippet.title}`}
      />
      <View style={styles.videoInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {item.snippet.title}
        </Text>
        <Text style={styles.channelTitle}>{item.snippet.channelTitle}</Text>
        <Text style={styles.publishDate}>
          {formatDate(item.snippet.publishedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* The top bar includes logo and search functionality */}
      <TopBar />
      {/* The filter bar to switch between categories */}
      <FilterBar
        setCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF0000" />
        ) : error ? (
          // Display an error message if something goes wrong with the API request
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#FF0000" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          // The list of videos
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id.videoId}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// Styles for the home screen layout and list items.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  content: { flex: 1, padding: 10 },
  list: { paddingBottom: 20 },
  videoItem: {
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: { height: 200, width: "100%" },
  videoInfo: { padding: 10 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 5, color: "#333" },
  channelTitle: { fontSize: 14, color: "#666", marginBottom: 3 },
  publishDate: { fontSize: 12, color: "#999" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: {
    color: "#FF0000",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
});

export default index;
