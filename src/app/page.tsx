"use client";

import { useState } from "react";
import { searchAnime, AnimeInfo } from "@/services/anime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeInfo[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    const searchResults = await searchAnime(query);
    setResults(searchResults.data);
  };

  const handleAddToList = async (anime: AnimeInfo, listType: "watched" | "watchlist") => {
    // Confirmation dialog
    const confirmed = window.confirm(`Add "${anime.title_english || anime.title}" to ${listType}?`);

    if (confirmed) {
      try {
        // Simulate adding to list (replace with actual logic)
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

        // Show success toast
        toast({
          title: "Success",
          description: `Added ${anime.title_english || anime.title} to ${listType}.`,
        });
      } catch (error) {
        // Show failure toast
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to add ${anime.title_english || anime.title} to ${listType}.`,
        });
      }
    }
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
        <Button onClick={handleSearch} className="bg-primary text-primary-foreground">Search</Button>
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
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary">Add to Watched</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to add {anime.title_english || anime.title} to your watched list?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleAddToList(anime, "watched")}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary">Add to Watchlist</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to add {anime.title_english || anime.title} to your watchlist?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleAddToList(anime, "watchlist")}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
