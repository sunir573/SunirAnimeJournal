"use client";

import React, { useEffect, useState } from 'react';
import { AnimeInfo } from "@/services/anime";
import { Button } from "@/components/ui/button";

const WatchedPage = () => {
  const [animeList, setAnimeList] = useState<AnimeInfo[]>([]);

  useEffect(() => {
    const storedList = localStorage.getItem("watched");
    if (storedList) {
      setAnimeList(JSON.parse(storedList));
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Watched Anime</h1>
      {animeList.map((anime, index) => (
        <div key={index} className="border p-4 mb-2 rounded-md">
          <h2 className="text-xl font-semibold">{anime.title_english || anime.title}</h2>
          <p className="text-gray-600">{anime.synopsis || 'No description.'}</p>
        </div>
      ))}
      {animeList.length === 0 && <p>No anime in your watched list.</p>}
    </div>
  );
};

export default WatchedPage;
