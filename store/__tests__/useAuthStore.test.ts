jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("../../services/firebase", () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  updateProfile: jest.fn(),
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import { signIn, signUp, updateProfile } from "../../services/firebase";
import { useAuthStore } from "../useAuthStore";

const mockSignIn = signIn as jest.Mock;
const mockSignUp = signUp as jest.Mock;
const mockUpdateProfile = updateProfile as jest.Mock;

const FAKE_USER = {
  uid: "uid-123",
  email: "test@example.com",
  idToken: "token-abc",
  refreshToken: "refresh-xyz",
  displayName: null,
};

async function resetAuthStore() {
  useAuthStore.persist.clearStorage();
  useAuthStore.setState({ user: null, isLoading: false, error: null });
  await useAuthStore.persist.rehydrate();
}

describe("useAuthStore", () => {
  beforeEach(async () => {
    await resetAuthStore();
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("starts with user null, isLoading false, error null", () => {
      const { user, isLoading, error } = useAuthStore.getState();

      expect(user).toBeNull();
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
  });

  describe("login", () => {
    it("sets user and clears isLoading on success", async () => {
      mockSignIn.mockResolvedValue(FAKE_USER);

      await useAuthStore.getState().login("test@example.com", "password123");

      const { user, isLoading, error } = useAuthStore.getState();
      expect(user).toEqual(FAKE_USER);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });

    it("calls signIn with the exact credentials supplied by the caller", async () => {
      mockSignIn.mockResolvedValue(FAKE_USER);

      await useAuthStore.getState().login("a@b.com", "pass");

      expect(mockSignIn).toHaveBeenCalledWith("a@b.com", "pass");
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });

    it("sets isLoading to true while the request is in flight", () => {
      let resolveSignIn!: (value: typeof FAKE_USER) => void;
      mockSignIn.mockReturnValue(
        new Promise<typeof FAKE_USER>((resolve) => {
          resolveSignIn = resolve;
        }),
      );

      useAuthStore.getState().login("x@y.com", "pw");

      expect(useAuthStore.getState().isLoading).toBe(true);

      resolveSignIn(FAKE_USER);
    });

    it("stores the error message and clears isLoading when signIn rejects", async () => {
      mockSignIn.mockRejectedValue(new Error("Invalid credentials"));

      await useAuthStore.getState().login("bad@email.com", "wrong");

      const { user, isLoading, error } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(isLoading).toBe(false);
      expect(error).toBe("Invalid credentials");
    });
  });

  describe("register", () => {
    it("stores user with displayName merged when both calls succeed", async () => {
      mockSignUp.mockResolvedValue(FAKE_USER);
      mockUpdateProfile.mockResolvedValue(undefined);

      await useAuthStore
        .getState()
        .register("test@example.com", "password123", "Alice");

      const { user, isLoading, error } = useAuthStore.getState();
      expect(user).toEqual({ ...FAKE_USER, displayName: "Alice" });
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });

    it("calls updateProfile with the idToken from signUp and the given displayName", async () => {
      mockSignUp.mockResolvedValue(FAKE_USER);
      mockUpdateProfile.mockResolvedValue(undefined);

      await useAuthStore.getState().register("x@y.com", "pw", "Bob");

      expect(mockUpdateProfile).toHaveBeenCalledWith(FAKE_USER.idToken, "Bob");
    });

    it("does not call updateProfile when signUp rejects", async () => {
      mockSignUp.mockRejectedValue(new Error("Email already in use"));

      await useAuthStore.getState().register("dup@email.com", "pw", "Carol");

      expect(mockUpdateProfile).not.toHaveBeenCalled();
    });

    it("sets error and keeps user null when signUp rejects", async () => {
      mockSignUp.mockRejectedValue(new Error("Email already in use"));

      await useAuthStore.getState().register("dup@email.com", "pw", "Carol");

      const { user, error } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(error).toBe("Email already in use");
    });

    it("sets error and keeps user null when updateProfile rejects after signUp succeeds", async () => {
      mockSignUp.mockResolvedValue(FAKE_USER);
      mockUpdateProfile.mockRejectedValue(new Error("Profile update failed"));

      await useAuthStore.getState().register("x@y.com", "pw", "Dave");

      const { user, error, isLoading } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(error).toBe("Profile update failed");
      expect(isLoading).toBe(false);
    });
  });

  describe("logout", () => {
    it("clears user and error when the user is logged in", async () => {
      mockSignIn.mockResolvedValue(FAKE_USER);
      await useAuthStore.getState().login("test@example.com", "pw");
      useAuthStore.setState({ error: "some previous error" });

      useAuthStore.getState().logout();

      const { user, error, isLoading } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(error).toBeNull();
      expect(isLoading).toBe(false);
    });

    it("is a safe no-op when called while already logged out", () => {
      expect(() => useAuthStore.getState().logout()).not.toThrow();
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe("clearError", () => {
    it("sets error to null", () => {
      useAuthStore.setState({ error: "Something went wrong" });

      useAuthStore.getState().clearError();

      expect(useAuthStore.getState().error).toBeNull();
    });

    it("is safe to call when error is already null", () => {
      expect(() => useAuthStore.getState().clearError()).not.toThrow();
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe("persist", () => {
    it("persists only user field to auth-storage", async () => {
      mockSignIn.mockResolvedValue(FAKE_USER);

      await useAuthStore.getState().login("test@example.com", "pw");

      const setItemCalls = (
        AsyncStorage.setItem as jest.Mock
      ).mock.calls.filter((call) => call[0] === "auth-storage");
      expect(setItemCalls.length).toBeGreaterThan(0);

      const lastPayload = setItemCalls[setItemCalls.length - 1][1];
      const persisted = JSON.parse(lastPayload);
      expect(persisted.state.user).toEqual(FAKE_USER);
      expect(persisted.state.isLoading).toBeUndefined();
      expect(persisted.state.error).toBeUndefined();
    });
  });
});
