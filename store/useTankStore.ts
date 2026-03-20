import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tank, Reminder, TankReading } from "@/types";

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function nextDueDate(frequency: Reminder["frequency"]): string {
  const now = new Date();
  const days: Record<Reminder["frequency"], number> = {
    daily: 1,
    "every-3-days": 3,
    weekly: 7,
    biweekly: 14,
    monthly: 30,
  };
  now.setDate(now.getDate() + days[frequency]);
  return now.toISOString();
}

interface TankState {
  tanks: Tank[];

  addTank: (name: string, volumeLiters: number) => void;
  deleteTank: (id: string) => void;
  getTankById: (id: string) => Tank | undefined;

  addReminder: (
    tankId: string,
    data: Omit<Reminder, "id" | "tankId" | "nextDue">,
  ) => void;
  markReminderDone: (tankId: string, reminderId: string) => void;
  deleteReminder: (tankId: string, reminderId: string) => void;
  addReading: (
    tankId: string,
    reading: Omit<TankReading, "id" | "date">,
  ) => void;
  deleteReading: (tankId: string, readingId: string) => void;
}

export const useTankStore = create<TankState>()(
  persist(
    (set, get) => ({
      tanks: [],

      addTank: (name, volumeLiters) => {
        const tank: Tank = {
          id: uid(),
          name,
          volumeLiters,
          setupDate: new Date().toISOString(),
          fishIds: [],
          plantIds: [],
          reminders: [],
          readings: [],
        };
        set((s) => ({ tanks: [...s.tanks, tank] }));
      },

      deleteTank: (id) => {
        set((s) => ({ tanks: s.tanks.filter((t) => t.id !== id) }));
      },

      getTankById: (id) => get().tanks.find((t) => t.id === id),

      addReminder: (tankId, data) => {
        const reminder: Reminder = {
          ...data,
          id: uid(),
          tankId,
          nextDue: nextDueDate(data.frequency),
        };
        set((s) => ({
          tanks: s.tanks.map((t) =>
            t.id === tankId
              ? { ...t, reminders: [...t.reminders, reminder] }
              : t,
          ),
        }));
      },

      markReminderDone: (tankId, reminderId) => {
        set((s) => ({
          tanks: s.tanks.map((t) =>
            t.id === tankId
              ? {
                  ...t,
                  reminders: t.reminders.map((r) =>
                    r.id === reminderId
                      ? {
                          ...r,
                          lastDone: new Date().toISOString(),
                          nextDue: nextDueDate(r.frequency),
                        }
                      : r,
                  ),
                }
              : t,
          ),
        }));
      },

      deleteReminder: (tankId, reminderId) => {
        set((s) => ({
          tanks: s.tanks.map((t) =>
            t.id === tankId
              ? {
                  ...t,
                  reminders: t.reminders.filter((r) => r.id !== reminderId),
                }
              : t,
          ),
        }));
      },
      addReading: (tankId, data) => {
        const reading: TankReading = {
          ...data,
          id: uid(),
          date: new Date().toISOString(),
        };
        set((s) => ({
          tanks: s.tanks.map((t) =>
            t.id === tankId ? { ...t, readings: [reading, ...t.readings] } : t,
          ),
        }));
      },

      deleteReading: (tankId, readingId) => {
        set((s) => ({
          tanks: s.tanks.map((t) =>
            t.id === tankId
              ? { ...t, readings: t.readings.filter((r) => r.id !== readingId) }
              : t,
          ),
        }));
      },
    }),
    {
      name: "tank-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.tanks = state.tanks.map((t) => ({
            ...t,
            readings: t.readings ?? [],
          }));
        }
      },
    },
  ),
);
