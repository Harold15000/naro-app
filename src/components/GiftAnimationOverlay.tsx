import React, { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { motion, AnimatePresence } from 'motion/react';

interface GiftAnimationData {
  giftId: string;
  animationUrl: string;
  senderUsername: string;
  coinsEarned: number;
}

export const GiftAnimationOverlay: React.FC = () => {
  const [animation, setAnimation] = useState<GiftAnimationData | null>(null);

  useEffect(() => {
    const handleGift = (data: GiftAnimationData) => {
      setAnimation(data);
      setTimeout(() => setAnimation(null), 3000);
    };

    socket.on('gift:animation', handleGift);
    return () => {
      socket.off('gift:animation', handleGift);
    };
  }, []);

  return (
    <AnimatePresence>
      {animation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <img 
              src={animation.animationUrl} 
              alt="Gift" 
              className="w-48 h-48 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="bg-surface-high/80 px-6 py-3 rounded-full border border-naro-pink/30 shadow-[0_0_30px_rgba(240,61,127,0.3)]">
              <p className="text-xl font-bold text-white">
                <span className="text-naro-pink">{animation.senderUsername}</span> envió un regalo!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
