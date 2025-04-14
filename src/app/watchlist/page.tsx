"use client";

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Button } from "@/components/ui/button";
import { signInAnonymously } from 'firebase/auth';

const WatchlistPage = () => {
  const [animeList, setAnimeList] = useState([]);
    const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchList = async () => {
      if (!user) {
        console.log("User not authenticated.");
        return;
      }

      const q = query(
        collection(db, 'animeEntries'),
        where('userId', '==', user.uid),
        where('status', '==', 'watchlist')
      );

      try {
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => doc.data());
        setAnimeList(items);
      } catch (error) {
        console.error("Error fetching watchlist anime:", error);
      }
    };

    if (user) {
      fetchList();
    }
  }, [user]);

    if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p>Please sign in to view your watchlist.</p>
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
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      {animeList.map((anime, index) => (
        <div key={index} className="border p-4 mb-2 rounded-md">
          <h2 className="text-xl font-semibold">{anime.title}</h2>
          <p className="text-gray-600">{anime.description}</p>
        </div>
      ))}
      {animeList.length === 0 && <p>No anime in your watchlist.</p>}
    </div>
  );
};

export default WatchlistPage;
