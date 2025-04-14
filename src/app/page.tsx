"use client";

import { useState, useEffect } from "react";
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
    try {
      const storedList = localStorage.getItem(listType);
      let list = storedList ? JSON.parse(storedList) : [];

      const animeExists = list.some((item: AnimeInfo) => item.mal_id === anime.mal_id);
      if (animeExists) {
        toast({
          variant: "destructive",
          title: "Already in list",
          description: `${anime.title_english || anime.title} is already in your ${listType}.`,
        });
        return;
      }
      list.push(anime);
      localStorage.setItem(listType, JSON.stringify(list));
      toast({
        title: "Success",
        description: `Added ${anime.title_english || anime.title} to ${listType}.`,
      });
    } catch (error: any) {
      console.error("Failed to add anime:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add ${anime.title_english || anime.title} to ${listType}.`,
      });
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
        <Button onClick={handleSearch} style={{backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))'}}>Search</Button>
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
