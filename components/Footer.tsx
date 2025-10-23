import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="container mx-auto py-6 px-4 md:px-8 text-center text-gray-400">
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mb-4">
          <Link to="/legal-notice" className="hover:text-cyan-400 transition-colors">Aviso Legal</Link>
          <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">Política de Privacidad</Link>
          <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">Términos de Uso</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Fiestas Pantano 2026. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;