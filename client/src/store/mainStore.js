import { create } from "zustand";

const mainStore = create((set) => ({
  refresh: false,
  refreshNow: () => set((state) => ({ refresh: !state.refresh })),
  city: null,
  setCity: (city) => set((state) => ({ city: city })),
  boxes: null,
  setBoxes: (boxes) => set((state) => ({ boxes: boxes })),
  showBookingModal: false,
  setShowBookingModal: (val) => set((state) => ({ showBookingModal: val })),
  chosenBoxId: null,
  setChosenBoxId: (val) => set((state) => ({ chosenBoxId: val })),
}));

export default mainStore;
