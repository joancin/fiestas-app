import React, { useState } from 'react';
import { Event, RsvpType, EventType } from '../types';
import * as api from '../services/api';
import toast from 'react-hot-toast';

interface EventFormProps {
  event: Event | null;
  onSuccess: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ event, onSuccess }) => {
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    time: event?.time || '',
    location: event?.location || '',
    imageUrl: event?.imageUrl || '',
    eventType: event?.eventType || EventType.OTRO,
    capacity: event?.capacity || 50,
    rsvpType: event?.rsvpType || RsvpType.INDIVIDUAL,
    maxGroupSize: event?.maxGroupSize || 4,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(event?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'capacity' || name === 'maxGroupSize' ? parseInt(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let dataToSubmit: Omit<Event, 'id'> = { ...formData };
      if (formData.eventType !== EventType.COMPETITION) {
          // @ts-ignore
          delete dataToSubmit.capacity;
          // @ts-ignore
          delete dataToSubmit.rsvpType;
          // @ts-ignore
          delete dataToSubmit.maxGroupSize;
      }

      if (event) {
        await api.updateEvent({ ...dataToSubmit, id: event.id });
        toast.success("Event updated successfully!");
      } else {
        await api.createEvent(dataToSubmit);
        toast.success("Event created successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"/>
        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Categoría del Evento</label>
        <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            {Object.values(EventType).map(type => (
                <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
            ))}
        </select>
      </div>
      
      {formData.eventType === EventType.COMPETITION && (
        <div className="p-4 border border-gray-600 rounded-lg space-y-4 bg-gray-900/50">
            <h3 className="text-lg font-semibold text-cyan-400">Detalles de Competición</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Aforo</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Inscripción</label>
                  <select name="rsvpType" value={formData.rsvpType} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value={RsvpType.INDIVIDUAL}>Individual</option>
                    <option value={RsvpType.PAIR}>Pareja</option>
                    <option value={RsvpType.GROUP}>Grupo</option>
                  </select>
                </div>
            </div>
            {formData.rsvpType === RsvpType.GROUP && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tamaño Máx. de Grupo</label>
                  <input type="number" name="maxGroupSize" value={formData.maxGroupSize} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
            )}
        </div>
      )}
      <div className="flex justify-end pt-4">
        <button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-cyan-800">
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
};