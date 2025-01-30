import AsyncStorage from "@react-native-async-storage/async-storage";

export interface FavoriteVideo {
  id: string;
  title: string;
  thumbnail: string;
}

const FAVORITES_KEY = "favorite_videos";

export const addToFavorites = async (video: FavoriteVideo) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = [...favorites, video];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error("Error adding to favorites:", error);
  }
};

export const removeFromFavorites = async (videoId: string) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter((v) => v.id !== videoId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error("Error removing from favorites:", error);
  }
};

export const getFavorites = async (): Promise<FavoriteVideo[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

export const isFavorite = async (videoId: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some((v) => v.id === videoId);
};
