import { create } from "zustand";

const mainStore = create((set) => ({
  refresh: false,
  refreshNow: () => set((state) => ({ refresh: !state.refresh })),
}));

export default mainStore;
