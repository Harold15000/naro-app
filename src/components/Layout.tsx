import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Wallet, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { DiamondCounter } from './DiamondCounter';
import { GiftAnimationOverlay } from './GiftAnimationOverlay';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/search', icon: Search, label: 'Buscar' },
    { path: '/wallet', icon: Wallet, label: 'Billetera' },
    { path: '/profile', icon: UserIcon, label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src="https://i.ibb.co/wNv7cYHq/logo-png.png" 
            alt="Naro Logo" 
            className="h-8 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {balance && <DiamondCounter count={balance.diamonds} />}
          <div 
            className="w-9 h-9 rounded-full bg-surface-high border border-border overflow-hidden cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            {user?.profile_photo_url ? (
              <img src={user.profile_photo_url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-naro-gradient opacity-80">
                <span className="text-sm font-bold text-white">{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-t border-border h-16 flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                isActive ? 'text-naro-pink' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={24} className={isActive ? 'drop-shadow-[0_0_8px_rgba(240,61,127,0.5)]' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <GiftAnimationOverlay />
    </div>
  );
};
