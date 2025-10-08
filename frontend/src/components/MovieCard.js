import React from 'react';
import { getImageUrl } from '../services/tmdb';

export default function MovieCard({ movie, onAddFavorite }) {
  const poster = getImageUrl(movie.poster_path);

  return (
    <div style={{
      width: 200, margin: 8, padding: 8, border: '1px solid #ddd', borderRadius: 6
    }}>
      <div style={{ height: 300, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {poster ? (
          <img src={poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: '#666' }}>No image</div>
        )}
      </div>

      <h3 style={{ fontSize: 16, margin: '8px 0' }}>{movie.title}</h3>
      <p style={{ margin: 0 }}>Rating: {movie.vote_average ?? 'N/A'}</p>

      <button
        onClick={() => onAddFavorite && onAddFavorite(movie)}
        style={{ marginTop: 8, padding: '8px 12px', cursor: 'pointer' }}
      >
        Save to Favorites
      </button>
    </div>
  );
}
