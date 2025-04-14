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
  // TODO: Implement this by calling an API.

  return {
    data: [
      {
        mal_id: 1,
        title_english: 'Cowboy Bebop',
        title: 'Cowboy Bebop',
        synopsis: 'A group of bounty hunters travels the solar system.',
      },
      {
        mal_id: 5114,
        title_english: 'Fullmetal Alchemist: Brotherhood',
        title: 'Fullmetal Alchemist: Brotherhood',
        synopsis: 'Two brothers search for the Philosopher\'s Stone to restore their bodies.',
      },
    ],
  };
}
