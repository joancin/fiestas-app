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
        <li>Garantizar el correcto funcionamiento técnico de la aplicación.</li>
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

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">5. Uso de Almacenamiento Local (No usamos Cookies de seguimiento)</h2>
      <p className="mb-4">
        Esta aplicación web no utiliza cookies tradicionales para rastreo, análisis o publicidad. En su lugar, empleamos el <strong>almacenamiento local (`localStorage`)</strong> de tu navegador, una tecnología necesaria para que la aplicación pueda funcionar de forma autónoma sin un servidor central. Los datos que guardamos son de carácter técnico y esencial:
      </p>
      <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
          <li><strong><code>fiestas_pantano_users</code></strong>: Almacena la lista de usuarios para gestionar el inicio de sesión.</li>
          <li><strong><code>fiestas_pantano_events</code></strong>: Guarda la información de los eventos disponibles.</li>
          <li><strong><code>fiestas_pantano_rsvps</code></strong>: Registra tus inscripciones a los eventos.</li>
          <li><strong><code>fiestas_pantano_raffle</code></strong>: Contiene la información de la rifa.</li>
          <li><strong><code>fiestas_pantano_session</code></strong>: Guarda un identificador para mantener tu sesión iniciada.</li>
          <li><strong><code>fiestas_pantano_cookie_consent</code></strong>: Recuerda que has aceptado esta política para no mostrarte el aviso de nuevo.</li>
      </ul>
      <p className="mt-4">
          Estos datos permanecen en tu dispositivo y son imprescindibles para el funcionamiento del servicio.
      </p>
      
      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">6. Conservación de los Datos</h2>
      <p className="mb-4">
        Conservaremos tus datos en el almacenamiento local de tu navegador mientras mantengas una cuenta activa en nuestra plataforma o hasta que decidas borrar los datos de navegación de tu navegador. Si eliminas los datos de navegación, tu cuenta y tus inscripciones se eliminarán de ese dispositivo.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">7. Cesión de Datos y Transferencias Internacionales</h2>
      <p className="mb-4">
        No vendemos, alquilamos ni cedemos tus datos personales a terceros. Tu <strong>nombre de usuario</strong> será el único dato visible para otros usuarios, y solo en las listas de asistentes de los eventos a los que te apuntes voluntariamente. No se realizan transferencias internacionales de datos.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">8. Medidas de Seguridad</h2>
      <p className="mb-4">
        Hemos adoptado medidas técnicas y organizativas para proteger tus datos. La principal medida es que toda la información se gestiona en tu propio dispositivo a través del almacenamiento local. Para proteger tus credenciales, tu contraseña se somete a un proceso de "hashing" con una "sal" única antes de guardarse. Esto significa que la contraseña original nunca se almacena y no puede ser recuperada, ni siquiera por nosotros, garantizando un alto nivel de seguridad para tu cuenta. Además, el acceso a funcionalidades restringidas está protegido por un sistema de roles.
      </p>
      
      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">9. Derechos de los Usuarios</h2>
      <p className="mb-4">
        Como usuario, tienes derecho a:
      </p>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li><strong>Acceso:</strong> Consultar qué datos tenemos sobre ti.</li>
        <li><strong>Rectificación:</strong> Modificar tus datos si son incorrectos.</li>
        <li><strong>Supresión ("Derecho al Olvido"):</strong> Solicitar la eliminación de tus datos.</li>
        <li><strong>Oposición:</strong> Oponerte a un determinado uso de tus datos.</li>
        <li><strong>Limitación del tratamiento y Portabilidad.</strong></li>
      </ul>
      <p className="mb-4">
        Puedes ejercer estos derechos contactándonos en <a href="mailto:info@fiestaspantano.es" className="text-cyan-400 hover:underline">info@fiestaspantano.es</a>. La forma más directa de eliminar todos tus datos es borrando los datos del sitio desde la configuración de tu navegador web.
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