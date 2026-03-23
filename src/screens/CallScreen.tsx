import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Send, Gift as GiftIcon } from 'lucide-react';
import { socket } from '../lib/socket';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { DiamondCounter } from '../components/DiamondCounter';
import { GiftAnimationOverlay } from '../components/GiftAnimationOverlay';
import { Gift } from '../types';

export const CallScreen: React.FC = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance } = useWallet();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [duration, setDuration] = useState(0);
  const [streamDetails, setStreamDetails] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!streamId) return;

    socket.emit('call:join', { streamId });

    api.get(`/api/streams/${streamId}`)
      .then(res => setStreamDetails(res.data))
      .catch(console.error);

    const heartbeatInterval = setInterval(() => {
      socket.emit('call:heartbeat', { streamId });
    }, 30000);

    const timerInterval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    const handleCallEnded = (data: { reason: string }) => {
      alert(`Llamada finalizada: ${data.reason}`);
      navigate('/');
    };

    const handleNewMessage = (msg: any) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    socket.on('call:ended', handleCallEnded);
    socket.on('chat:new_message', handleNewMessage);

    api.get('/api/gifts').then(res => {
      const data = res.data;
      setGifts(Array.isArray(data) ? data : (data?.data || data?.gifts || []));
    }).catch(console.error);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(timerInterval);
      socket.emit('call:leave', { streamId });
      socket.off('call:ended', handleCallEnded);
      socket.off('chat:new_message', handleNewMessage);
    };
  }, [streamId, navigate]);

  const handleEndCall = async () => {
    try {
      await api.post(`/api/streams/${streamId}/end`);
    } catch (err) {
      console.error('Error ending call', err);
    } finally {
      navigate('/');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !streamId) return;
    socket.emit('chat:message', { streamId, content: inputMessage });
    setInputMessage('');
  };

  const handleSendGift = async (giftId: string) => {
    if (!streamId) return;
    
    const receiverUserId = streamDetails?.streamer_id || streamDetails?.streamer?.user_id;
    if (!receiverUserId) {
      alert('No se pudo identificar al streamer para enviar el regalo.');
      return;
    }

    try {
      await api.post('/api/gifts/send', { 
        giftId, 
        streamId,
        receiverUserId
      }, {
        headers: { 'X-Idempotency-Key': Date.now().toString() }
      });
      socket.emit('gift:send', { streamId, giftId });
    } catch (err) {
      console.error('Error sending gift', err);
      alert('Error al enviar regalo. Verifica tu saldo.');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col md:flex-row">
      {/* Video Area (Placeholder) */}
      <div className="flex-1 relative bg-surface-high flex items-center justify-center">
        <p className="text-text-secondary text-xl animate-pulse">Conectando video...</p>
        
        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleEndCall}
              className="w-10 h-10 rounded-full bg-naro-red/20 text-naro-red flex items-center justify-center hover:bg-naro-red hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col">
              <span className="font-bold text-white">Streamer</span>
              <span className="text-naro-pink text-sm font-mono">{formatTime(duration)}</span>
            </div>
          </div>
          {balance && <DiamondCounter count={balance.diamonds} />}
        </div>

        {/* Gift Panel (Bottom Overlay) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 md:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {gifts.map(gift => (
              <button
                key={gift.id}
                onClick={() => handleSendGift(gift.id)}
                className="flex-shrink-0 bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-2 flex flex-col items-center gap-1 min-w-[80px] hover:border-naro-pink transition-colors"
              >
                <img src={gift.animation_url} alt={gift.name} className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                <span className="text-xs font-medium text-white truncate w-full text-center">{gift.name}</span>
                <span className="text-[10px] text-naro-blue font-bold">{gift.price_diamonds} 💎</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[40vh] md:h-full md:w-[35%] bg-surface border-t md:border-t-0 md:border-l border-border flex flex-col">
        <div className="p-4 border-b border-border bg-surface-high hidden md:block">
          <h3 className="font-bold text-lg">Chat en vivo</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-text-secondary mb-0.5">{msg.username}</span>
              <div className={`px-3 py-2 rounded-2xl max-w-[85%] ${
                msg.senderId === user?.id 
                  ? 'bg-naro-pink text-white rounded-br-sm' 
                  : 'bg-surface-high border border-border text-text-primary rounded-bl-sm'
              }`}>
                <p className="text-sm break-words">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-surface-high flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-surface border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-naro-pink transition-colors"
          />
          <button 
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-10 h-10 rounded-full bg-naro-gradient flex items-center justify-center text-white disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>

        {/* Desktop Gift Panel */}
        <div className="hidden md:flex p-3 border-t border-border bg-surface gap-2 overflow-x-auto scrollbar-hide">
          {gifts.map(gift => (
            <button
              key={gift.id}
              onClick={() => handleSendGift(gift.id)}
              className="flex-shrink-0 bg-surface-high border border-border rounded-lg p-2 flex flex-col items-center gap-1 min-w-[70px] hover:border-naro-pink transition-colors"
            >
              <img src={gift.animation_url} alt={gift.name} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
              <span className="text-[10px] text-naro-blue font-bold">{gift.price_diamonds} 💎</span>
            </button>
          ))}
        </div>
      </div>

      <GiftAnimationOverlay />
    </div>
  );
};
