import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign } from 'lucide-react';
import api from '../lib/api';
import { Payroll } from '../types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const PayrollScreen: React.FC = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await api.get('/api/panel/payroll');
        const data = res.data;
        setPayrolls(Array.isArray(data) ? data : (data?.data || data?.payrolls || []));
      } catch (err) {
        setError('Error al cargar nóminas');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-surface-high border border-border rounded-full flex items-center justify-center hover:bg-surface transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Nóminas</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : payrolls.length === 0 ? (
        <div className="text-center py-20 text-text-secondary bg-surface border border-border rounded-2xl">
          <DollarSign size={48} className="mx-auto mb-4 opacity-20" />
          <p>No hay nóminas registradas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payrolls.map(payroll => (
            <div key={payroll.id} className="bg-surface border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-naro-pink transition-colors">
              <div>
                <p className="text-sm text-text-secondary uppercase tracking-wider font-medium mb-1">Semana</p>
                <p className="text-lg font-bold">{payroll.week}</p>
              </div>
              
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Coins</p>
                  <p className="text-xl font-bold text-naro-pink flex items-center gap-1">
                    <span className="text-sm">🪙</span> {payroll.coins.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">USDT</p>
                  <p className="text-xl font-bold text-naro-green flex items-center gap-1">
                    <span className="text-sm">$</span> {(payroll.usdt || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    payroll.status === 'paid' 
                      ? 'bg-naro-green/20 text-naro-green border border-naro-green/30' 
                      : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                  }`}>
                    {payroll.status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
