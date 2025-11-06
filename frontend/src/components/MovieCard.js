// src/components/MovieCard.js
import React, { useContext, useState } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../services/tmdb';

export default function MovieCard({ movie }) {
  const { user, token } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFavorite = async () => {
    if (!user || !token) {
      alert('Please log in to save favorites');
      return;
    }

    setSaving(true);
    try {
      await API.post(
        '/favorites',
        {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          rating: movie.vote_average,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSaved(true);
    } catch (err) {
      console.error('Add favorite error:', err);
      alert(err.response?.data?.error || 'Failed to save favorite');
    } finally {
      setSaving(false);
    }
  };

  const poster = getImageUrl(movie.poster_path);

  return (
    <div
      style={{
        width: 200,
        margin: 8,
        padding: 8,
        border: '1px solid #ddd',
        borderRadius: 8,
        backgroundColor: '#fafafa',
      }}
    >
      {/* Poster */}
      <div
        style={{
          height: 300,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#666' }}>No image</div>
        )}
      </div>

      {/* Movie details */}
      <h3 style={{ fontSize: 16, margin: '8px 0' }}>{movie.title}</h3>
      <p style={{ margin: 0 }}>⭐ Rating: {movie.vote_average ?? 'N/A'}</p>

      {/* Save button with spinner and dynamic state */}
      <button
        onClick={handleFavorite}
        disabled={saving || saved}
        style={{
          marginTop: 8,
          padding: '8px 12px',
          cursor: saving || saved ? 'not-allowed' : 'pointer',
          backgroundColor: saved ? '#4caf50' : '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minWidth: 150,
        }}
      >
        {saving ? (
          <>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.4)',
                borderLeft: '2px solid #fff',
                animation: 'spin 0.9s linear infinite',
              }}
            />
            Saving...
          </>
        ) : saved ? (
          'Saved ✅'
        ) : (
          'Save to Favorites'
        )}
      </button>

      {/* Spinner keyframes */}
      <style>
        {`@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }`}
      </style>
    </div>
  );
}
