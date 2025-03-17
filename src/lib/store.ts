import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { SortBy, SortDirection } from "./types";

interface SearchState {
  selectedBreeds: string[];
  ageMin?: number;
  ageMax?: number;
  match?: string;
  favorites: Record<string, boolean>;
  sortBy: SortBy;
  sortDirection: SortDirection;
  setSelectedBreeds: (breeds: string[]) => void;
  setMatch: (match?: string) => void;
  setAgeMin: (age?: number) => void;

  setAgeMax: (age?: number) => void;
  toggleFavorites: (id: string) => void;
  clearFavorites: () => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleSortDirection: () => void;
}

const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    const storedValue = searchParams.get(key) ?? "";
    return JSON.parse(storedValue);
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.set(key, JSON.stringify(newValue));
    location.hash = searchParams.toString();
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.delete(key);
    location.hash = searchParams.toString();
  },
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      selectedBreeds: [],
      ageMin: undefined,
      ageMax: undefined,
      favorites: {},
      sortBy: SortBy.Breed,
      match: undefined,
      sortDirection: SortDirection.Ascending,
      setSelectedBreeds: (breeds) => set({ selectedBreeds: breeds }),
      setAgeMin: (age) => set({ ageMin: age }),
      setAgeMax: (age) => set({ ageMax: age }),
      setMatch: (match) => set({ match }),
      toggleFavorites: (id) =>
        set((state) => {
          const newFavorites = { ...state.favorites };
          if (state.favorites[id]) {
            delete newFavorites[id];
          } else {
            newFavorites[id] = true;
          }
          return { favorites: newFavorites };
        }),
      clearFavorites: () => set({ favorites: {} }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortDirection: (direction) => set({ sortDirection: direction }),
      toggleSortDirection: () =>
        set((state) => ({
          sortDirection:
            state.sortDirection === SortDirection.Ascending
              ? SortDirection.Descending
              : SortDirection.Ascending,
        })),
    }),
    {
      name: "dog-search", // unique name for localStorage key
      storage: createJSONStorage(() => hashStorage),
      partialize: (state) => ({
        // Only persist these fields
        selectedBreeds: state.selectedBreeds,
        ageMin: state.ageMin,
        ageMax: state.ageMax,
        sortBy: state.sortBy,
        sortDirection: state.sortDirection,
      }),
    }
  )
);
