import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import api from '../lib/api';

export const RegisterScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setInvitationCode(code);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/api/auth/register', {
        username,
        email,
        password,
        invitation_code: invitationCode
      });
      navigate('/login');
    } catch (err: any) {
      const resp = err.response?.data;
      // Backend may return { message: "..." }, { error: "..." }, or { errors: [...] }
      const msg = resp?.message
        || resp?.error
        || (Array.isArray(resp?.errors) ? resp.errors.join('. ') : null)
        || 'Error al registrarse';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-surface border border-border rounded-[20px] p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://i.ibb.co/wNv7cYHq/logo-png.png"
            alt="Naro Logo"
            className="w-24 h-24 object-contain mb-4 drop-shadow-[0_0_15px_rgba(240,61,127,0.3)]"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
          <p className="text-text-secondary mt-2 text-center">Unete a naro hoy</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-naro-pink transition-all"
              placeholder="tu_usuario"
              required
            />
          </div>
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
            <label className="block text-sm font-medium text-text-secondary mb-1">Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-naro-pink transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Codigo de invitacion (Opcional)</label>
            <input
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-naro-pink transition-all"
              placeholder="Codigo"
            />
            <p className="text-xs text-text-secondary mt-1">Pidele el codigo a tu tutor</p>
          </div>

          <ErrorMessage message={error} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-naro-gradient text-white font-bold rounded-xl py-3.5 mt-6 hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? <LoadingSpinner size={20} className="text-white" /> : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-text-secondary text-sm">Ya tienes cuenta? </span>
          <Link to="/login" className="text-naro-pink hover:underline text-sm font-medium">
            Inicia sesion
          </Link>
        </div>
      </div>
    </div>
  );
};
