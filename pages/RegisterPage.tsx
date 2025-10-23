import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Debes aceptar los Términos de Uso y la Política de Privacidad para registrarte.");
      return;
    }
    setIsSubmitting(true);
    const success = await register(username, password, accessCode);
    if (success) {
      navigate('/');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white">Register</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="bg-cyan-900/50 border border-cyan-700 text-cyan-200 text-sm p-3 rounded-lg">
            <p><strong>Aviso:</strong> El nombre de usuario será público en las listas de eventos. Por favor, usa un nombre que sea reconocible por el resto de festeros.</p>
          </div>
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
           <div>
            <label htmlFor="accessCode" className="text-sm font-medium text-gray-300">Código de Acceso</label>
            <input
              id="accessCode"
              name="accessCode"
              type="text"
              required
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="FP26-XXXXX"
            />
          </div>
          <div className="flex items-start">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="h-4 w-4 mt-1 flex-shrink-0 text-cyan-600 focus:ring-cyan-500 border-gray-500 rounded bg-gray-700"
              />
              <label htmlFor="agree" className="ml-2 block text-sm text-gray-400">
                He leído y acepto los{' '}
                <Link to="/terms-of-service" target="_blank" className="text-cyan-400 hover:text-cyan-300 underline">
                  Términos de Uso
                </Link>
                {' '}y la{' '}
                <Link to="/privacy-policy" target="_blank" className="text-cyan-400 hover:text-cyan-300 underline">
                  Política de Privacidad
                </Link>
              </label>
            </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition duration-300 disabled:bg-cyan-800 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
