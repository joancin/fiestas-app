import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-4xl mx-auto text-gray-300">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Política de Privacidad</h1>
      
      <p className="mb-4">Fecha de última actualización: 24 de Julio de 2024</p>

      <p className="mb-4">
        En Fiestas Pantano 2026, nos tomamos muy en serio tu privacidad. Esta Política de Privacidad describe cómo recogemos, utilizamos y gestionamos tu información personal cuando utilizas nuestra aplicación web.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">1. Identidad y Contacto del Responsable del Tratamiento</h2>
      <p className="mb-4">
        El responsable del tratamiento de los datos personales es la Comisión Organizadora de Fiestas Pantano 2026. Puedes contactarnos a través del correo electrónico: <a href="mailto:info@fiestaspantano.es" className="text-cyan-400 hover:underline">info@fiestaspantano.es</a>.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">2. Finalidad del Tratamiento de Datos</h2>
      <p className="mb-4">
        Utilizamos tus datos para las siguientes finalidades:
      </p>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>Gestionar tu cuenta de usuario y permitirte el acceso a la plataforma.</li>
        <li>Permitirte inscribirte (RSVP) en los eventos organizados.</li>
        <li>Mostrar tu nombre de usuario en la lista de asistentes de los eventos a los que te apuntes.</li>
        <li>Garantizar el correcto funcionamiento técnico y la seguridad de la aplicación.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">3. Base Jurídica del Tratamiento</h2>
      <p className="mb-4">
        La base legal para el tratamiento de tus datos es tu <strong>consentimiento explícito</strong>, que nos otorgas al marcar la casilla de aceptación de la Política de Privacidad y los Términos de Uso durante el proceso de registro. Sin este consentimiento, no es posible crear una cuenta.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">4. ¿Qué datos recogemos?</h2>
      <p className="mb-4">
        Recogemos únicamente los datos personales que nos proporcionas directamente al registrarte:
      </p>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>Nombre de usuario</li>
        <li>Dirección de correo electrónico (email)</li>
        <li>Contraseña (se guarda una versión cifrada e irreversible para tu seguridad).</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">5. Alojamiento de Datos y Encargado del Tratamiento</h2>
      <p className="mb-4">
        Para proporcionar este servicio, utilizamos la plataforma "Backend as a Service" de <strong>Supabase, Inc.</strong>, que actúa como nuestro <strong>Encargado del Tratamiento</strong>. Esto significa que todos los datos de la aplicación (usuarios, eventos, inscripciones, etc.) se almacenan de forma segura en la infraestructura en la nube gestionada por Supabase.
      </p>
      <p className="mb-4">
        Nos hemos asegurado de que Supabase cumple con los más altos estándares de seguridad y protección de datos.
      </p>
      
      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">6. Conservación de los Datos</h2>
      <p className="mb-4">
        Conservaremos tus datos personales en la base de datos mientras mantengas una cuenta activa en nuestra plataforma. Si decides eliminar tu cuenta o si el servicio finaliza, tus datos serán eliminados de forma permanente.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">7. Cesión de Datos y Transferencias Internacionales</h2>
      <p className="mb-4">
        No vendemos, alquilamos ni cedemos tus datos personales a terceros. Tu <strong>nombre de usuario</strong> será el único dato visible para otros usuarios, y solo en las listas de asistentes de los eventos a los que te apuntes voluntariamente.
      </p>
      <p className="mb-4">
        Dado que utilizamos los servicios de Supabase, Inc., tus datos pueden ser transferidos y procesados en servidores ubicados fuera del Espacio Económico Europeo (EEE). Estas transferencias se realizan bajo las Cláusulas Contractuales Tipo (SCC) aprobadas por la Comisión Europea, garantizando un nivel de protección de datos equivalente al europeo.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">8. Medidas de Seguridad</h2>
      <p className="mb-4">
        Hemos adoptado medidas técnicas y organizativas para proteger tus datos. Esto incluye el uso de conexiones cifradas (SSL), el almacenamiento seguro de contraseñas mediante "hashing" y la gestión de permisos de acceso a través del sistema de autenticación de Supabase.
      </p>
      
      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">9. Derechos de los Usuarios</h2>
      <p className="mb-4">
        Como usuario, tienes derecho a:
      </p>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li><strong>Acceso:</strong> Consultar qué datos tenemos sobre ti.</li>
        <li><strong>Rectificación:</strong> Modificar tus datos si son incorrectos.</li>
        <li><strong>Supresión ("Derecho al Olvido"):</strong> Solicitar la eliminación permanente de tu cuenta y todos tus datos asociados.</li>
        <li><strong>Oposición:</strong> Oponerte a un determinado uso de tus datos.</li>
        <li><strong>Limitación del tratamiento y Portabilidad.</strong></li>
      </ul>
      <p className="mb-4">
        Puedes ejercer estos derechos contactándonos en <a href="mailto:info@fiestaspantano.es" className="text-cyan-400 hover:underline">info@fiestaspantano.es</a>. A diferencia de la versión anterior de la app, borrar los datos de tu navegador ya no eliminará tu cuenta de nuestros sistemas.
      </p>

      <div className="mt-8 text-center">
          <Link to="/" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
            Volver al inicio
          </Link>
        </div>
    </div>
  );
};

export default PrivacyPolicyPage;