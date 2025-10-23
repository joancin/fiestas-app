import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Raffle } from '../types';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import toast from 'react-hot-toast';

const RafflePage: React.FC = () => {
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isEditingRaffle, setIsEditingRaffle] = useState(false);
  const [editedRaffle, setEditedRaffle] = useState<Raffle | null>(null);

  const isFestero = user?.role === Role.FESTERO || user?.role === Role.ORGANIZER;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const raffleData = await api.getRaffle();
        setRaffle(raffleData);
        setEditedRaffle(raffleData);
      } catch (error) {
        console.error("Failed to fetch raffle data:", error);
        toast.error("Failed to load raffle data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRaffleEdit = () => {
    setIsEditingRaffle(true);
  };

  const handleRaffleSave = async () => {
    if (editedRaffle) {
      try {
        const updatedRaffle = await api.updateRaffle(editedRaffle);
        setRaffle(updatedRaffle);
        toast.success("Raffle updated successfully!");
        setIsEditingRaffle(false);
      } catch (error) {
        toast.error("Failed to update raffle.");
      }
    }
  };
  
  const handleRaffleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedRaffle) {
      setEditedRaffle({ ...editedRaffle, [e.target.name]: e.target.value });
    }
  };

  const handleRaffleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editedRaffle) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedRaffle({ ...editedRaffle, videoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const isYoutubeUrl = (url: string) => url.includes('youtube.com/embed');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10 bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900 rounded-xl">
        <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl shadow-amber-500/20 border border-amber-400/40">
            <h1 className="text-5xl font-bold mb-8 text-amber-300 text-center" style={{textShadow: '0 0 15px #fcd34d'}}>
                La Última Rifa
            </h1>
            {raffle && (
            <div className="text-center space-y-6">
                {isEditingRaffle ? (
                <div className="max-w-md mx-auto space-y-4">
                    <input type="date" name="date" value={editedRaffle?.date} onChange={handleRaffleChange} className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    <div>
                        <label htmlFor="videoFile" className="block text-sm font-medium text-gray-300 mb-1">Subir Vídeo</label>
                        <input type="file" name="videoFile" id="videoFile" accept="video/*" onChange={handleRaffleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"/>
                    </div>
                    <input type="text" name="number" value={editedRaffle?.number} onChange={handleRaffleChange} placeholder="Número Ganador" className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    <div className="flex justify-center gap-4">
                        <button onClick={handleRaffleSave} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">Guardar</button>
                        <button onClick={() => setIsEditingRaffle(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">Cancelar</button>
                    </div>
                </div>
                ) : (
                <>
                <p className="text-xl text-gray-300">Fecha: <span className="font-semibold text-white">{new Date(raffle.date).toLocaleDateString()}</span></p>
                <div className="aspect-w-16 aspect-h-9 max-w-2xl mx-auto bg-black rounded-lg shadow-lg shadow-black/50 overflow-hidden">
                    {isYoutubeUrl(raffle.videoUrl) ? (
                        <iframe src={raffle.videoUrl} title="Raffle Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                    ): (
                        <video src={raffle.videoUrl} controls className="w-full h-full">
                            Tu navegador no soporta la etiqueta de vídeo.
                        </video>
                    )}
                </div>
                <div className="mt-6">
                    <p className="text-2xl text-gray-200">Número Ganador</p>
                    <p className="font-bold text-8xl text-amber-300 tracking-widest animate-pulse" style={{textShadow: '0 0 20px #fcd34d'}}>{raffle.number}</p>
                </div>
                {isFestero && (
                    <button onClick={handleRaffleEdit} className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                    Modificar Rifa
                    </button>
                )}
                </>
                )}
            </div>
            )}
        </div>
    </div>
  );
};

export default RafflePage;