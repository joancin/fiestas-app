import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Event, EventType } from '../types';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterEventType, setFilterEventType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const eventsData = await api.getEvents();
        setEvents(eventsData);
        setFilteredEvents(eventsData);
      } catch (error: any) {
        console.error("Failed to fetch data:", error);
        const message = error.message || 'A network error occurred. Please check your connection or Supabase credentials.';
        setFetchError(message);
        toast.error("Failed to load page data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let tempEvents = [...events];

    if (searchQuery) {
      tempEvents = tempEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterDateStart) {
      const startDate = new Date(filterDateStart);
      tempEvents = tempEvents.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setUTCHours(0, 0, 0, 0);
        return eventDate >= startDate;
      });
    }
    if (filterDateEnd) {
      const endDate = new Date(filterDateEnd);
      tempEvents = tempEvents.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setUTCHours(0, 0, 0, 0);
        return eventDate <= endDate;
      });
    }

    if (filterEventType) {
      tempEvents = tempEvents.filter(event => event.eventType === filterEventType);
    }

    setFilteredEvents(tempEvents);
  }, [searchQuery, filterDateStart, filterDateEnd, filterEventType, events]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterDateStart('');
    setFilterDateEnd('');
    setFilterEventType('');
  };

  if (fetchError) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-200 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Error de Conexión a la Base de Datos</h2>
            <p className="text-sm text-red-300">No se pudieron cargar los datos. La aplicación no puede comunicarse con el servidor de Supabase.</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-red-700/50">
          <p className="text-md font-semibold text-white">Pasos para solucionarlo:</p>
          <ol className="list-decimal list-inside text-sm space-y-2 mt-2 text-gray-300">
            <li>
              Abre el fichero <strong><code>supabaseClient.ts</code></strong> en el editor de código.
            </li>
            <li>
              Asegúrate de que las variables <code>supabaseUrl</code> y <code>supabaseAnonKey</code> contienen las credenciales <strong>reales</strong> de tu proyecto de Supabase, no los valores de ejemplo.
            </li>
            <li>
               Revisa la consola del navegador (presiona F12) para ver el mensaje de error específico, que fue:
               <pre className="mt-2 text-xs bg-gray-900 p-2 rounded font-mono whitespace-pre-wrap text-red-300">{fetchError}</pre>
            </li>
             <li>
              Asegúrate de haber ejecutado todo el código SQL (creación de tablas y funciones RPC) en tu editor de SQL de Supabase.
            </li>
          </ol>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div>
      <section id="events-section">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 tracking-wider">Próximos Eventos</h1>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filtrar Eventos
          </button>
        </div>
        
        {isFilterModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-lg relative">
              <button onClick={() => setIsFilterModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
              <h2 className="text-2xl font-bold mb-6">Filtrar Eventos</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-300 mb-1">Buscar por palabra clave</label>
                  <input
                    id="searchQuery"
                    type="text"
                    placeholder="Paella, Torneo, Orquesta..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="filterDateStart" className="block text-sm font-medium text-gray-300 mb-1">Desde</label>
                    <input
                      id="filterDateStart"
                      type="date"
                      value={filterDateStart}
                      onChange={(e) => setFilterDateStart(e.target.value)}
                      className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="filterDateEnd" className="block text-sm font-medium text-gray-300 mb-1">Hasta</label>
                    <input
                      id="filterDateEnd"
                      type="date"
                      value={filterDateEnd}
                      onChange={(e) => setFilterDateEnd(e.target.value)}
                      className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="filterEventType" className="block text-sm font-medium text-gray-300 mb-1">Categoría</label>
                  <select
                    id="filterEventType"
                    value={filterEventType}
                    onChange={(e) => setFilterEventType(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Todas</option>
                    {Object.values(EventType).map(type => (
                      <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button onClick={handleClearFilters} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                  Limpiar Filtros
                </button>
                <button onClick={() => setIsFilterModalOpen(false)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            {events.length > 0 ? 'No hay eventos que coincidan con tu búsqueda.' : 'No hay eventos programados por el momento.'}
          </p>
        )}
      </section>
    </div>
  );
};

const EventTypeBadge: React.FC<{ type: EventType }> = ({ type }) => {
    const typeStyles: { [key in EventType]: { text: string; className: string } } = {
        [EventType.COMPETITION]: { text: 'Competición', className: 'bg-blue-500 text-white' },
        [EventType.COMIDA]: { text: 'Comida', className: 'bg-orange-500 text-white' },
        [EventType.JUEGOS]: { text: 'Juegos', className: 'bg-green-500 text-white' },
        [EventType.OTRO]: { text: 'Evento', className: 'bg-purple-500 text-white' },
    };
    const style = typeStyles[type];
    return <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${style.className}`}>{style.text}</span>;
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300 flex flex-col relative">
    <EventTypeBadge type={event.eventType} />
    <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-2xl font-bold mb-2 text-white">{event.title}</h3>
      <p className="text-gray-400 mb-4 flex-grow">{event.description.substring(0, 100)}...</p>
      <div className="text-sm text-gray-300 space-y-2 mb-4">
        <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Hora:</strong> {event.time}</p>
        <p><strong>Lugar:</strong> {event.location}</p>
      </div>
      <Link to={`/event/${event.id}`} className="mt-auto text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        Ver Detalles
      </Link>
    </div>
  </div>
);

export default HomePage;