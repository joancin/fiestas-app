import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import * as api from '../services/api';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, accessCode: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async (supabaseUser: SupabaseUser | null) => {
      if (supabaseUser) {
        const profile = await api.getCurrentUserProfile(supabaseUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUser(session?.user ?? null);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const loggedInUser = await api.login(username, password);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.username}!`);
      return true;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, accessCode: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser = await api.register(username, password, accessCode);
      setUser(newUser);
      toast.success(`Welcome, ${newUser.username}! You are now logged in.`);
      return true;
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    toast.success("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
