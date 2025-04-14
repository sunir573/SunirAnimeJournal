"use client";

import { useState } from "react";
import { searchAnime, AnimeInfo } from "@/services/anime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeInfo[]>([]);

  const handleSearch = async () => {
    const searchResults = await searchAnime(query);
    setResults(searchResults.data);
  };

  const handleAddToList = async (anime: AnimeInfo, listType: "watched" | "watchlist") => {
    alert(`Added ${anime.title_english || anime.title} to ${listType}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-4">
        <Input
          type="text"
          placeholder="Search for anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((anime) => (
          <Card key={anime.mal_id}>
            <CardHeader>
              <CardTitle>{anime.title_english || anime.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{anime.synopsis || "No synopsis available."}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => handleAddToList(anime, "watched")} variant="secondary">
                Add to Watched
              </Button>
              <Button onClick={() => handleAddToList(anime, "watchlist")} variant="secondary">
                Add to Watchlist
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
