import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import { DiamondPackage, Transaction } from '../types';
import api from '../lib/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Diamond, Coins, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const WalletScreen: React.FC = () => {
  const { balance, isLoading: isWalletLoading } = useWallet();
  const { user } = useAuth();
  const [packages, setPackages] = useState<DiamondPackage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, txRes] = await Promise.all([
          api.get('/api/diamonds/packages'),
          api.get('/api/transactions')
        ]);
        
        const packagesData = pkgRes.data;
        const txData = txRes.data;
        
        setPackages(Array.isArray(packagesData) ? packagesData : (packagesData?.data || packagesData?.packages || []));
        setTransactions(Array.isArray(txData) ? txData : (txData?.data || txData?.transactions || []));
      } catch (err) {
        setError('Error al cargar datos de la billetera');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePurchase = async (packageId: string) => {
    setPurchasingId(packageId);
    try {
      await api.post('/api/diamonds/purchase', { packageId });
      alert('Compra exitosa!');
      // WalletContext will update via socket or we could trigger refresh
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error en la compra');
    } finally {
      setPurchasingId(null);
    }
  };

  if (isWalletLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size={40} /></div>;
  }

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Billetera</h1>

      {/* Balance Card */}
      <div className="bg-surface border border-border rounded-3xl p-6 mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-naro-blue/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-naro-pink/10 rounded-full blur-3xl -ml-20 -mb-20" />
        
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <p className="text-text-secondary font-medium mb-1">Saldo de Diamonds</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl">💎</span>
              <span className="text-5xl font-bold text-naro-blue tracking-tight">{balance?.diamonds.toLocaleString()}</span>
            </div>
          </div>

          {user?.role === 'streamer' && (
            <div className="pt-6 border-t border-border/50">
              <p className="text-text-secondary font-medium mb-1">Ganancias (Coins)</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl">🪙</span>
                <span className="text-4xl font-bold text-naro-pink tracking-tight">{balance?.coins.toLocaleString()}</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">Disponibles para retiro: {balance?.coins_available.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* Packages */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Comprar Diamonds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-surface-high border border-border rounded-2xl p-5 flex flex-col items-center text-center hover:border-naro-blue transition-colors">
              <span className="text-4xl mb-3">💎</span>
              <h3 className="font-bold text-lg">{pkg.name}</h3>
              <p className="text-naro-blue font-bold text-2xl my-2">{pkg.diamonds.toLocaleString()}</p>
              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={purchasingId === pkg.id}
                className="w-full mt-4 bg-naro-gradient text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center items-center"
              >
                {purchasingId === pkg.id ? <LoadingSpinner size={20} className="text-white" /> : `$${(pkg.price_usd || 0).toFixed(2)} USD`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Historial</h2>
        {transactions.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No hay transacciones aún.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-surface-high border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-naro-green/20 text-naro-green' : 'bg-naro-red/20 text-naro-red'}`}>
                    {tx.amount > 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-xs text-text-secondary">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`font-bold ${tx.amount > 0 ? 'text-naro-green' : 'text-naro-red'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                  <span className="text-sm">{tx.type === 'diamond' ? '💎' : '🪙'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
