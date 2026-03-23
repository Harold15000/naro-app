import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import api from '../lib/api';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      await login(res.data.accessToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-[20px] p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://i.ibb.co/wNv7cYHq/logo-png.png" 
            alt="Naro Logo" 
            className="w-24 h-24 object-contain mb-4 drop-shadow-[0_0_15px_rgba(240,61,127,0.3)]"
            referrerPolicy="no-referrer"
          />
          <p className="text-text-secondary mt-2 text-center">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-naro-pink transition-all"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-naro-pink transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <ErrorMessage message={error} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-naro-gradient text-white font-bold rounded-xl py-3.5 mt-6 hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? <LoadingSpinner size={20} className="text-white" /> : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-text-secondary text-sm">¿No tienes cuenta? </span>
          <Link to="/register" className="text-naro-pink hover:underline text-sm font-medium">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};
