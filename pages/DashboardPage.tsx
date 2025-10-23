import React, { useEffect, useState, useMemo } from 'react';
import * as api from '../services/api';
import { Event, Role, AuthUser, AdminUserView, RegistrationMethod } from '../types';
import toast from 'react-hot-toast';
import { EventForm } from '../components/EventForm';
import { useAuth } from '../context/AuthContext';

const CreateFesteroForm: React.FC<{creator: AuthUser, onSuccess: () => void}> = ({creator, onSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.createFesteroUser(username, password, creator);
            toast.success(`Usuario Festero '${username}' creado con éxito!`);
            setUsername('');
            setPassword('');
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || 'Fallo al crear el usuario festero.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Crear Nuevo Festero</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="festero_username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input id="festero_username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="festero_password"className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input id="festero_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                </div>
                <div className="text-right">
                    <button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 disabled:bg-cyan-800">
                        {isSubmitting ? 'Creando...' : 'Crear Festero'}
                    </button>
                </div>
            </form>
        </div>
    )
}

const CreateNormalUserForm: React.FC<{creator: AuthUser, onSuccess: () => void}> = ({creator, onSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.createNormalUser(username, password, creator);
            toast.success(`Usuario '${username}' creado con éxito!`);
            setUsername('');
            setPassword('');
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || 'Fallo al crear el usuario.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-amber-400">Crear Nuevo Usuario Normal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="normal_username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input id="normal_username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                        <label htmlFor="normal_password"className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input id="normal_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                </div>
                <div className="text-right">
                    <button type="submit" disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 disabled:bg-amber-800">
                        {isSubmitting ? 'Creando...' : 'Crear Usuario'}
                    </button>
                </div>
            </form>
        </div>
    )
}

const RoleBadge: React.FC<{ role: Role }> = ({ role }) => {
    const roleStyles = {
        [Role.USER]: 'bg-gray-500 text-white',
        [Role.FESTERO]: 'bg-amber-500 text-white',
        [Role.ORGANIZER]: 'bg-cyan-500 text-white',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleStyles[role]}`}>{role}</span>;
}

type SortKey = 'username' | 'role' | 'registrationDate';
interface SortConfig {
    key: SortKey;
    direction: 'ascending' | 'descending';
}

const UserManagementList: React.FC<{
    currentUser: AuthUser, 
    users: AdminUserView[], 
    isLoading: boolean,
    onDataRefresh: () => void 
}> = ({currentUser, users, isLoading, onDataRefresh}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [userToDelete, setUserToDelete] = useState<AdminUserView | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'registrationDate', direction: 'descending' });

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter ? user.role === roleFilter : true;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const sortedAndFilteredUsers = useMemo(() => {
        let sortableItems = [...filteredUsers];
        sortableItems.sort((a, b) => {
            let compareResult = 0;
            if (sortConfig.key === 'username') {
                compareResult = a.username.localeCompare(b.username);
            } else if (sortConfig.key === 'role') {
                compareResult = a.role.localeCompare(b.role);
            } else if (sortConfig.key === 'registrationDate') {
                const timeA = parseInt(a.id.split('-')[1] || '0', 10);
                const timeB = parseInt(b.id.split('-')[1] || '0', 10);
                compareResult = timeA - timeB;
            }

            return sortConfig.direction === 'ascending' ? compareResult : -compareResult;
        });
        return sortableItems;
    }, [filteredUsers, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleDeleteClick = (user: AdminUserView) => {
        setUserToDelete(user);
    }

    const confirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            // FIX: The function deleteUserByAdmin expects only one argument (the user ID to delete).
            await api.deleteUserByAdmin(userToDelete.id);
            toast.success(`Usuario '${userToDelete.username}' eliminado.`);
            onDataRefresh();
            setUserToDelete(null);
        } catch (error: any) {
            toast.error(error.message || "Fallo al eliminar el usuario.");
        } finally {
            setIsDeleting(false);
        }
    }

    const getRegistrationDetails = (method: RegistrationMethod) => {
        switch(method.method) {
            case 'accessCode': return `Código: ${method.details}`;
            case 'festeroCreation': return `Creado por Festero: ${method.details}`;
            case 'organizerCreation': return `Creado por Organizador: ${method.details}`;
            case 'initialSeed': return 'Usuario Inicial';
            default: return 'Desconocido';
        }
    }

    const SortIcon: React.FC<{ direction: 'ascending' | 'descending' }> = ({ direction }) => {
        const iconClass = "h-4 w-4";
        if (direction === 'ascending') {
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>;
        }
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>;
    };

    const ThSortable: React.FC<{ title: string, sortKey: SortKey }> = ({ title, sortKey }) => {
        const isCurrentSortKey = sortConfig.key === sortKey;
        return (
            <th className="p-3">
                <button onClick={() => requestSort(sortKey)} className="flex items-center gap-2 hover:text-cyan-300 transition-colors focus:outline-none">
                    <span>{title}</span>
                    {isCurrentSortKey && <SortIcon direction={sortConfig.direction} />}
                </button>
            </th>
        );
    }

    if(isLoading) return <div className="p-4 text-center">Cargando usuarios...</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Gestión de Usuarios</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input 
                    type="text"
                    placeholder="Buscar por nombre de usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full md:w-1/4 bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    <option value="">Todos los Roles</option>
                    {Object.values(Role).map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <ThSortable title="Username" sortKey="username" />
                            <ThSortable title="Rol" sortKey="role" />
                            <ThSortable title="Método / Fecha de Registro" sortKey="registrationDate" />
                            <th className="p-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-3 font-medium">{user.username}</td>
                                <td className="p-3"><RoleBadge role={user.role} /></td>
                                <td className="p-3 text-sm text-gray-400">{getRegistrationDetails(user.registrationMethod)}</td>
                                <td className="p-3 text-right">
                                    {user.id !== currentUser.id ? (
                                        <button onClick={() => handleDeleteClick(user)} className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-gray-600" title="Borrar usuario">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <span className="text-gray-500 text-xs italic pr-2">Tú</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {sortedAndFilteredUsers.length === 0 && <p className="p-4 text-center text-gray-400">No se encontraron usuarios.</p>}
            </div>

            {userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-2xl border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Confirmar Eliminación</h3>
                        <p className="text-gray-300 mb-6">
                            ¿Estás seguro de que quieres eliminar al usuario <strong className="text-amber-400">{userToDelete.username}</strong>? Esta acción es irreversible y eliminará todos sus datos asociados (inscripciones, comentarios, etc.).
                        </p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setUserToDelete(null)} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition duration-300">
                                Cancelar
                            </button>
                             <button onClick={confirmDelete} disabled={isDeleting} className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-300 disabled:bg-red-800 disabled:cursor-not-allowed">
                                {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


const DashboardPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { user } = useAuth();
  
  const [allUsers, setAllUsers] = useState<AdminUserView[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const eventsData = await api.getEvents();
      setEvents(eventsData);
    } catch (error) {
      toast.error("Failed to load events.");
    } finally {
      setIsLoadingEvents(false);
    }
  };
  
  const fetchAllUsers = async () => {
    if (user?.role !== Role.ORGANIZER) return;
    setIsLoadingUsers(true);
    try {
        // FIX: The function getAllUsers does not expect any arguments.
        const usersData = await api.getAllUsers();
        setAllUsers(usersData);
    } catch (error: any) {
        toast.error(error.message || "Failed to load users.");
    } finally {
        setIsLoadingUsers(false);
    }
  }

  useEffect(() => {
    fetchEvents();
    if(user?.role === Role.ORGANIZER) {
        fetchAllUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.deleteEvent(eventId);
        toast.success("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        toast.error("Failed to delete event.");
      }
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchEvents();
  };

  if (isLoadingEvents) return <div className="text-center p-10">Loading Dashboard...</div>;

  return (
    <div className="space-y-12">
      <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-cyan-400">Dashboard de Eventos</h1>
            <button
            onClick={handleCreateEvent}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
            Crear Evento
            </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-700">
                <tr>
                <th className="p-4">Título</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Lugar</th>
                <th className="p-4">Capacidad</th>
                <th className="p-4">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {events.map((event) => (
                <tr key={event.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="p-4">{event.title}</td>
                    <td className="p-4">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="p-4">{event.location}</td>
                    <td className="p-4">{event.capacity ?? 'N/A'}</td>
                    <td className="p-4 flex space-x-2">
                    <button onClick={() => handleEditEvent(event)} className="text-amber-400 hover:text-amber-300">Editar</button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-400">Borrar</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {events.length === 0 && <p className="p-4 text-center text-gray-400">No events found.</p>}
        </div>
      </div>
      
      {user && (user.role === Role.FESTERO || user.role === Role.ORGANIZER) && (
        <CreateNormalUserForm creator={user} onSuccess={fetchAllUsers} />
      )}

      {user?.role === Role.ORGANIZER && (
        <>
            <CreateFesteroForm creator={user} onSuccess={fetchAllUsers} />
            <UserManagementList 
                currentUser={user} 
                users={allUsers} 
                isLoading={isLoadingUsers}
                onDataRefresh={fetchAllUsers} 
            />
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-4">{editingEvent ? 'Editar Evento' : 'Crear Evento'}</h2>
            <EventForm event={editingEvent} onSuccess={handleFormSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;