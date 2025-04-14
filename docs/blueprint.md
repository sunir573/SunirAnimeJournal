# **App Name**: Anime Explorer

## Core Features:

- Search Bar: Implement a search bar for users to input anime titles.
- Search Results Display: Display anime search results, showing title, synopsis, and options to add to 'Watched' or 'Watchlist'.
- List Pages: Two separate pages to display anime in 'Watched' and 'Watchlist' categories.
- Add to List: Functionality to add an anime to either 'Watched' or 'Watchlist'.

## Style Guidelines:

- Maintain the existing dark background (#121212) and white text for consistency.
- Use the current blue (#2196f3) for buttons and interactive elements.
- Accent color: A vibrant purple (#BB86FC) to highlight important information or interactive elements, providing contrast and visual interest.
- Ensure the search bar is prominently displayed at the top of the search page.
- Display anime results in a grid or list format for easy browsing.
- Use subtle animations or transitions when adding anime to lists or displaying recommendations.

## Original User Request:
// Folder structure: // anime-journal-app/ // ├── backend/ (Node.js Express server) // ├── frontend/ (React app) // └── README.md

// ==== backend/index.js ==== const express = require('express'); const cors = require('cors'); const axios = require('axios'); const app = express();

app.use(cors()); app.use(express.json());

// Jikan API Proxy app.get('/api/search', async (req, res) => { const { q } = req.query; try { const response = await axios.get(https://api.jikan.moe/v4/anime?q=${q}&limit=10); res.json(response.data); } catch (error) { res.status(500).json({ error: 'Failed to fetch anime data' }); } });

const PORT = process.env.PORT || 5000; app.listen(PORT, () => console.log(Server running on port ${PORT}));

// ==== frontend/src/App.jsx ==== import React, { useState, useEffect } from 'react'; import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; import SearchPage from './components/SearchPage'; import WatchedPage from './components/WatchedPage'; import WatchlistPage from './components/WatchlistPage'; import './App.css';

const App = () => { return ( <Router> <div className="app"> <nav className="navbar"> <div className="menu"> <Link to="/">Home</Link> <Link to="/watched">Watched</Link> <Link to="/watchlist">Watchlist</Link> </div> </nav> <Routes> <Route path="/" element={<SearchPage />} /> <Route path="/watched" element={<WatchedPage />} /> <Route path="/watchlist" element={<WatchlistPage />} </Routes> </div> </Router> ); };

export default App;

// ==== frontend/src/components/SearchPage.jsx ==== import React, { useState } from 'react'; import axios from 'axios'; import { addDoc, collection } from 'firebase/firestore'; import { db, auth } from '../firebase';

const SearchPage = () => { const [query, setQuery] = useState(''); const [results, setResults] = useState([]);

const searchAnime = async () => { const res = await axios.get(http://localhost:5000/api/search?q=${query}); setResults(res.data.data); };

const handleAdd = async (anime, status) => { const confirmed = window.confirm(Add "${anime.title}" to ${status}?); if (!confirmed) return;

const entry = {
 title: anime.title_english || anime.title,
 description: anime.synopsis || 'No description.',
 director: 'Unknown',
 author: 'Unknown',
 status,
 userId: auth.currentUser?.uid || 'anonymous'
};

try {
 await addDoc(collection(db, 'animeEntries'), entry);
 alert('Anime added successfully.');
} catch (err) {
 alert('Failed to add anime.');
}

};

return ( <div className="search-page"> <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anime..." /> <button onClick={searchAnime}>Search</button> <div className="results"> {results.map(anime => ( <div key={anime.mal_id} className="anime-card"> <h3>{anime.title_english || anime.title}</h3> <p>{anime.synopsis}</p> <button onClick={() => handleAdd(anime, 'watched')}>Watched</button> <button onClick={() => handleAdd(anime, 'watchlist')}>Watchlist</button> </div> ))} </div> </div> ); };

export default SearchPage;

// ==== frontend/src/components/WatchedPage.jsx & WatchlistPage.jsx ==== // Duplicate this component and change the status filter import React, { useEffect, useState } from 'react'; import { collection, query, where, getDocs } from 'firebase/firestore'; import { db, auth } from '../firebase';

const ListPage = ({ status }) => { const [animeList, setAnimeList] = useState([]);

useEffect(() => { const fetchList = async () => { const q = query( collection(db, 'animeEntries'), where('userId', '==', auth.currentUser?.uid || 'anonymous'), where('status', '==', status) ); const snapshot = await getDocs(q); const items = snapshot.docs.map(doc => doc.data()); setAnimeList(items); }; fetchList(); }, [status]);

return ( <div className="list-page"> <h2>{status.charAt(0).toUpperCase() + status.slice(1)} List</h2> {animeList.map((anime, idx) => ( <div key={idx} className="anime-card"> <h3>{anime.title}</h3> <p>{anime.description}</p> </div> ))} </div> ); };

export default ListPage;

// ==== frontend/src/components/WatchedPage.jsx ==== import ListPage from './ListPage'; export default () => <ListPage status="watched" />;

// ==== frontend/src/components/WatchlistPage.jsx ==== import ListPage from './ListPage'; export default () => <ListPage status="watchlist" />;

// ==== frontend/src/firebase.js ==== import { initializeApp } from 'firebase/app'; import { getFirestore } from 'firebase/firestore'; import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = { apiKey: 'YOUR_API_KEY', authDomain: 'YOUR_PROJECT.firebaseapp.com', projectId: 'YOUR_PROJECT_ID', storageBucket: 'YOUR_PROJECT.appspot.com', messagingSenderId: 'SENDER_ID', appId: 'APP_ID', };

const app = initializeApp(firebaseConfig); export const db = getFirestore(app); export const auth = getAuth(app); signInAnonymously(auth);

// ==== frontend/src/App.css ==== /* Basic styling for modern blue/black/white theme */ body {
 background-color: #121212;
 color: white;
 font-family: sans-serif;
}

.navbar {
 background-color: #0d47a1;
 padding: 1rem;
 display: flex;
 justify-content: space-around;
}

.anime-card {
 background-color: #1e1e1e;
 margin: 1rem;
 padding: 1rem;
 border-radius: 10px;
}

button {
 margin-right: 10px;
 background-color: #2196f3;
 color: white;
 border: none;
 padding: 0.5rem 1rem;
 border-radius: 5px;
}

input {
 padding: 0.5rem;
 margin-right: 10px;
 width: 300px;
}

/* More styling as needed */
  