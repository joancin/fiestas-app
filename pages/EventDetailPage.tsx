import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Event, AuthUser, Comment, RSVP, EventType, Role } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { RsvpType } from '../types';
import Bracket from '../components/Bracket';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);

  const isFestero = user?.role === Role.FESTERO || user?.role === Role.ORGANIZER;
  const userRsvp = user ? rsvps.find(r => r.participants.some(p => p.userId === user.id)) : null;

  const fetchEventData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const eventData = await api.getEventById(id);
      const commentsData = await api.getEventComments(id);
      
      setEvent(eventData);
      setComments(commentsData);

      // Always fetch RSVPs to show attendee list for festeros, even on non-competition events.
      // But brackets only exist for competitions.
      const rsvpsData = await api.getEventAttendees(id);
      setRsvps(rsvpsData);

    } catch (error) {
      toast.error("Event not found.");
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, navigate]);
  
  const handleRsvpSuccess = (newRsvps: RSVP[]) => {
      setRsvps(newRsvps);
      setIsRsvpModalOpen(false);
      fetchEventData(); // Refetch to get updated bracket
  }

  const handleAbandonEvent = async () => {
      if(!id || !user) return;
      if (window.confirm("¿Seguro que quieres desapuntar a tu grupo de este evento? Esta acción no se puede deshacer.")) {
        try {
            await api.abandonEvent(id, user.id);
            toast.success("Tu grupo ha sido desapuntado.");
            fetchEventData();
        } catch (error: any) {
            toast.error(error.message || "No se pudo abandonar el evento.");
        }
      }
  }

  const handleRemoveRsvpByFestero = async (rsvpId: string) => {
    if (!user) return;
    if (window.confirm("¿Seguro que quieres desapuntar a este grupo? Esta acción no se puede deshacer.")) {
        try {
            // FIX: The function removeRsvpByFestero expects only one argument (rsvpId).
            await api.removeRsvpByFestero(rsvpId);
            toast.success("Grupo desapuntado.");
            fetchEventData();
        } catch (error: any) {
            toast.error(error.message || "No se pudo desapuntar al grupo.");
        }
    }
  }

  const handleWinnerSelect = async (matchId: string, winnerRsvpId: string) => {
      if(!id) return;
      try {
          const updatedEvent = await api.updateMatchWinner(id, matchId, winnerRsvpId);
          setEvent(updatedEvent);
          toast.success("Ganador actualizado.");
      } catch (error: any) {
          toast.error(error.message || "No se pudo actualizar el ganador.");
      }
  }

  const handleNewComment = (comment: Comment) => {
    setComments(prevComments => [...prevComments, comment]);
  };

  if (isLoading) return <div className="text-center p-10">Loading Event...</div>;
  if (!event) return <div className="text-center p-10">Event not found.</div>;

  const totalAttendees = rsvps.reduce((sum, rsvp) => sum + rsvp.participants.length, 0);
  const spotsLeft = event.capacity ? event.capacity - totalAttendees : 0;
  const isRsvpd = !!userRsvp;

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <img src={event.imageUrl} alt={event.title} className="w-full h-64 md:h-96 object-cover" />
      <div className="p-8 md:p-12 space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-300 mb-6">
            <span><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</span>
            <span><strong>Hora:</strong> {event.time}</span>
            <span><strong>Lugar:</strong> {event.location}</span>
          </div>
          <p className="text-gray-200 leading-relaxed">{event.description}</p>
        </div>
        
        {event.eventType === EventType.COMPETITION ? (
            <>
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Asistencia (Competición)</h3>
                    <p className="text-lg mb-2">Plazas disponibles: <span className="font-bold text-white">{spotsLeft > 0 ? spotsLeft : 0} / {event.capacity}</span></p>
                    {user ? (
                        <>
                         {isRsvpd ? (
                            <div className="flex items-center gap-4">
                               <p className="text-green-400 font-bold text-lg">¡Ya estás apuntado a este evento!</p>
                               <button onClick={handleAbandonEvent} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                   Abandonar Evento
                               </button>
                            </div>
                         ) : spotsLeft > 0 ? (
                             <button onClick={() => setIsRsvpModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg">
                                 Apuntarse
                             </button>
                         ) : (
                             <p className="text-red-400 font-bold text-lg">¡Aforo completo!</p>
                         )}
                        </>
                    ) : (
                        <p className="text-amber-400">Debes iniciar sesión para apuntarte.</p>
                    )}
                </div>
                
                {event.bracket && event.bracket.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Tabla de Enfrentamientos</h3>
                        <Bracket event={event} rsvps={rsvps} isFestero={isFestero} onWinnerSelect={handleWinnerSelect} />
                    </div>
                )}

                {isFestero && (
                    <div>
                        <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Lista de Asistentes ({totalAttendees})</h3>
                        {rsvps.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {rsvps.map(rsvp => (
                                    <div key={rsvp.id} className="bg-gray-700 p-3 rounded-lg flex flex-col">
                                        <ul className="space-y-1 mb-2">
                                            {rsvp.participants.map((participant, index) => (
                                                <li key={index} className="text-sm truncate">
                                                    <span className={`font-semibold ${index === 0 ? 'text-cyan-300' : 'text-gray-300'}`}>
                                                        {participant.name}
                                                    </span>
                                                    {index === 0 && <span className="text-xs text-gray-400 ml-1">(Líder)</span>}
                                                </li>
                                            ))}
                                        </ul>
                                        <button onClick={() => handleRemoveRsvpByFestero(rsvp.id)} className="mt-auto text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg transition duration-300 w-full">
                                            Desapuntar Grupo
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Nadie se ha apuntado todavía.</p>
                        )}
                    </div>
                )}
            </>
        ) : (
             <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-2 text-cyan-400">Asistencia</h3>
                <p className="text-lg text-green-400">Este evento es de acceso libre. ¡No es necesario apuntarse!</p>
            </div>
        )}

        <div className="border-t border-gray-700 pt-8">
            <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Foro del Evento</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-gray-700 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-white">{comment.username}</p>
                                <p className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleString()}</p>
                            </div>
                            <p className="text-gray-300">{comment.text}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay comentarios todavía. ¡Sé el primero!</p>
                )}
            </div>
            {user ? (
                <CommentForm eventId={event.id} user={user} onNewComment={handleNewComment} />
            ) : (
                <p className="mt-4 text-amber-400">Debes iniciar sesión para dejar un comentario.</p>
            )}
        </div>
      </div>
      {isRsvpModalOpen && user && event.eventType === EventType.COMPETITION && (
        <RsvpModal 
            event={event} 
            user={user} 
            onClose={() => setIsRsvpModalOpen(false)} 
            onRsvpSuccess={handleRsvpSuccess}
            isFestero={isFestero}
        />
      )}
    </div>
  );
};


const RsvpModal: React.FC<{event: Event, user: AuthUser, onClose: () => void, onRsvpSuccess: (rsvps: RSVP[]) => void, isFestero: boolean}> = ({ event, user, onClose, onRsvpSuccess, isFestero }) => {
    const getParticipantCount = () => {
        if (event.eventType !== EventType.COMPETITION) return 1;
        switch (event.rsvpType) {
            case RsvpType.INDIVIDUAL: return 1;
            case RsvpType.PAIR: return 2;
            case RsvpType.GROUP: return event.maxGroupSize || 1;
            default: return 1;
        }
    };

    const participantCount = getParticipantCount();
    const [participants, setParticipants] = useState<string[]>(Array(participantCount).fill(''));
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isFestero) {
            const newParticipants = [...participants];
            newParticipants[0] = user.username;
            setParticipants(newParticipants);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.username, isFestero]);

    const handleParticipantChange = (index: number, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index] = value;
        setParticipants(newParticipants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const filledParticipants = participants.filter(p => p.trim() !== '');

        if(filledParticipants.length === 0){
            toast.error("Debes añadir al menos un participante.");
            setIsSubmitting(false);
            return;
        }

        try {
            const updatedRsvps = await api.rsvpToEvent(event.id, user.id, filledParticipants);
            toast.success("¡Grupo apuntado correctamente!");
            onRsvpSuccess(updatedRsvps);
        } catch (error: any) {
            toast.error(error.message || "No se pudo completar la inscripción.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRsvpTypeText = () => {
        if (event.eventType !== EventType.COMPETITION) return '';
        switch (event.rsvpType) {
            case RsvpType.INDIVIDUAL: return 'Individual';
            case RsvpType.PAIR: return 'Por Parejas';
            case RsvpType.GROUP: return `En Grupos (hasta ${event.maxGroupSize} personas)`;
            default: return '';
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold mb-4">Inscripción a: {event.title}</h2>
                <p className="mb-4 text-cyan-400 font-semibold">Tipo de inscripción: {getRsvpTypeText()}</p>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {Array.from({ length: participantCount }).map((_, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-gray-300">
                                    Participante {index + 1} {index === 0 && !isFestero ? `(Tú)`: ``}
                                </label>
                                <input
                                    type="text"
                                    value={participants[index]}
                                    onChange={(e) => handleParticipantChange(index, e.target.value)}
                                    readOnly={index === 0 && !isFestero}
                                    placeholder={index === 0 && isFestero ? 'Nombre del líder del grupo' : 'Introduce el nombre del acompañante'}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-600"
                                    disabled={index === 0 && !isFestero}
                                    required={index === 0 || (index < 2 && (event.rsvpType === 'pair' || (event.rsvpType === 'group' && participantCount > 1)))}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg disabled:bg-cyan-800">
                            {isSubmitting ? 'Inscribiendo...' : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CommentForm: React.FC<{ eventId: string, user: AuthUser, onNewComment: (comment: Comment) => void }> = ({ eventId, user, onNewComment }) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            const newComment = await api.postEventComment(eventId, user.id, text.trim());
            onNewComment(newComment);
            setText('');
            toast.success("Comentario publicado.");
        } catch (error) {
            toast.error("No se pudo publicar el comentario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe tu comentario..."
                rows={3}
                className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 py-2 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg disabled:bg-cyan-800"
            >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
            </button>
        </form>
    );
};

export default EventDetailPage;