export enum Role {
  USER = 'USER',
  FESTERO = 'FESTERO',
  ORGANIZER = 'ORGANIZER',
}

export enum RsvpType {
  INDIVIDUAL = 'individual',
  PAIR = 'pair',
  GROUP = 'group',
}

export enum EventType {
  COMPETITION = 'COMPETITION',
  COMIDA = 'COMIDA',
  JUEGOS = 'JUEGOS',
  OTRO = 'OTRO',
}

export interface Participant {
  name: string;
  userId: string | null;
}

// User object for the application state (e.g., AuthContext).
// Does not contain sensitive information.
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
}

// Represents how a user was created.
export interface RegistrationMethod {
  method: 'accessCode' | 'festeroCreation' | 'organizerCreation' | 'initialSeed';
  details: string; // The access code, or the creator's username, or 'System'
}

// Full user object as stored in the database (localStorage).
// Includes sensitive data that should not be exposed to the UI.
export interface User extends AuthUser {
  passwordHash: string;
  salt: string;
  registrationMethod: RegistrationMethod;
}

// A safe view of user data for the admin dashboard.
export interface AdminUserView {
  id: string;
  username: string;
  role: Role;
  registrationMethod: RegistrationMethod;
}


export interface Match {
  id: string;
  round: number;
  matchInRound: number;
  participants: (string | null)[]; // Array of RSVP IDs
  winner: string | null; // RSVP ID of the winner
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  eventType: EventType;
  capacity?: number;
  rsvpType?: RsvpType;
  maxGroupSize?: number;
  bracket?: Match[];
}

export interface RSVP {
  id: string;
  eventId: string;
  userId: string; // The user who made the booking (group leader)
  participants: Participant[]; 
  isGroupLeader: boolean;
  groupId: string;
}

export interface Raffle {
  // FIX: Added 'id' property to align with the database schema and fix type errors in API calls.
  id: string;
  date: string;
  videoUrl: string;
  number: string;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}