import React, { useState } from 'react';
import { searchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(query);
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = (movie) => {
    // for now just log — Day 5 will call backend
    console.log('Add favorite:', movie.id, movie.title);
    alert(`(placeholder) will save movie "${movie.title}" to favorites later`);
  };

  return (
    <div>
      <h2>Search Movies</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          style={{ padding: 8, width: 300 }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: '8px 12px' }}>Search</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onAddFavorite={handleAddFavorite} />
        ))}
      </div>
    </div>
  );
}
