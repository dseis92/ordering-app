import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,

      // Initialize auth state
      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          set({ session, user: session?.user ?? null, loading: false });

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user ?? null });
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ loading: false });
        }
      },

      // Sign up
      signUp: async (email, password, fullName) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });

          if (error) throw error;
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      // Sign in
      signIn: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          set({ session: data.session, user: data.user });
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      // Sign out
      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ session: null, user: null });
          return { error: null };
        } catch (error) {
          return { error };
        }
      },

      // Update profile
      updateProfile: async (updates) => {
        try {
          const { data, error } = await supabase.auth.updateUser({
            data: updates,
          });

          if (error) throw error;
          set({ user: data.user });
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      // Reset password
      resetPassword: async (email) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (error) throw error;
          return { error: null };
        } catch (error) {
          return { error };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);

export default useAuthStore;
