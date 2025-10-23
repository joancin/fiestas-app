import { supabase } from '../supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { AuthUser, Event, RSVP, Comment, Role, AdminUserView, RsvpType, EventType, Participant, Raffle } from '../types';

// =================================================================================
// SUPABASE API IMPLEMENTATION
// =================================================================================
// This file now contains the logic to interact with your Supabase backend.
// Note on security: Client-side code can't securely handle admin tasks.
// For creating/deleting users by an admin, we use Supabase RPC (Remote Procedure Calls).
// You MUST create these functions in your Supabase SQL Editor for the admin features to work.
// The required SQL code is provided in comments below.
// =================================================================================


// --- Helper Functions ---

/**
 * Fetches a user's public profile from the 'profiles' table.
 * This should be called after a user logs in to get their role and other app-specific data.
 */
const getUserProfile = async (user: SupabaseUser): Promise<AuthUser | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        return null;
    }
};


// --- Authentication ---

export const login = async (username: string, password: string): Promise<AuthUser> => {
    // Supabase signs in with email, so we construct an email from the username.
    // This assumes you have a trigger in Supabase that populates the username in your profiles table.
    const email = `${username.toLowerCase()}@fiestaspantano.local`;
    
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;
    if (!user) throw new Error("Login failed, user not found.");
    
    const profile = await getUserProfile(user);
    if (!profile) throw new Error("Login failed, profile not found.");

    return profile;
};

/*
 * To make registration with access codes work, you need two things in Supabase:
 * 1. A table named `access_codes` with columns: `id (int)`, `code (text)`, `used_by (uuid, nullable)`, `used_at (timestamp, nullable)`.
 * 2. The `register_user` RPC function below. Create it in your Supabase SQL Editor.
 *
 * --- SQL for `register_user` function ---
 * CREATE OR REPLACE FUNCTION register_user(
 *   p_username TEXT,
 *   p_email TEXT,
 *   p_password TEXT,
 *   p_access_code TEXT
 * ) RETURNS uuid AS $$
 * DECLARE
 *   new_user_id uuid;
 * BEGIN
 *   -- Check if access code is valid and not used
 *   IF NOT EXISTS (
 *     SELECT 1 FROM public.access_codes
 *     WHERE code = p_access_code AND used_by IS NULL
 *   ) THEN
 *     RAISE EXCEPTION 'Invalid or already used access code';
 *   END IF;
 *
 *   -- Create the user in auth.users
 *   INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_sent_at, confirmed_at)
 *   values (
 *     '00000000-0000-0000-0000-000000000000',
 *     gen_random_uuid(),
 *     'authenticated',
 *     'authenticated',
 *     p_email,
 *     crypt(p_password, gen_salt('bf')),
 *     now(),
 *     '',
 *     null,
 *     null,
 *     '{"provider":"email","providers":["email"]}',
 *     jsonb_build_object('username', p_username),
 *     now(),
 *     now(),
 *     '',
 *     '',
 *     null,
 *     now()
 *   ) returning id into new_user_id;
 *
 *   -- Mark the access code as used
 *   UPDATE public.access_codes
 *   SET used_by = new_user_id, used_at = now()
 *   WHERE code = p_access_code;
 *
 *   RETURN new_user_id;
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 */
export const register = async (username: string, password: string, accessCode: string): Promise<AuthUser> => {
    const email = `${username.toLowerCase()}@fiestaspantano.local`;

    // We call the RPC function to handle registration transactionally
    const { data, error: rpcError } = await supabase.rpc('register_user', {
        p_username: username,
        p_email: email,
        p_password: password,
        p_access_code: accessCode,
    });

    if (rpcError) throw rpcError;

    // After the RPC creates the user, we log them in to get a session
    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (loginError) throw loginError;
    if (!user) throw new Error("Registration succeeded, but login failed.");

    const profile = await getUserProfile(user);
    if (!profile) throw new Error("Could not retrieve profile after registration.");

    return profile;
};

export const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentUserProfile = async (user: SupabaseUser): Promise<AuthUser | null> => {
    return getUserProfile(user);
};


// --- Events ---

export const getEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const getEventById = async (id: string): Promise<Event> => {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) throw new Error("Event not found");
    return data;
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'bracket'>): Promise<Event> => {
    const { data, error } = await supabase.from('events').insert([eventData]).select().single();
    if (error) throw error;
    return data;
};

export const updateEvent = async (eventData: Event): Promise<Event> => {
    const { data, error } = await supabase.from('events').update(eventData).eq('id', eventData.id).select().single();
    if (error) throw error;
    return data;
};

export const deleteEvent = async (id: string): Promise<void> => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
};


// --- RSVPs ---
// Assumes `rsvps` table with a JSONB column `participants` of type Participant[]

export const getEventAttendees = async (eventId: string): Promise<RSVP[]> => {
    const { data, error } = await supabase.from('rsvps').select('*').eq('eventId', eventId);
    if (error) throw error;
    return data || [];
};

export const getUserRsvps = async (userId: string): Promise<RSVP[]> => {
    // This query finds RSVPs where the user is either the leader (userId) or is in the participants array.
    const { data, error } = await supabase.from('rsvps').select('*').or(`userId.eq.${userId},participants.cs.{"userId":"${userId}"}`);
    if (error) throw error;
    return data || [];
};

export const rsvpToEvent = async (eventId: string, userId: string, participants: string[]): Promise<RSVP[]> => {
    const event = await getEventById(eventId);
    if (!event) throw new Error("Event not found");

    // FIX: The `getEventAttendees` function returns an array of RSVPs directly, not an object with a `data` property.
    const attendees = await getEventAttendees(eventId);
    const totalAttendees = attendees.reduce((sum, rsvp) => sum + rsvp.participants.length, 0);

    if (event.capacity && totalAttendees + participants.length > event.capacity) {
        throw new Error("Aforo completo. No hay suficientes plazas.");
    }
    
    // Find users for participants to link their IDs
    const { data: users } = await supabase.from('profiles').select('id, username').in('username', participants);
    
    const participantObjects: Participant[] = participants.map(name => {
        const user = users?.find(u => u.username === name);
        return { name, userId: user?.id || null };
    });

    const newRsvp: Omit<RSVP, 'id'> = {
        eventId,
        userId,
        participants: participantObjects,
        isGroupLeader: true,
        groupId: crypto.randomUUID(),
    };

    const { error } = await supabase.from('rsvps').insert([newRsvp]);
    if (error) throw error;

    return getEventAttendees(eventId);
};

export const abandonEvent = async (eventId: string, userId: string): Promise<void> => {
    // Find the specific RSVP where this user is the group leader
    const { error } = await supabase.from('rsvps').delete().match({ eventId: eventId, userId: userId });
    if (error) throw error;
};


// --- Comments ---

export const getEventComments = async (eventId: string): Promise<Comment[]> => {
    const { data, error } = await supabase.from('comments').select('*').eq('eventId', eventId).order('timestamp', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const postEventComment = async (eventId: string, userId: string, text: string): Promise<Comment> => {
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', userId).single();
    if (!profile) throw new Error("User profile not found");

    const newComment = {
        eventId,
        userId,
        username: profile.username,
        text,
        timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase.from('comments').insert([newComment]).select().single();
    if (error) throw error;
    return data;
};


// --- Competition & Festero Actions ---

export const updateMatchWinner = async (eventId: string, matchId: string, winnerRsvpId: string): Promise<Event> => {
    const event = await getEventById(eventId);
    if (!event.bracket) throw new Error("This event does not have a bracket.");
    
    const match = event.bracket.find(m => m.id === matchId);
    if (!match) throw new Error("Match not found.");
    
    match.winner = winnerRsvpId;

    return await updateEvent(event);
};

export const removeRsvpByFestero = async (rsvpId: string): Promise<void> => {
    const { error } = await supabase.from('rsvps').delete().eq('id', rsvpId);
    if (error) throw error;
};

export const linkParticipant = async (rsvpId: string, participantName: string, targetUsername: string): Promise<RSVP> => {
    const { data: targetUser, error: userError } = await supabase.from('profiles').select('id').eq('username', targetUsername).single();
    if (userError || !targetUser) throw new Error(`El usuario '${targetUsername}' no existe.`);
    
    const { data: rsvp, error: rsvpError } = await supabase.from('rsvps').select('*').eq('id', rsvpId).single();
    if (rsvpError || !rsvp) throw new Error("Inscripción no encontrada.");

    const participantIndex = rsvp.participants.findIndex((p: Participant) => p.name === participantName && p.userId === null);
    if (participantIndex === -1) throw new Error(`El participante '${participantName}' no está en la lista o ya está vinculado.`);

    rsvp.participants[participantIndex].userId = targetUser.id;

    const { data: updatedRsvp, error: updateError } = await supabase.from('rsvps').update({ participants: rsvp.participants }).eq('id', rsvpId).select().single();
    if (updateError) throw updateError;
    return updatedRsvp;
};


// --- Admin Actions (RPC REQUIRED) ---

export const getAllUsers = async (): Promise<AdminUserView[]> => {
    const { data, error } = await supabase.from('profiles').select('id, username, role, registrationMethod');
    if (error) throw error;
    return data || [];
};

/*
 * --- SQL for `delete_user_by_admin` function ---
 * Note: Deleting users is a sensitive operation. This function requires the `service_role` key to work,
 * so it MUST be called from a secure context like an Edge Function or using SECURITY DEFINER.
 *
 * CREATE OR REPLACE FUNCTION delete_user_by_admin(user_id_to_delete uuid)
 * RETURNS void
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * BEGIN
 *   -- You must check that the calling user is an admin.
 *   -- This is a simplified example. You should add a check here, e.g.:
 *   -- IF (SELECT role FROM public.profiles WHERE id = auth.uid()) <> 'ORGANIZER' THEN
 *   --   RAISE EXCEPTION 'Permission denied: must be an admin.';
 *   -- END IF;
 *
 *   DELETE FROM auth.users WHERE id = user_id_to_delete;
 * END;
 * $$;
 */
export const deleteUserByAdmin = async (userIdToDelete: string): Promise<void> => {
    const { error } = await supabase.rpc('delete_user_by_admin', { user_id_to_delete: userIdToDelete });
    if (error) throw error;
};

/*
 * --- SQL for `create_user_by_admin` function ---
 * This function allows an admin to create a new user with a specified role.
 *
 * CREATE OR REPLACE FUNCTION create_user_by_admin(
 *   p_username TEXT,
 *   p_password TEXT,
 *   p_role TEXT, -- e.g., 'FESTERO' or 'USER'
 *   p_creator_username TEXT
 * )
 * RETURNS json
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   new_user_id uuid;
 *   p_email TEXT := p_username || '@fiestaspantano.local';
 *   registration_details jsonb;
 * BEGIN
 *   -- Again, add a check to ensure the caller is an admin.
 *
 *   INSERT INTO auth.users (email, password, raw_user_meta_data, role)
 *   VALUES (p_email, crypt(p_password, gen_salt('bf')), jsonb_build_object('username', p_username), 'authenticated')
 *   RETURNING id INTO new_user_id;
 *
 *   IF p_role = 'FESTERO' THEN
 *     registration_details := jsonb_build_object('method', 'organizerCreation', 'details', p_creator_username);
 *   ELSE
 *     registration_details := jsonb_build_object('method', 'festeroCreation', 'details', p_creator_username);
 *   END IF;
 *   
 *   -- The trigger on auth.users should create the profile.
 *   -- We then update the profile with the correct role and registration method.
 *   UPDATE public.profiles
 *   SET
 *     role = p_role::public.role,
 *     "registrationMethod" = registration_details
 *   WHERE id = new_user_id;
 *
 *   RETURN (SELECT json_build_object('id', id, 'username', username, 'email', email, 'role', role) 
 *           FROM public.profiles WHERE id = new_user_id);
 * END;
 * $$;
 */
const createUserByAdmin = async (username: string, password: string, role: Role, creator: AuthUser): Promise<AuthUser> => {
    const { data, error } = await supabase.rpc('create_user_by_admin', {
        p_username: username,
        p_password: password,
        p_role: role,
        p_creator_username: creator.username
    });
    if (error) throw error;
    return data as AuthUser;
}

export const createFesteroUser = async (username: string, password: string, creator: AuthUser): Promise<AuthUser> => {
    return createUserByAdmin(username, password, Role.FESTERO, creator);
};

export const createNormalUser = async (username: string, password:string, creator: AuthUser): Promise<AuthUser> => {
    return createUserByAdmin(username, password, Role.USER, creator);
};


// --- Raffle ---

export const getRaffle = async (): Promise<Raffle> => {
    const { data, error } = await supabase.from('raffle').select('*').single();
    if (error) throw error;
    return data;
};

export const updateRaffle = async (raffleData: Raffle): Promise<Raffle> => {
    const { data, error } = await supabase.from('raffle').update(raffleData).eq('id', raffleData.id).select().single();
    if (error) throw error;
    return data;
};