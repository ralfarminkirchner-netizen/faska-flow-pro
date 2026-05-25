import { create } from 'zustand';

const useAdventureStore = create((set) => ({
  inventory: [],
  activeVerb: 'WALK', // 'WALK', 'LOOK', 'USE', 'TALK', 'TAKE', etc.
  selectedItem: null,
  message: '',
  flags: {},

  // Actions
  setActiveVerb: (verb) => set({ activeVerb: verb }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  setMessage: (msg) => set({ message: msg }),
  addToInventory: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  removeFromInventory: (itemId) => set((state) => ({
    inventory: state.inventory.filter((i) => i.id !== itemId)
  })),
  setFlag: (key, value) => set((state) => ({
    flags: { ...state.flags, [key]: value }
  })),
}));
export default useAdventureStore;
