// src/pages/Favorites.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await API.get('/favorites');
      setFavorites(res.data);
    } catch (err) {
      console.error('Fetch favorites failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (movieId) => {
    try {
      await API.delete(`/favorites/${movieId}`);
      setFavorites(prev => prev.filter(f => f.movieId !== movieId));
    } catch (err) {
      console.error('Delete favorite failed:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (favorites.length === 0) return <div>No favorites yet 😢</div>;

  return (
    <div>
      <h2>My Favorites</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {favorites.map(f => (
          <div key={f.movieId} style={{ width: 180, border: '1px solid #ccc', padding: 8 }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${f.posterPath}`}
              alt={f.title}
              style={{ width: '100%' }}
            />
            <h4>{f.title}</h4>
            <p>⭐ {f.rating}</p>
            <button onClick={() => removeFavorite(f.movieId)}>Remove ❌</button>
          </div>
        ))}
      </div>
    </div>
  );
}
