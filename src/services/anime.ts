'use server';

import axios from 'axios';

/**
 * Represents basic information about an anime.
 */
export interface AnimeInfo {
  /**
   * The unique identifier for the anime.
   */
  mal_id: number;
  /**
   * The title of the anime in English.
   */
  title_english: string | null;
  /**
   * The original title of the anime.
   */
  title: string;
  /**
   * A brief summary of the anime's plot.
   */
  synopsis: string | null;
  /**
   * URL to the anime's image.
   */
  images?: {
    jpg: {
      image_url: string;
    };
  };
}

/**
 * Represents the response from the anime search API.
 */
export interface AnimeSearchResponse {
  /**
   * An array of AnimeInfo objects representing the search results.
   */
  data: AnimeInfo[];
}

/**
 * Asynchronously searches for anime by a given query.
 *
 * @param query The search query string.
 * @returns A promise that resolves to an AnimeSearchResponse object containing the search results.
 */
export async function searchAnime(query: string): Promise<AnimeSearchResponse> {
  try {
    const response = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${query}&limit=10`
    );

    const animeData: AnimeInfo[] = response.data.data.map((anime: any) => ({
      mal_id: anime.mal_id,
      title_english: anime.title_english || null,
      title: anime.title,
      synopsis: anime.synopsis || null,
      images: anime.images, // Include image URLs
    }));
    return { data: animeData };
  } catch (error) {
    console.error('Error fetching anime:', error);
    return { data: [] };
  }
}
