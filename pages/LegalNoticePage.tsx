import React from 'react';
import { Link } from 'react-router-dom';

const LegalNoticePage: React.FC = () => {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-4xl mx-auto text-gray-300">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Aviso Legal</h1>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">1. Datos Identificativos</h2>
      <p className="mb-4">
        En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los siguientes datos:
      </p>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li><strong>Responsable:</strong> Comisión Organizadora Fiestas Pantano 2026 (en adelante, "La Organización")</li>
        <li><strong>Correo electrónico de contacto:</strong> <a href="mailto:info@fiestaspantano.es" className="text-cyan-400 hover:underline">info@fiestaspantano.es</a></li>
        <li><strong>Sitio Web:</strong> fiestas-pantano-2026.app</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">2. Objeto</h2>
      <p className="mb-4">
        La Organización pone a disposición de los usuarios el presente documento con el que pretende dar cumplimiento a las obligaciones dispuestas en la normativa vigente, así como informar a todos los usuarios del sitio web respecto a cuáles son las condiciones de uso del mismo.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">3. Usuarios</h2>
      <p className="mb-4">
        El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">4. Uso del Portal</h2>
      <p className="mb-4">
        El sitio web proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a La Organización a los que el USUARIO pueda tener acceso. El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.
      </p>
      
      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">5. Propiedad Intelectual e Industrial</h2>
      <p className="mb-4">
        La Organización, por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, etc.).
      </p>
      
      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">6. Legislación Aplicable y Jurisdicción</h2>
      <p className="mb-4">
        La relación entre La Organización y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad correspondiente.
      </p>

      <div className="mt-8 text-center">
        <Link to="/" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default LegalNoticePage;
