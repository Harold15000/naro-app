import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Streamer } from '../types';

interface StreamerCardProps {
  streamer: Streamer;
}

export const StreamerCard: React.FC<StreamerCardProps> = ({ streamer }) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    if (streamer.is_in_call) {
      return <div className="absolute top-2 right-2 bg-naro-red text-white text-xs font-bold px-2 py-1 rounded-full">En llamada</div>;
    }
    if (streamer.is_online) {
      return <div className="absolute top-2 right-2 bg-naro-green text-white text-xs font-bold px-2 py-1 rounded-full">Online</div>;
    }
    return <div className="absolute top-2 right-2 bg-text-secondary text-white text-xs font-bold px-2 py-1 rounded-full">Offline</div>;
  };

  return (
    <div 
      onClick={() => navigate(`/streamer/${streamer.id}`)}
      className="bg-surface border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-naro-pink transition-colors group"
    >
      <div className="aspect-[3/4] relative bg-surface-high">
        {streamer.avatar_url ? (
          <img src={streamer.avatar_url} alt={streamer.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-naro-gradient opacity-80">
            <span className="text-4xl font-bold text-white">{streamer.username.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        {getStatusBadge()}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-lg truncate">{streamer.username}</h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm">💎</span>
            <span className="text-naro-blue font-semibold text-sm">{streamer.price_per_minute}/min</span>
          </div>
        </div>
      </div>
    </div>
  );
};
