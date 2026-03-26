const BASE_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

jest.mock("expo/virtual/env", () => ({ env: process.env }));

import { signIn, signUp, updateProfile } from "../firebase";

describe("firebase service", () => {
  beforeEach(() => {
    (global.fetch as unknown as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("returns mapped user when request succeeds", async () => {
      (global.fetch as unknown as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          localId: "uid-1",
          email: "user@example.com",
          idToken: "id-token",
          refreshToken: "refresh-token",
        }),
      });

      const result = await signUp("user@example.com", "secret123");

      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `${BASE_URL}:signUp?key=`,
      );
      expect((global.fetch as jest.Mock).mock.calls[0][1]).toEqual({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "user@example.com",
          password: "secret123",
          returnSecureToken: true,
        }),
      });
      expect(result).toEqual({
        uid: "uid-1",
        email: "user@example.com",
        idToken: "id-token",
        refreshToken: "refresh-token",
      });
    });

    it("throws mapped error when API returns known error code", async () => {
      (global.fetch as unknown as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "EMAIL_EXISTS" } }),
      });

      await expect(signUp("dup@example.com", "secret123")).rejects.toEqual({
        code: "EMAIL_EXISTS",
        message: "Email đã được sử dụng",
      });
    });
  });

  describe("signIn", () => {
    it("returns mapped user including displayName when request succeeds", async () => {
      (global.fetch as unknown as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          localId: "uid-2",
          email: "user@example.com",
          displayName: "Alice",
          idToken: "id-token-2",
          refreshToken: "refresh-token-2",
        }),
      });

      const result = await signIn("user@example.com", "secret123");

      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `${BASE_URL}:signInWithPassword?key=`,
      );
      expect((global.fetch as jest.Mock).mock.calls[0][1]).toEqual({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "user@example.com",
          password: "secret123",
          returnSecureToken: true,
        }),
      });
      expect(result).toEqual({
        uid: "uid-2",
        email: "user@example.com",
        displayName: "Alice",
        idToken: "id-token-2",
        refreshToken: "refresh-token-2",
      });
    });

    it("throws fallback error message for unknown error code", async () => {
      (global.fetch as unknown as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "SOME_NEW_ERROR" } }),
      });

      await expect(signIn("user@example.com", "wrong")).rejects.toEqual({
        code: "SOME_NEW_ERROR",
        message: "Đã có lỗi xảy ra, thử lại sau",
      });
    });
  });

  describe("updateProfile", () => {
    it("sends profile update payload and resolves when successful", async () => {
      (global.fetch as unknown as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await expect(updateProfile("id-token", "Alice")).resolves.toBeUndefined();

      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `${BASE_URL}:update?key=`,
      );
      expect((global.fetch as jest.Mock).mock.calls[0][1]).toEqual({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: "id-token",
          displayName: "Alice",
          returnSecureToken: false,
        }),
      });
    });

    it("throws mapped error when update fails", async () => {
      (global.fetch as unknown as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "INVALID_ID_TOKEN" } }),
      });

      await expect(updateProfile("bad-token", "Alice")).rejects.toEqual({
        code: "INVALID_ID_TOKEN",
        message: "Đã có lỗi xảy ra, thử lại sau",
      });
    });
  });
});
