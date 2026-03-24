import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, CreditCard, Shield } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <div className="flex flex-col items-center mt-8 mb-10">
        <div className="w-32 h-32 rounded-full bg-naro-gradient p-1 mb-4 shadow-[0_0_30px_rgba(240,61,127,0.3)]">
          <div className="w-full h-full rounded-full bg-surface-high overflow-hidden border-4 border-background flex items-center justify-center">
            {user.profile_photo_url ? (
              <img src={user.profile_photo_url} alt={user.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-5xl font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-text-secondary">{user.email}</p>
        <div className="mt-3 px-4 py-1 bg-surface-high border border-border rounded-full text-sm font-medium text-naro-pink uppercase tracking-wider">
          {user.role}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 mb-6 flex justify-around">
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">💎</span>
          <span className="text-2xl font-bold text-naro-blue">{balance?.diamonds.toLocaleString()}</span>
          <span className="text-xs text-text-secondary uppercase tracking-wider mt-1">Diamonds</span>
        </div>
        {user.role !== 'user' && (
          <div className="flex flex-col items-center border-l border-border pl-8">
            <span className="text-3xl mb-2">🪙</span>
            <span className="text-2xl font-bold text-naro-pink">{balance?.coins.toLocaleString()}</span>
            <span className="text-xs text-text-secondary uppercase tracking-wider mt-1">Coins</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {['tutor', 'agency', 'super_admin'].includes(user.role) && (
          <button 
            onClick={() => navigate('/payroll')}
            className="w-full bg-surface-high border border-border rounded-xl p-4 flex items-center gap-4 hover:border-naro-pink transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-naro-pink/20 text-naro-pink flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <span className="font-medium flex-1 text-left">Nóminas</span>
          </button>
        )}

        <button className="w-full bg-surface-high border border-border rounded-xl p-4 flex items-center gap-4 hover:border-naro-blue transition-colors">
          <div className="w-10 h-10 rounded-full bg-naro-blue/20 text-naro-blue flex items-center justify-center">
            <Settings size={20} />
          </div>
          <span className="font-medium flex-1 text-left">Ajustes</span>
        </button>

        <button className="w-full bg-surface-high border border-border rounded-xl p-4 flex items-center gap-4 hover:border-naro-green transition-colors">
          <div className="w-10 h-10 rounded-full bg-naro-green/20 text-naro-green flex items-center justify-center">
            <Shield size={20} />
          </div>
          <span className="font-medium flex-1 text-left">Privacidad y Seguridad</span>
        </button>

        <button 
          onClick={logout}
          className="w-full bg-surface border border-naro-red/50 rounded-xl p-4 flex items-center gap-4 hover:bg-naro-red/10 transition-colors mt-8"
        >
          <div className="w-10 h-10 rounded-full bg-naro-red/20 text-naro-red flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <span className="font-medium text-naro-red flex-1 text-left">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};
