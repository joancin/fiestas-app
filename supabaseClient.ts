import { createClient } from '@supabase/supabase-js';
import { AuthUser } from './types';

// =================================================================================
// =================================================================================
//
//    >>> ¡ATENCIÓN! ESTE ES EL FICHERO QUE DEBES MODIFICAR <<<
//
//    La aplicación no funcionará hasta que reemplaces las credenciales
//    de ejemplo de abajo con las tuyas propias de Supabase.
//
// =================================================================================
// =================================================================================

// =================================================================================
// ¡ACCIÓN CRÍTICA! - ¡DEBES EDITAR ESTE FICHERO!
// =================================================================================
// Los valores de abajo son EJEMPLOS FALSOS para que la aplicación arranque.
// DEBES REEMPLAZARLOS con las credenciales REALES de tu proyecto de Supabase.
//
// 1. Ve a tu proyecto en https://supabase.com/
// 2. Ve a "Project Settings" (icono de engranaje en el menú de la izquierda).
// 3. Haz clic en "API" en el menú de configuración.
// 4. Copia tu "Project URL" y pégalo en la variable `supabaseUrl` de abajo.
// 5. Copia tu clave pública "anon" ("Project API key") y pégala en `supabaseAnonKey`.
// =================================================================================
const supabaseUrl = 'https://twdnnaardhczqtcyfvsp.supabase.co'; // <-- ¡REEMPLAZA ESTO!
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3ZG5uYWFyZGhjenF0Y3lmdnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzE3MDIsImV4cCI6MjA3NjgwNzcwMn0.khn1223_rsTQ6y0MV_Lq4ODt_izT0ukvEiJqi_4RskQ'; // <-- ¡Y REEMPLAZA ESTO!

if (supabaseUrl.includes('ejemplo-proyecto') || supabaseAnonKey.includes('EJEMPLO')) {
  // Este mensaje solo se mostrará en la consola para recordarte que uses tus propias claves.
  console.warn(
    'Estás usando credenciales de ejemplo para Supabase. La aplicación no se conectará a tu base de datos hasta que las reemplaces en `supabaseClient.ts`.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función de ayuda para obtener el perfil del usuario actual
export const getUserProfile = async (userId: string): Promise<AuthUser | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
    return data as AuthUser;
}
