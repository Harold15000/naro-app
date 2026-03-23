import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Gift as GiftIcon } from 'lucide-react';
import { Streamer } from '../types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import api from '../lib/api';

export const StreamerProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [streamer, setStreamer] = useState<Streamer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStreamer = async () => {
      try {
        const res = await api.get(`/api/streamers/${id}`);
        setStreamer(res.data);
      } catch (err) {
        setError('No se pudo cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchStreamer();
  }, [id]);

  const handleCall = async () => {
    if (!streamer) return;
    setIsCalling(true);
    setError('');
    try {
      const res = await api.post(`/api/streams/join/${streamer.id}`);
      navigate(`/call/${res.data.stream.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar llamada');
      setIsCalling(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size={40} /></div>;
  }

  if (error || !streamer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ErrorMessage message={error || 'Streamer no encontrado'} />
        <button onClick={() => navigate(-1)} className="mt-4 text-naro-pink">Volver</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="w-full aspect-[3/4] md:aspect-video relative bg-surface-high">
        {streamer.avatar_url ? (
          <img src={streamer.avatar_url} alt={streamer.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-naro-gradient opacity-80">
            <span className="text-6xl font-bold text-white">{streamer.username.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white">{streamer.username}</h1>
            {streamer.is_online && !streamer.is_in_call && (
              <div className="w-3 h-3 bg-naro-green rounded-full shadow-[0_0_10px_#10B981]" />
            )}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💎</span>
            <span className="text-naro-blue font-bold text-2xl">{streamer.price_per_minute}/min</span>
          </div>
          {streamer.bio && (
            <p className="text-text-secondary text-lg max-w-2xl">{streamer.bio}</p>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-end gap-4 pb-safe">
        <ErrorMessage message={error} className="justify-center" />
        
        <div className="flex gap-4">
          <button
            onClick={() => {/* TODO: Open gift modal */}}
            className="flex-1 bg-surface-high border border-border text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-surface transition-colors"
          >
            <GiftIcon size={20} className="text-naro-pink" />
            <span>Enviar regalo</span>
          </button>
          
          <button
            onClick={handleCall}
            disabled={isCalling || (!streamer.is_online && !streamer.is_in_call)}
            className="flex-[2] bg-naro-gradient text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_20px_rgba(240,61,127,0.3)]"
          >
            {isCalling ? (
              <LoadingSpinner size={24} className="text-white" />
            ) : (
              <>
                <Video size={24} />
                <span className="text-lg">Llamar — {streamer.price_per_minute} 💎/min</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
