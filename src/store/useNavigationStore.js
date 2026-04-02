import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNavigationStore = create(
  persist(
    (set) => ({
      page: 'landing',
      setPage: (page) => set({ page }),
    }),
    {
      name: 'navigation-storage',
    }
  )
);

export default useNavigationStore;
