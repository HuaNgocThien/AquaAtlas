import { create } from "zustand";
import { Fish, Plant } from "@/types";
import fishData from "@/data/fish.json";
import plantData from "@/data/plants.json";

interface WikiState {
  fish: Fish[];
  plants: Plant[];
  bookmarkedFishIDs: string[];
  bookmarkedPlantIDs: string[];

  toggleFishBookmark: (id: string) => void;
  togglePlantBookmark: (id: string) => void;
  isFishBookmarked: (id: string) => boolean;
  isPlantBookmarked: (id: string) => boolean;
  getFishByID: (id: string) => Fish | undefined;
  getPlantByID: (id: string) => Plant | undefined;
}

export const useWikiStore = create<WikiState>((set, get) => ({
  fish: fishData as unknown as Fish[],
  plants: plantData as unknown as Plant[],
  bookmarkedFishIDs: [],
  bookmarkedPlantIDs: [],

  toggleFishBookmark: (id: string) => {
    const { bookmarkedFishIDs } = get();
    const next = bookmarkedFishIDs.includes(id)
      ? bookmarkedFishIDs.filter((x) => x !== id)
      : [...bookmarkedFishIDs, id];
    set({ bookmarkedFishIDs: next });
  },

  togglePlantBookmark: (id: string) => {
    const { bookmarkedPlantIDs } = get();
    const next = bookmarkedPlantIDs.includes(id)
      ? bookmarkedPlantIDs.filter((x) => x !== id)
      : [...bookmarkedPlantIDs, id];
    set({ bookmarkedPlantIDs: next });
  },

  isFishBookmarked: (id: string) => get().bookmarkedFishIDs.includes(id),
  isPlantBookmarked: (id: string) => get().bookmarkedPlantIDs.includes(id),
  getFishByID: (id: string) => get().fish.find((f) => f.id === id),
  getPlantByID: (id: string) => get().plants.find((p) => p.id === id),
}));
