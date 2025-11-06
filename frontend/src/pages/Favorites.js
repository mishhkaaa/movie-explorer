// src/pages/Favorites.js
import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';

export default function Favorites() {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🧩 Fetch user’s favorites
  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/favorites', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setFavorites(res.data);
    } catch (err) {
      console.error('Fetch favorites failed:', err);
      setError(err.response?.data?.error || 'Unable to load favorites');
    } finally {
      setLoading(false);
    }
  };

  // ❌ Remove a favorite movie
  const removeFavorite = async (movieId) => {
    try {
      await API.delete(`/favorites/${movieId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setFavorites((prev) => prev.filter((f) => f.movieId !== movieId));
    } catch (err) {
      console.error('Delete favorite failed:', err);
      setError('Failed to remove favorite');
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🌀 Loading state
  if (loading)
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Loader label="Loading favorites..." />
      </div>
    );

  // ⚠️ Error state
  if (error)
    return (
      <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>
        {error}
      </div>
    );

  // ℹ️ Empty state
  if (favorites.length === 0)
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        No favorites yet 😢
      </div>
    );

  // ✅ Render favorites
  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Favorites</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {favorites.map((f) => (
          <div
            key={f.movieId}
            style={{
              width: 180,
              border: '1px solid #ccc',
              borderRadius: 6,
              padding: 8,
              background: '#fafafa',
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${f.posterPath}`}
              alt={f.title}
              style={{ width: '100%', borderRadius: 6 }}
            />
            <h4 style={{ margin: '6px 0' }}>{f.title}</h4>
            <p>⭐ {f.rating}</p>
            <button onClick={() => removeFavorite(f.movieId)}>
              Remove ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
