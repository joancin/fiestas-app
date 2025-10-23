
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { Event, RSVP, Participant } from '../types';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LinkParticipantControl: React.FC<{rsvpId: string, participantName: string, onLinkSuccess: () => void}> = ({rsvpId, participantName, onLinkSuccess}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!username.trim()) return;
        setIsSubmitting(true);
        try {
            await api.linkParticipant(rsvpId, participantName, username);
            toast.success(`'${participantName}' vinculado a '${username}'!`);
            onLinkSuccess();
            setIsEditing(false);
            setUsername('');
        } catch (error: any) {
            toast.error(error.message || 'Fallo al vincular.');
        } finally {
            setIsSubmitting(false);
        }
    }

    if(!isEditing) {
        return <button onClick={() => setIsEditing(true)} className="ml-2 text-xs bg-cyan-700 hover:bg-cyan-600 text-white py-1 px-2 rounded">Vincular</button>
    }

    return (
        <form onSubmit={handleLink} className="inline-flex items-center gap-2 ml-2">
            <input 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username del amigo"
                className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs w-32"
                required
            />
            <button type="submit" disabled={isSubmitting} className="text-xs bg-green-600 hover:bg-green-500 text-white py-1 px-2 rounded disabled:bg-green-800">OK</button>
            <button type="button" onClick={() => setIsEditing(false)} className="text-xs bg-gray-600 hover:bg-gray-500 text-white py-1 px-2 rounded">X</button>
        </form>
    )
}


const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileData = async () => {
    if (user) {
      setIsLoading(true);
      try {
        const userRsvps = await api.getUserRsvps(user.id);
        const allEvents = await api.getEvents();
        
        const rsvpEventIds = userRsvps.map(rsvp => rsvp.eventId);
        const userEvents = allEvents.filter(event => rsvpEventIds.includes(event.id));

        setRsvps(userRsvps);
        setEvents(userEvents);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast.error("No se pudieron cargar los datos del perfil.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading) {
    return <div className="text-center p-10">Loading Profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-10">User not found.</div>;
  }

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">{user.username}</h1>
        <p className="text-gray-400">{user.email}</p>
        <p className="mt-2 inline-block bg-cyan-800 text-cyan-300 text-sm font-semibold px-3 py-1 rounded-full">{user.role}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Mis Eventos Apuntados</h2>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map(event => {
                const rsvpDetails = rsvps.find(r => r.eventId === event.id);
                if (!rsvpDetails) return null;
                const isLeader = user.id === rsvpDetails.userId;
                
                return (
                    <div key={event.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold">{event.title}</h3>
                                <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()} - {event.location}</p>
                            </div>
                            <Link to={`/event/${event.id}`} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex-shrink-0">
                                Ver Evento
                            </Link>
                        </div>
                         {rsvpDetails.participants.length > 1 && (
                            <div className="mt-3 pt-3 border-t border-gray-600">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Tu Grupo:</h4>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    {rsvpDetails.participants.map((participant, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className={`font-semibold ${participant.userId === user.id ? 'text-cyan-400' : 'text-gray-200'}`}>{participant.name}</span>
                                            {participant.userId === null && <span className="ml-2 text-xs text-amber-400">(No vinculado)</span>}
                                            
                                            {isLeader && participant.userId === null && (
                                                <LinkParticipantControl 
                                                    rsvpId={rsvpDetails.id} 
                                                    participantName={participant.name} 
                                                    onLinkSuccess={fetchProfileData} 
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}
          </div>
        ) : (
          <p className="text-gray-400">Todavía no te has apuntado a ningún evento.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
