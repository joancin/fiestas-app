import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'fiestas_pantano_cookie_consent';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center md:text-left">
          Este sitio web utiliza cookies técnicas y almacenamiento local esenciales para su funcionamiento, como mantener tu sesión iniciada. Consulta nuestra{' '}
          <Link to="/privacy-policy" className="text-cyan-400 hover:underline">Política de Privacidad</Link> para más información.
        </p>
        <button
          onClick={handleAccept}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 flex-shrink-0"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;