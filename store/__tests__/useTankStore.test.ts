jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useTankStore } from "../useTankStore";

async function resetTankStore() {
  useTankStore.persist.clearStorage();
  useTankStore.setState({ tanks: [] });
  await useTankStore.persist.rehydrate();
}

describe("useTankStore", () => {
  beforeEach(async () => {
    jest.useFakeTimers({ now: new Date("2025-06-01T12:00:00.000Z") });
    await resetTankStore();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("addTank", () => {
    it("appends a tank with expected shape", () => {
      useTankStore.getState().addTank("Main", 120);

      const { tanks } = useTankStore.getState();
      expect(tanks).toHaveLength(1);
      expect(tanks[0]).toMatchObject({
        name: "Main",
        volumeLiters: 120,
        setupDate: "2025-06-01T12:00:00.000Z",
        fishIds: [],
        plantIds: [],
        reminders: [],
        readings: [],
      });
      expect(tanks[0].id).toEqual(expect.any(String));
      expect(tanks[0].id.length).toBeGreaterThan(0);
    });

    it("appends multiple tanks", () => {
      useTankStore.getState().addTank("A", 50);
      useTankStore.getState().addTank("B", 80);

      expect(useTankStore.getState().tanks.map((t) => t.name)).toEqual([
        "A",
        "B",
      ]);
    });
  });

  describe("deleteTank", () => {
    it("removes the tank with the given id", () => {
      useTankStore.getState().addTank("x", 10);
      const id = useTankStore.getState().tanks[0].id;

      useTankStore.getState().deleteTank(id);

      expect(useTankStore.getState().tanks).toHaveLength(0);
    });

    it("no-ops when id does not exist", () => {
      useTankStore.getState().addTank("x", 10);
      useTankStore.getState().deleteTank("missing");

      expect(useTankStore.getState().tanks).toHaveLength(1);
    });
  });

  describe("getTankById", () => {
    it("returns the tank when id matches", () => {
      useTankStore.getState().addTank("Find me", 40);
      const id = useTankStore.getState().tanks[0].id;

      const tank = useTankStore.getState().getTankById(id);

      expect(tank?.name).toBe("Find me");
    });

    it("returns undefined when id does not exist", () => {
      expect(useTankStore.getState().getTankById("nope")).toBeUndefined();
    });
  });

  describe("addReminder", () => {
    it("adds a reminder with nextDue from weekly frequency", () => {
      useTankStore.getState().addTank("T", 100);
      const tankId = useTankStore.getState().tanks[0].id;

      useTankStore.getState().addReminder(tankId, {
        type: "water-change",
        label: "WC",
        frequency: "weekly",
        enabled: true,
      });

      const tank = useTankStore.getState().getTankById(tankId)!;
      expect(tank.reminders).toHaveLength(1);
      const r = tank.reminders[0];
      expect(r).toMatchObject({
        tankId,
        type: "water-change",
        label: "WC",
        frequency: "weekly",
        enabled: true,
      });
      expect(r.nextDue).toBe("2025-06-08T12:00:00.000Z");
      expect(r.id).toEqual(expect.any(String));
    });

    it("does not change tanks when tankId is unknown", () => {
      useTankStore.getState().addTank("T", 100);
      const before = useTankStore.getState().tanks;

      useTankStore.getState().addReminder("unknown", {
        type: "custom",
        label: "x",
        frequency: "daily",
        enabled: true,
      });

      const after = useTankStore.getState().tanks;
      expect(after).toHaveLength(before.length);
      expect(after[0].reminders).toHaveLength(0);
    });
  });

  describe("markReminderDone", () => {
    it("sets lastDone and rolls nextDue by frequency", () => {
      useTankStore.getState().addTank("T", 100);
      const tankId = useTankStore.getState().tanks[0].id;
      useTankStore.getState().addReminder(tankId, {
        type: "params-check",
        label: "Test",
        frequency: "daily",
        enabled: true,
      });
      const reminderId = useTankStore.getState().tanks[0].reminders[0].id;

      jest.setSystemTime(new Date("2025-07-01T09:00:00.000Z"));
      useTankStore.getState().markReminderDone(tankId, reminderId);

      const r = useTankStore.getState().getTankById(tankId)!.reminders[0];
      expect(r.lastDone).toBe("2025-07-01T09:00:00.000Z");
      expect(r.nextDue).toBe("2025-07-02T09:00:00.000Z");
    });

    it("leaves reminders unchanged when ids do not match", () => {
      useTankStore.getState().addTank("T", 100);
      const tankId = useTankStore.getState().tanks[0].id;
      useTankStore.getState().addReminder(tankId, {
        type: "custom",
        label: "R",
        frequency: "monthly",
        enabled: true,
      });
      const original = useTankStore.getState().tanks[0].reminders[0];

      useTankStore.getState().markReminderDone(tankId, "wrong-id");

      const r = useTankStore.getState().tanks[0].reminders[0];
      expect(r).toEqual(original);
    });
  });

  describe("deleteReminder", () => {
    it("removes the reminder", () => {
      useTankStore.getState().addTank("T", 100);
      const tankId = useTankStore.getState().tanks[0].id;
      useTankStore.getState().addReminder(tankId, {
        type: "filter-clean",
        label: "F",
        frequency: "biweekly",
        enabled: true,
      });
      const reminderId = useTankStore.getState().tanks[0].reminders[0].id;

      useTankStore.getState().deleteReminder(tankId, reminderId);

      expect(
        useTankStore.getState().getTankById(tankId)!.reminders,
      ).toHaveLength(0);
    });
  });

  describe("addReading", () => {
    it("prepends a reading with id and date", () => {
      useTankStore.getState().addTank("T", 100);
      const tankId = useTankStore.getState().tanks[0].id;

      useTankStore.getState().addReading(tankId, { ph: 7.0, temperature: 26 });

      const readings = useTankStore.getState().getTankById(tankId)!.readings;
      expect(readings).toHaveLength(1);
      expect(readings[0]).toMatchObject({
        ph: 7,
        temperature: 26,
        date: "2025-06-01T12:00:00.000Z",
      });
      expect(readings[0].id).toEqual(expect.any(String));
    });

    it("prepends newer readings first", () => {
      useTankStore.getState().addTank("T", 100);
      const tankId = useTankStore.getState().tanks[0].id;

      useTankStore.getState().addReading(tankId, { ph: 6.5 });
      jest.setSystemTime(new Date("2025-06-02T12:00:00.000Z"));
      useTankStore.getState().addReading(tankId, { ph: 7.2 });

      const readings = useTankStore.getState().getTankById(tankId)!.readings;
      expect(readings.map((x) => x.ph)).toEqual([7.2, 6.5]);
    });
  });

  describe("deleteReading", () => {
    it("removes the reading", () => {
      useTankStore.getState().addTank("T", 100);
      const tankId = useTankStore.getState().tanks[0].id;
      useTankStore.getState().addReading(tankId, { gh: 8 });
      const readingId = useTankStore.getState().tanks[0].readings[0].id;

      useTankStore.getState().deleteReading(tankId, readingId);

      expect(
        useTankStore.getState().getTankById(tankId)!.readings,
      ).toHaveLength(0);
    });
  });
});
