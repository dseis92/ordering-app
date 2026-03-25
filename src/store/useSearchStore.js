import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSearchStore = create(
  persist(
    (set, get) => ({
      recentSearches: [],

      // Add a search to recent history
      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed || trimmed.length < 2) return;

        const state = get();
        const filtered = state.recentSearches.filter(s => s !== trimmed);
        const updated = [trimmed, ...filtered].slice(0, 10); // Keep last 10

        set({ recentSearches: updated });
      },

      // Remove a specific search
      removeRecentSearch: (query) => {
        const state = get();
        set({
          recentSearches: state.recentSearches.filter(s => s !== query),
        });
      },

      // Clear all recent searches
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'hilltop-search-history',
      version: 1,
    }
  )
);

export default useSearchStore;
