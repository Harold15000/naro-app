import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import api from '../lib/api';
import { Streamer } from '../types';
import { StreamerCard } from '../components/StreamerCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStreamers = async () => {
      if (!query.trim()) {
        setStreamers([]);
        return;
      }
      setIsLoading(true);
      try {
        // En una app real, el backend debería tener un endpoint de búsqueda.
        // Simulamos filtrando la lista de disponibles.
        const res = await api.get('/api/streamers/available');
        const data = res.data;
        const streamersArray = Array.isArray(data) ? data : (data?.data || data?.streamers || []);
        const filtered = streamersArray.filter((s: Streamer) => 
          s.username.toLowerCase().includes(query.toLowerCase())
        );
        setStreamers(filtered);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchStreamers, 500);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="p-4 pb-24 max-w-5xl mx-auto">
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="text-text-secondary" size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar streamers por usuario..."
          className="w-full bg-surface-high border border-border rounded-2xl py-4 pl-12 pr-4 text-text-primary focus:outline-none focus:border-naro-pink transition-colors text-lg"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size={40} />
        </div>
      ) : query.trim() === '' ? (
        <div className="text-center py-20 text-text-secondary flex flex-col items-center gap-4">
          <SearchIcon size={48} className="opacity-20" />
          <p>Escribe para buscar streamers</p>
        </div>
      ) : streamers.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <p>No se encontraron resultados para "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {streamers.map(streamer => (
            <StreamerCard key={streamer.id} streamer={streamer} />
          ))}
        </div>
      )}
    </div>
  );
};
