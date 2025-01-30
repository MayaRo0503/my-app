import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { YOUTUBE_API_KEY } from "@env";
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from "@/utils/favoritesManager";

// Retrieve the device's screen width to maintain video aspect ratio.
const { width } = Dimensions.get("window");
const videoHeight = width * 0.5625; // 16:9 aspect ratio

// Structure for storing video details fetched from the YouTube Data API.
interface VideoDetails {
  title: string;
  description: string;
  publishedAt: string;
  channelTitle: string;
  viewCount: string;
  likeCount: string;
  duration: string;
}

const VideoPlayer: React.FC = () => {
  // Get the videoId from route parameters.
  const { videoId } = useLocalSearchParams<{ videoId: string }>();

  // States for fullscreen, details, loading indicator, and favorite status.
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Fetch video details and favorite status once the videoId is available.
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          setVideoDetails({
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle,
            viewCount: item.statistics.viewCount,
            likeCount: item.statistics.likeCount,
            duration: item.contentDetails.duration,
          });
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      const favorited = await isFavorite(videoId);
      setIsFavorited(favorited);
    };

    if (videoId) {
      fetchVideoDetails();
      checkFavoriteStatus();
    }
  }, [videoId]);

  // Return an error view if no video ID is provided.
  if (!videoId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: No video selected</Text>
      </View>
    );
  }

  // Toggles fullscreen mode for the video player.
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Navigate back to the previous screen.
  const handleGoBack = () => {
    router.back();
  };

  // Handles add/remove from favorites based on the current status.
  const handleToggleFavorite = async () => {
    if (isFavorited) {
      await removeFromFavorites(videoId);
    } else {
      await addToFavorites({
        id: videoId,
        title: videoDetails?.title || "",
        thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
      });
    }
    setIsFavorited(!isFavorited);
  };

  // Format the date string to a more readable format.
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Convert ISO 8601 duration format (e.g. PT5M30S) to a human-readable format.
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) {
      return "0:00";
    }
    const hours = Number((match[1] && match[1].replace("H", "")) || 0);
    const minutes = Number((match[2] && match[2].replace("M", "")) || 0);
    const seconds = Number((match[3] && match[3].replace("S", "")) || 0);
    return `${hours > 0 ? `${hours}:` : ""}${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // Simplify large numbers (e.g., 45,000 to 45K, 1,000,000 to 1.0M).
  const formatViewCount = (count: string) => {
    const num = Number.parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <View style={styles.container}>
      {/* Custom header configuration */}
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
              <Text style={styles.backButtonText}>BACK</Text>
            </TouchableOpacity>
          ),
          headerTitle: "Video Player",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerRight: () => (
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.favoriteButton}
            >
              <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView>
        {/* Main video container with optional fullscreen mode */}
        <View
          style={[
            styles.videoContainer,
            isFullscreen && styles.fullscreenVideo,
          ]}
        >
          <WebView
            style={styles.webview}
            source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
            javaScriptEnabled={true}
            allowsFullscreenVideo={true}
          />
        </View>
        {/* Button to toggle fullscreen */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={toggleFullscreen}
            style={styles.controlButton}
          >
            <Ionicons
              name={isFullscreen ? "contract" : "expand"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        {/* Loading indicator and video details */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF0000"
            style={styles.loader}
          />
        ) : (
          videoDetails && (
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{videoDetails.title}</Text>
              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                  {formatViewCount(videoDetails.viewCount)} views
                </Text>
                <Text style={styles.statsText}>
                  {formatDuration(videoDetails.duration)}
                </Text>
                <Text style={styles.statsText}>
                  {videoDetails.likeCount} likes
                </Text>
              </View>
              <Text style={styles.channelTitle}>
                {videoDetails.channelTitle}
              </Text>
              <Text style={styles.publishDate}>
                Published on {formatDate(videoDetails.publishedAt)}
              </Text>
              {/* Toggleable description section */}
              <TouchableOpacity
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <Text style={styles.descriptionHeader}>Description</Text>
                <Text
                  style={[
                    styles.description,
                    !isDescriptionExpanded && styles.descriptionCollapsed,
                  ]}
                  numberOfLines={isDescriptionExpanded ? undefined : 3}
                >
                  {videoDetails.description}
                </Text>
                <Text style={styles.expandButton}>
                  {isDescriptionExpanded ? "Show Less" : "Show More"}
                </Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

// Styles for the video player and its UI components.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    width: width,
    height: videoHeight,
  },
  fullscreenVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  controlButton: {
    padding: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: "#111",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statsText: {
    color: "#aaa",
    fontSize: 14,
  },
  channelTitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 5,
  },
  publishDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  descriptionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ddd",
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
  },
  descriptionCollapsed: {
    maxHeight: 60,
    overflow: "hidden",
  },
  expandButton: {
    color: "#3ea6ff",
    marginTop: 5,
    fontSize: 14,
  },
  favoriteButton: {
    paddingRight: 15,
  },
  loader: {
    marginTop: 20,
  },
});

export default VideoPlayer;
