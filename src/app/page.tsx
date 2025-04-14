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
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeInfo[]>([]);
  const { toast } = useToast();
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async () => {
    const searchResults = await searchAnime(query);
    setResults(searchResults.data);
  };

  const handleAddToList = async (anime: AnimeInfo, status: "watched" | "watchlist") => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to add anime to your list.",
      });
      return;
    }

    try {
      const entry = {
        title: anime.title_english || anime.title,
        description: anime.synopsis || 'No description.',
        status,
        userId: user.uid,
      };

      await addDoc(collection(db, 'animeEntries'), entry);

      toast({
        title: "Success",
        description: `Added ${anime.title_english || anime.title} to ${status}.`,
      });
    } catch (error: any) {
      console.error("Failed to add anime:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add ${anime.title_english || anime.title} to ${status}.`,
      });
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p>Please sign in to continue.</p>
        <Button onClick={() => {
              signInAnonymously(auth)
              .then(() => {
                console.log('Signed in anonymously.');
              })
              .catch((error) => {
                console.error('Failed to sign in anonymously:', error);
              });
            }}>Sign In Anonymously</Button>
      </div>
    );
  }


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
