import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StreamerCard } from '../components/StreamerCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import api from '../lib/api';
import { Streamer } from '../types';
import { Zap } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'incall'>('all');
  const [isMatching, setIsMatching] = useState(false);
  const navigate = useNavigate();

  const fetchStreamers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/api/streamers/available');
      const data = res.data;
      setStreamers(Array.isArray(data) ? data : (data?.data || data?.streamers || []));
    } catch (err) {
      setError('Error al cargar streamers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStreamers();
  }, []);

  const handleMatch = async () => {
    setIsMatching(true);
    try {
      const res = await api.get('/api/streamers/random');
      if (res.data?.streamer?.id) {
        navigate(`/streamer/${res.data.streamer.id}`);
      }
    } catch (err) {
      console.error('Match failed', err);
    } finally {
      setIsMatching(false);
    }
  };

  const filteredStreamers = streamers.filter(s => {
    if (filter === 'online') return s.is_online && !s.is_in_call;
    if (filter === 'incall') return s.is_in_call;
    return true;
  });

  return (
    <div className="p-4 pb-24">
      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'online', 'incall'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-naro-pink text-white' 
                : 'bg-surface-high text-text-secondary hover:text-text-primary'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'online' ? 'Online' : 'En llamada'}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size={40} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ErrorMessage message={error} />
          <button onClick={fetchStreamers} className="mt-4 text-naro-pink underline">Reintentar</button>
        </div>
      ) : filteredStreamers.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <p>No hay streamers disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStreamers.map(streamer => (
            <StreamerCard key={streamer.id} streamer={streamer} />
          ))}
        </div>
      )}

      {/* Match FAB */}
      <button
        onClick={handleMatch}
        disabled={isMatching}
        className="fixed bottom-24 right-4 w-16 h-16 rounded-full bg-naro-gradient shadow-[0_0_20px_rgba(240,61,127,0.5)] flex items-center justify-center text-white hover:scale-105 transition-transform disabled:opacity-70 z-30"
      >
        {isMatching ? <LoadingSpinner size={24} className="text-white" /> : <Zap size={28} fill="currentColor" />}
      </button>
    </div>
  );
};
