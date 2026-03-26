import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminEmail: null,

      login: (email, password) => {
        // Simple authentication - in production, this would verify against a backend
        // For now, we'll use environment variable or hardcoded admin credentials
        const ADMIN_EMAIL = 'admin@hilltoppubandgrill.com';
        const ADMIN_PASSWORD = 'hilltop2024'; // TODO: Change this to environment variable

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true, adminEmail: email });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, adminEmail: null });
      },
    }),
    {
      name: 'hilltop-admin-auth',
      version: 1,
    }
  )
);

export default useAdminStore;
