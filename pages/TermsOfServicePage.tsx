import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-4xl mx-auto text-gray-300">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Términos y Condiciones de Uso</h1>
      
      <p className="mb-4">Fecha de última actualización: 24 de Julio de 2024</p>

      <p className="mb-4">
        Bienvenido a la aplicación web de Fiestas Pantano 2026. Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Por favor, léalos detenidamente. Si no está de acuerdo con estos términos, no debe utilizar este sitio.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">1. Descripción del Servicio</h2>
      <p className="mb-4">
        La aplicación Fiestas Pantano 2026 (en adelante, "el Servicio") es una plataforma diseñada para informar sobre los eventos de las fiestas, permitir el registro de usuarios y facilitar la inscripción a dichos eventos.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">2. Cuentas de Usuario</h2>
      <p className="mb-4">
        Para acceder a ciertas funcionalidades, como inscribirse en eventos, deberá crear una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y de toda la actividad que ocurra en su cuenta. Se compromete a proporcionar información veraz, actual y completa durante el proceso de registro y a actualizar dicha información para mantenerla así.
      </p>
      
      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">3. Conducta del Usuario</h2>
      <p className="mb-4">
        Usted se compromete a no utilizar el Servicio para:
      </p>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>Realizar cualquier actividad ilegal o que infrinja los derechos de terceros.</li>
        <li>Publicar contenido ofensivo, difamatorio o inapropiado.</li>
        <li>Hacerse pasar por otra persona o entidad.</li>
        <li>Intentar obtener acceso no autorizado a los sistemas o cuentas de otros usuarios.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">4. Propiedad Intelectual</h2>
      <p className="mb-4">
        Todo el contenido de este sitio web, incluyendo textos, gráficos, logos e imágenes, es propiedad de la Comisión Organizadora de Fiestas Pantano 2026 y está protegido por las leyes de propiedad intelectual.
      </p>
      
      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">5. Exclusión de Garantías y Limitación de Responsabilidad</h2>
      <p className="mb-4">
        El Servicio se proporciona "tal cual", sin garantías de ningún tipo. La Organización no se hace responsable de posibles errores en la información de los eventos, cancelaciones o cambios de última hora. El uso del Servicio es bajo su propio riesgo. La Organización no será responsable de ningún daño directo o indirecto que pueda surgir del uso de esta plataforma.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">6. Modificaciones de los Términos</h2>
      <p className="mb-4">
        Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. Es su responsabilidad revisar estos términos periódicamente.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">7. Legislación Aplicable</h2>
      <p className="mb-4">
        Estos términos se regirán e interpretarán de acuerdo con las leyes de España.
      </p>
      
      <div className="mt-8 text-center">
          <Link to="/" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
            Volver al inicio
          </Link>
        </div>
    </div>
  );
};

export default TermsOfServicePage;
