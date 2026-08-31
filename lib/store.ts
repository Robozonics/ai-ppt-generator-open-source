import { create } from "zustand";
import { PresentationDeck, Card } from "./schema";

interface DeckState {
  deck: PresentationDeck | null;
  activeCardIndex: number;
  activeCardId: string | null;
  isLoading: boolean;

  setDeck: (deck: PresentationDeck) => void;
  setActiveCardIndex: (index: number) => void;
  setActiveCard: (id: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;

  updateCard: (id: string, newCardData: Partial<Card>) => void;
  deleteCard: (index: number) => void;
}

export const useDeckStore = create<DeckState>((set) => ({
  deck: null,
  activeCardIndex: 0,
  activeCardId: null,
  isLoading: false,

  setDeck: (deck) => set({ deck, activeCardIndex: 0, activeCardId: null }),

  setActiveCardIndex: (index) => set({ activeCardIndex: index }),

  setActiveCard: (id) => set({ activeCardId: id }),

  setIsLoading: (isLoading) => set({ isLoading }),

  updateCard: (id, newCardData) =>
    set((state) => {
      if (!state.deck) return state;
      const newCards = state.deck.cards.map((card) =>
        card.id === id ? { ...card, ...newCardData } : card
      );
      return { deck: { ...state.deck, cards: newCards } };
    }),

  deleteCard: (index) =>
    set((state) => {
      if (!state.deck) return state;
      const newCards = [...state.deck.cards];
      newCards.splice(index, 1);
      return {
        deck: { ...state.deck, cards: newCards },
        activeCardIndex: Math.min(
          state.activeCardIndex,
          Math.max(0, newCards.length - 1)
        ),
        activeCardId: null,
      };
    }),
}));
