import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { YOUTUBE_API_KEY } from "@env";

// Define the structure of a single video returned by the API
interface Video {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
    channelTitle: string;
    publishedAt: string;
    description: string;
  };
}

export default function SearchResults() {
  // Retrieve the 'query' parameter from the route
  const { query } = useLocalSearchParams<{ query: string }>();

  // State to hold the list of videos and loading status
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // This allows navigation to different screens using the Expo Router
  const router = useRouter();

  // Fetch search results from the YouTube Data API when 'query' changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query ?? ""
          )}&type=video&key=${YOUTUBE_API_KEY}&maxResults=20&order=relevance`
        );
        const data = await response.json();
        setVideos(data.items);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Helper function to format the publish date into a relative time string
  const formatPublishDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  };

  // Render function for each video item in the FlatList
  const renderVideoItem = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => {
        router.push({
          pathname: "/screens/VideoPlayer",
          params: { videoId: item.id.videoId },
        });
      }}
    >
      <Image
        source={{ uri: item.snippet.thumbnails.medium.url }}
        style={styles.thumbnail}
      />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.snippet.title}
        </Text>
        <Text style={styles.channelTitle}>{item.snippet.channelTitle}</Text>
        <Text style={styles.publishDate}>
          {formatPublishDate(item.snippet.publishedAt)}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.snippet.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Show a loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <>
      {/* Override the header title and back button */}
      <Stack.Screen
        options={{
          headerTitle: "Search Results",
          headerBackTitle: "Back",
        }}
      />

      <View style={styles.container}>
        <Text style={styles.searchQueryText}>Search results for: {query}</Text>
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id.videoId}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </>
  );
}

// Styles for the components in this screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchQueryText: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  videoItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  thumbnail: {
    width: 120,
    height: 90,
  },
  videoInfo: {
    flex: 1,
    padding: 8,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  channelTitle: {
    fontSize: 14,
    color: "#606060",
    marginBottom: 2,
  },
  publishDate: {
    fontSize: 12,
    color: "#606060",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#606060",
  },
});
