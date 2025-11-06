// src/pages/Search.js
import React, { useState } from 'react';
import { searchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

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
      console.error('Search failed:', err);
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Search Movies</h2>

      {/* Search form */}
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          style={{
            padding: 8,
            width: 300,
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 8,
            padding: '8px 12px',
            border: 'none',
            backgroundColor: '#1976d2',
            color: '#fff',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && <Loader label="Searching movies..." />}

      {/* Error */}
      {!loading && error && (
        <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
      )}

      {/* No results */}
      {!loading && !error && movies.length === 0 && query && (
        <div style={{ color: '#555', marginTop: 20 }}>
          No movies found. Try another query.
        </div>
      )}

      {/* Results */}
      {!loading && movies.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'flex-start',
          }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
